import { useState } from "react"
import { DeleteRegular, FolderOpenRegular, PlayRegular } from "@fluentui/react-icons";
import { DropZone } from "./components/DropZone";
import { Merge } from "./utils/Merge";
import { useModalService } from "./contexts/ModalContext";
import * as XLSX from "xlsx-js-style";
import { ProgressBar } from "./components/ProgressBar";
import { AnimatePresence, motion } from "framer-motion";

type SOAFile = {
  id: number;
  file: File;
  cabang: string;
}

function App() {

  const modalService = useModalService();
  const [isBusy,setBusy] = useState(false);
  const [soas,setSoas] = useState<SOAFile[]>([]);
  let idSeq: number = 0;

  function handleFilePicker(pickFiles: FileList | null) {
    if (pickFiles == null) return;
    
    const newSoas: SOAFile[] = [...soas];

    const arrayPickFile: File[] = [...pickFiles];

    arrayPickFile.forEach(file => {
      const fileName: string = file.name.replace(/\.xlsx?$/i, "");
      const cabangName: string | null = fileName.split(`_`)[1];
      const newFile: SOAFile = {
        id: idSeq++,
        file: file,
        cabang: !cabangName ? fileName : cabangName,
      }
      newSoas.push(newFile);
    });

    setSoas(newSoas);

  }

  function handleFileDrop(dropFiles: File[] | null) {
    if (dropFiles == null) return;
    
    const newSoas: SOAFile[] = [...soas];

    dropFiles.forEach(file => {
      const fileName: string = file.name.replace(/\.xlsx?$/i, "");
      const cabangName: string | null = fileName.split(`_`)[0];
      const newFile: SOAFile = {
        id: idSeq++,
        file: file,
        cabang: !cabangName ? fileName : cabangName,
      }
      newSoas.push(newFile);
    });

    setSoas(newSoas);

  }

  function ChangeCabangName(inputText: string, id: number)
  {
    const newSoas: SOAFile[] = [...soas];
    newSoas[id].cabang = inputText;
    setSoas(newSoas);
  }

  function DeleteSoa(e: React.MouseEvent, id: number)
  {
    e.preventDefault();
    setSoas([...soas].filter(e => e.id !== id));
  }

  function ClearSoa(e: React.MouseEvent)
  {
    e.preventDefault();
    setSoas([]);
  }

  async function MergeAndDownload()
  {

    console.log("test");

    setBusy(true);

    try{
      const merged = await Merge(soas.map(soa => soa.file));

      setBusy(false);

      const result = await modalService.ShowModal({
        title: "Success",
        body: <p>SOA has been successfully merged.</p>,
        primaryText:"Download",
        secondaryText:"Cancel",
      });

      if (result == "primary")
      {
        // Download
        XLSX.writeFile(
            merged,
            "MergedSOA.xlsx"
        );
      }

    }
    catch(er)
    {
      setBusy(false);

      await modalService.ShowModal({
        title: "Error",
        body: <p>{er as string}</p>
      });
    }

  }

  return (
    <main className="w-screen h-screen p-8">
      <div className="flex flex-col shadow-xl rounded-lg h-full card w-200 m-auto">

        <div className={`${soas.length == 0 ? "flex-1 min-h-0" : ""} relative p-4 flex flex-col gap-4`}>
          
          <ProgressBar isIndeterminate={isBusy} className="absolute left-0 -bottom-px w-full"/>

          <div className="flex items-baseline justify-between gap-2">
            <h1 className="font-medium">ULI SOA Merger</h1>
            <p className="text-xs text-font-secondary">Made by Matthew</p>
          </div>

          {soas.length == 0 ? (
            <div className="flex-1 w-full min-h-0">
              <DropZone className="h-full w-full rounded-lg" accept=".xls,.xlsx" onFilesDropped={(e) => handleFileDrop(e)}/> 
            </div>
          ) : ( 
          <div className="flex flex-row gap-3 relative shrink-0 items-center">
            <input 
              disabled={isBusy}
              id="file-add-input"
              type="file" 
              multiple 
              accept=".xls,.xlsx" 
              className="hidden" 
              onChange={(e) => handleFilePicker(e.target.files)}
            />

            <label 
              htmlFor="file-add-input"
              className={`flex flex-row gap-2 justify-center items-center button ${isBusy ? "disabled" : ""}`}>
              <FolderOpenRegular fontSize={20}/>
              <p>Add</p>
            </label>

            <button disabled={isBusy} className="flex flex-row gap-2 justify-center items-center button" onClick={(e) => ClearSoa(e)}>
              <DeleteRegular fontSize={20}/>
              <p>Clear</p>
            </button>

            <button disabled={isBusy} className="flex flex-row gap-2 justify-center items-center button-primary"
            onClick={MergeAndDownload}>
              <PlayRegular fontSize={20}/>
              <p>Merge</p>
            </button>

            <div className="vl"/>

            <div className="card p-2 text-sm">
              <p>{`SOA Files: ${soas.length}`}</p>
            </div>

          </div>
          )}
        </div>

        <AnimatePresence>
        {(soas.length > 0) && (

          <motion.div 

          className="p-4 space-y-2 overflow-auto scrollbar-thumb-control scrollbar-thin border-t border-stroke"
          >
              {
                soas?.map(soa => (
                  <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  key={soa.id} className="card py-1 px-3 flex flex-row items-center justify-between gap-2 shadow-xs">
                    <p className="truncate min-w-0 flex-1 text-xs">{soa.file.name}</p>
                    <input 
                      disabled={isBusy}
                      className="w-full max-w-80 shrink-0 inputBox text-xs" 
                      type="text" 
                      onChange={(e) => ChangeCabangName(e.target.value, soa.id)} 
                      value={soa.cabang}
                    />
                    <button disabled={isBusy} className="button-reveal h-full w-fit">
                      <DeleteRegular fontSize={18} onClick={(e) => DeleteSoa(e, soa.id)}/>
                    </button>
                </motion.div>
                ))
              }
              
          </motion.div>

        )}
        </AnimatePresence>

      </div>
        
    </main>
  )
}

export default App

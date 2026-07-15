import * as XLSX from "xlsx-js-style";

const HeaderStyle: XLSX.CellStyle = {
    font: {
        name: "open sans",
        sz: 10,
        bold: true,
        color: { rgb: "FFFFFF" }
    },
    fill: {
        patternType: "solid",
        fgColor: { rgb: "00CCFF" },
        bgColor: { rgb: "00CCFF" }
    },
    alignment: {
        horizontal: "left",
        vertical: "bottom"
    }
};

const DataStyle: XLSX.CellStyle = {
    font: {
        name: "open sans",
        sz: 10,
        color: { rgb: "000000" }
    },
    alignment: {
        horizontal: "left",
        vertical: "bottom"
    }
};

const ColumnFormats: Record<string, { type: string; format: string }> = {
    "Invoice Amount": {
        type: "n",
        format: `_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-`
    },
    "Paid Amount": {
        type: "n",
        format: `_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-`
    },
    "Payable Amount": {
        type: "n",
        format: `_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-`
    },
    "Open Amount": {
        type: "n",
        format: `_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-`
    },
    "Dispute Amount": {
        type: "n",
        format: `_-* #,##0.00_-;-* #,##0.00_-;_-* "-"??_-;_-@_-`
    },
};

export async function Merge(files: File[]): Promise<XLSX.WorkBook> {

    if (files.length === 0)
        throw new Error("Please select at least one Excel file.");

    const mergedRows: unknown[][] = [];

    for (let i = 0; i < files.length; i++) {

        const file = files[i];

        const cabang = file.name.split("_")[0];

        const buffer = await file.arrayBuffer();

        const workbook = XLSX.read(buffer, {
            type: "array",
            cellDates: true,
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        let rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: ""
        });

        rows = rows.map((row, index) => {

            const newRow = [...row];

            newRow.splice(
                2,
                0,
                index === 0 ? "Cabang" : cabang
            );

            return newRow;

        });

        if (i === 0)
            mergedRows.push(...rows);
        else
            mergedRows.push(...rows.slice(1));

    }

    const mergedSheet = XLSX.utils.aoa_to_sheet(mergedRows);

    const headers = mergedRows[0] as string[];

    // Apply styles and formats
    for (let r = 0; r < mergedRows.length; r++) {
        for (let c = 0; c < headers.length; c++) {

            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = mergedSheet[addr];

            if (!cell) continue;

            // Header
            if (r === 0) {
                cell.s = structuredClone(HeaderStyle);
                continue;
            }

            // Data style
            cell.s = structuredClone(DataStyle);

            const header = headers[c];
            const format = ColumnFormats[header];

            if (!format) continue;

            if (format.type === "n") {

                let value = cell.v;

                if (typeof value === "string") {
                    value = value
                        .trim()
                        .replace(/,/g, "")          // remove thousand separator
                        .replace(/[^\d.-]/g, "");   // remove currency symbols, spaces, etc.
                }

                const number = Number(value);

                if (!Number.isNaN(number)) {
                    cell.v = number;
                    cell.t = "n";
                    cell.z = format.format;
                }

            }
        }
    }

    // Optional column widths
    mergedSheet["!cols"] = headers.map(() => ({ wch: 18 }));

    // Optional header height
    mergedSheet["!rows"] = [{ hpx: 22 }];


    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        mergedSheet,
        "Merged"
    );

    return workbook;
}
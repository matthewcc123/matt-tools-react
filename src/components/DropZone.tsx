import { ArrowUploadRegular } from '@fluentui/react-icons';
import React, { useState, useRef, type DragEvent, type ChangeEvent } from 'react';

interface DropZoneProps {
  onFilesDropped?: (files: File[]) => void;
  className?: string;
  accept?: string; // e.g., "image/*", ".pdf,.docx"
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped, className = '', accept }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to turn "image/*, .pdf" into a human-readable "IMAGE, PDF" string
  const formatAcceptedTypes = (types: string) => {
    return types
      .split(',')
      .map(type => type.replace('.', '').replace('/*', '').toUpperCase().trim())
      .join(', ');
  };

  // Handles drag entry and movement over the drop zone
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  // Handles the actual drop event
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (!e.dataTransfer.files || !onFilesDropped) return;

    const files = Array.from(e.dataTransfer.files);

    const acceptedFiles = files.filter(file => isFileAccepted(file, accept));

    onFilesDropped(acceptedFiles);
  };

  // Handle accepted files
  const isFileAccepted = (file: File, accept?: string): boolean => {
    if (!accept) return true;

    const acceptRules = accept
      .split(",")
      .map(rule => rule.trim().toLowerCase());

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return acceptRules.some(rule => {
      // Extension (.pdf, .docx)
      if (rule.startsWith(".")) {
        return fileName.endsWith(rule);
      }

      // Wildcard MIME (image/*)
      if (rule.endsWith("/*")) {
        const category = rule.slice(0, -1); // "image/"
        return fileType.startsWith(category);
      }

      // Exact MIME (application/pdf)
      return fileType === rule;
    });
  };

  // Handles files selected via the standard file explorer click
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0 && onFilesDropped) {
      const addedFiles: File[] = [...e.target.files];
      onFilesDropped(addedFiles);
    }
  };

  // Triggers the hidden input click when the wrapper div is clicked
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded cursor-pointer transition-colors duration-200 ease-in-out select-none
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50/500' 
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept} // Restricts the standard click-to-upload prompt
        className="hidden"
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
        {/* Upload Icon */}
        <ArrowUploadRegular fontSize={24} className={`mb-3 transition-colors duration-200 ${
            isDragActive ? 'text-brand' : 'text-gray-400 dark:text-gray-500'
          }`}/>
        
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to select files</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {accept ? `Accepted formats: ${formatAcceptedTypes(accept)}` : "Any file format supported"}
        </p>
      </div>
    </div>
  );
};
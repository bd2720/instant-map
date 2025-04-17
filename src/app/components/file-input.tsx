"use client";

import { useRef, type ChangeEvent } from 'react';
import Button from './button';
import { type FileFormat } from '../page';

interface FileInputProps {
  fileFormat: FileFormat
  handleFile: (file: File) => void
  clearFile: () => void
}

export default function FileInput({ fileFormat, handleFile, clearFile }: FileInputProps){
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // indirectly click the hidden file input button
  function handleClick(){
    hiddenFileInput.current?.click();
  }

  // upload file
  function handleChange(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files?.length){
      const file = e.target.files[0];
      console.log('Imported:', file);
      handleFile(file);
    }
  }

  function handleReset(){
    clearFile();
    // clear file from file input
    if(!hiddenFileInput.current) return;
    hiddenFileInput.current.value = "";
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <>
        <Button onClick={handleClick}>
          Import
        </Button>
        <input
          key={fileFormat}
          accept={`.${fileFormat}`}
          type="file"
          ref={hiddenFileInput}
          className="hidden"
          onChange={handleChange}
        />
      </>
      <Button onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
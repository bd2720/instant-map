"use client";

import { useRef, type ChangeEvent } from 'react';
import Button from './button';
import { type FileFormat } from '../page';

interface FileInputProps {
  fileFormat: FileFormat
  handleFile: (file: File) => void
}

export default function FileInput({ fileFormat, handleFile }: FileInputProps){
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

  return (
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
  );
}
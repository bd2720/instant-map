"use client";

import { useRef, type ChangeEvent } from 'react';
import Button from './button';
import { type FileFormat } from '../page';
import { useSampleData } from '../hooks/useSampleData';

const sampleFilename = 'sample.geojson';

interface FileInputProps {
  fileFormat: FileFormat
  disabled?: boolean
  handleFile: (file: File) => void
  clearFile: () => void
  setError: (e: string) => void
  setLoading: (l: boolean) => void
  setFilename: (f: string) => void
}

export default function FileInput({ fileFormat, disabled = false, handleFile, clearFile, setError, setLoading, setFilename }: FileInputProps){
  // ref to file input HTML element
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // generates handler for loading sample data
  const handleSample = useSampleData(hiddenFileInput, sampleFilename, setError, setLoading);

  // indirectly click the hidden file input button
  function handleClick(){
    // handle sample file
    if(fileFormat === 'sample'){
      setFilename(sampleFilename);
      setLoading(true);
      handleSample(); // loading will be set to false inside handleSample promises
    } else {
      hiddenFileInput.current?.click();
    }
  }

  // upload file
  function handleChange(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files?.length){
      const file = e.target.files[0];
      handleFile(file);
    }
  }

  function handleReset(){
    clearFile();
    // clear file input
    if(!hiddenFileInput.current) return;
    hiddenFileInput.current.value = "";
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <>
        <Button disabled={disabled} onClick={handleClick}>
          Import
        </Button>
        <input
          key={fileFormat}
          accept={(fileFormat !== 'sample') ? `.${fileFormat}` : '.geojson'}
          type="file"
          ref={hiddenFileInput}
          className="hidden"
          onChange={handleChange}
        />
      </>
      <Button disabled={disabled} onClick={handleReset}>
        Reset
      </Button>
    </div>
  );
}
"use client";

import FileFormats from './file-formats';
import FileInput from './file-input';
import Button from './button';
import { type FileFormat } from '../page';

interface SidebarProps {
  hasData: boolean
  filename: string
  fileFormat: FileFormat
  setFileFormat: (f: FileFormat) => void
  error: string
  handleFile: (file: File) => void
  clearFile: () => void
}

export default function Sidebar({ hasData, filename, fileFormat, setFileFormat, error, handleFile, clearFile }: SidebarProps){
  return (
    <div className="bg-slate-400 h-full p-4 overflow-hidden">
      <FileFormats fileFormat={fileFormat} setFileFormat={setFileFormat} />
      <div className="flex flex-wrap justify-center gap-2">
        <FileInput fileFormat={fileFormat} handleFile={handleFile} />
        <Button onClick={clearFile}>
          Reset
        </Button>
      </div>
      {error ? (
        <>
          <p className="font-light text-xl text-center py-4">
            Failed to import data from "{filename}"
          </p>
          <p className="text-red-600 font-bold text-center">
            {error}
          </p>
        </>
      ) : hasData ? (
        <p className="font-light text-xl text-center py-4">
          Successfully imported data from "{filename}"
        </p>
      ) : (
        <p className="font-light text-xl text-center py-4">
          Nothing imported yet.
        </p>
      )
      
      }
    </div>
  );
}

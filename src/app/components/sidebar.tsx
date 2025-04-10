"use client";

import FileInput from './file-input';
import Button from './button';
import { FeatureCollection } from 'geojson';
import { error } from 'console';

interface SidebarProps {
  data: FeatureCollection | null
  error: string
  handleFile: (file: File) => void
  clearFile: () => void
}

export default function Sidebar({ data, error, handleFile, clearFile }: SidebarProps){
  return (
    <div className="bg-slate-400 h-full p-4 overflow-hidden">
      <div className="flex flex-wrap justify-center gap-2">
        <FileInput handleFile={handleFile} />
        <Button onClick={clearFile}>
          Reset
        </Button>
      </div>
      {error ? (
        <>
          <p className="font-light text-xl text-center py-4">
            Failed to import data!
          </p>
          <p className="text-red-600 font-bold text-center">
            {error}
          </p>
        </>
      ) : data && (
        <p className="font-light text-xl text-center py-4">
          Successfully imported data!
        </p>
      )
      
      }
    </div>
  );
}

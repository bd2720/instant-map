"use client";

import FileInput from './file-input';
import Button from './button';
import { FeatureCollection } from 'geojson';

interface SidebarProps {
  data: FeatureCollection | null
  handleFile: (file: File) => void
  clearFile: () => void
}

export default function Sidebar({ data, handleFile, clearFile }: SidebarProps){
  return (
    <div className="bg-slate-400 h-full p-4 overflow-hidden">
      <div className="flex flex-wrap justify-center gap-2">
        <FileInput handleFile={handleFile} />
        <Button onClick={clearFile}>
          Reset
        </Button>
      </div>
      <p className="font-light text-xl text-center py-4">
        {data ? `Successfully imported data!` : `Nothing imported yet.`}
      </p>
    </div>
  );
}

"use client";

import FileInput from './file-input';
import Button from './button';
import { FeatureCollection } from 'geojson';
import Radio from './radio';

interface SidebarProps {
  data: FeatureCollection | null
  filename: string
  fileFormat: "csv" | "geojson"
  setFileFormat: (f: "csv" | "geojson") => void
  error: string
  handleFile: (file: File) => void
  clearFile: () => void
}

export default function Sidebar({ data, filename, fileFormat, setFileFormat, error, handleFile, clearFile }: SidebarProps){
  return (
    <div className="bg-slate-400 h-full p-4 overflow-hidden">
      <fieldset className="flex flex-col items-center pb-2">
        <legend className="text-xl font-weighted w-full text-center">File Format</legend>
        <Radio id="csv" name="format" value="csv" 
          checked={"csv" === fileFormat}
          onChange={() => setFileFormat("csv")}
        >
          CSV
        </Radio>
        <Radio id="geojson" name="format" value="geojson" 
          checked={"geojson" === fileFormat}
          onChange={() => setFileFormat("geojson")}
        >
          GeoJSON
        </Radio>
      </fieldset>
      <div className="flex flex-wrap justify-center gap-2">
        <FileInput handleFile={handleFile} />
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
      ) : data ? (
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

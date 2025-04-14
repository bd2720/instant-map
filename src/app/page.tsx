"use client";

import { useState } from 'react';
import Header from './components/header';
import Map from './components/map';
import Sidebar from './components/sidebar';
import { FeatureCollection, Point } from 'geojson';
import { validateGeojson } from './lib/validate';
import Papa from 'papaparse';

export default function Home() {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection<Point> | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<"csv" | "geojson">("geojson");
  const [error, setError] = useState<string>("");

  function handleCSV(text: string){
    
  }

  function handleGeoJSON(text: string){
    // to JSON
    const json = JSON.parse(text);
    // validate as GeoJSON (FeatureCollection)
    const geojson = validateGeojson(json);
    console.log(geojson);
    
    return geojson;
  }

  // handle file upload (parse as GeoJSON)
  async function handleFile(file: File){
    setFilename(file.name);
    try {
      // to string
      const text = await file.text();
      // convert based on format
      let g;
      if(fileFormat === 'geojson'){
        g = handleGeoJSON(text);
      }
      // update state
      if(!g) throw new Error("Unrecognized file format.");
      setGeojsonData(g);
      setError("");
    } catch(err: unknown){
      console.error(`Error while parsing file "${file.name}":`, err);
      setGeojsonData(null);
      setError((err instanceof Error) ? `Error: ${err.message}` : `Error while parsing file.`);
    }
  }

  function handleReset(){
    setGeojsonData(null);
    setFilename("");
    setError("");
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex flex-1">
        <div className="w-[80%] h-full">
          <Map data={geojsonData} />
        </div>
        <div className="w-[20%] h-full">
          <Sidebar 
            hasData={!!geojsonData} 
            filename={filename}
            fileFormat={fileFormat}
            setFileFormat={setFileFormat}
            error={error}
            handleFile={handleFile}
            clearFile={handleReset}
          />
        </div>
      </main>
    </div>
  );
}

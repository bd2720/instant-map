"use client";

import { useState } from 'react';
import Header from './components/header';
import Map from './components/map';
import Sidebar from './components/sidebar';
import { FeatureCollection } from 'geojson';
import { validateGeojson } from './lib/validate';

export default function Home() {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [error, setError] = useState<string>("");

  // handle file upload (parse as GeoJSON)
  async function handleFile(file: File){
    setFilename(file.name);
    try {
      // to string
      const text = await file.text();
      // to JSON
      const json = JSON.parse(text);
      // validate as GeoJSON (FeatureCollection)
      const geojson: FeatureCollection = validateGeojson(json);
      console.log(geojson);
      // update state
      setGeojsonData(geojson);
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
            data={geojsonData} 
            filename={filename}
            error={error}
            handleFile={handleFile}
            clearFile={handleReset}
          />
        </div>
      </main>
    </div>
  );
}

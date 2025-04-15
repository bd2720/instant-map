"use client";

import { useState } from 'react';
import Header from './components/header';
import Map from './components/map';
import Sidebar from './components/sidebar';
import { FeatureCollection, Point } from 'geojson';
import { validateGeojson } from './lib/validate';

export type FileFormat = "csv" | "json" | "geojson";

async function convertCSV(file: File){
  // TODO
}

async function convertJSON(file: File){
  // to string
  const text = await file.text();
  // to JSON
  const json = JSON.parse(text);
  //
}

async function convertGeoJSON(file: File){
  // to string
  const text = await file.text();
  // to JSON
  const json = JSON.parse(text);
  // validate as GeoJSON (FeatureCollection)
  const geojson = validateGeojson(json);
  return geojson;
}

const converterMap = {
  'csv': convertCSV, 
  'json': convertJSON, 
  'geojson': convertGeoJSON
}

export default function Home() {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection<Point> | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<FileFormat>("geojson");
  const [error, setError] = useState<string>("");

  // handle file upload (parse as GeoJSON)
  async function handleFile(file: File){
    setFilename(file.name);
    try {
      // convert based on format
      //const data = await converterMap[fileFormat](file);
      const data = await convertGeoJSON(file);
      // update state
      if(!data) throw new Error("Unrecognized file format.");
      setGeojsonData(data);
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

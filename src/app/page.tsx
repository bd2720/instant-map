"use client";

import { useState } from 'react';
import Header from './components/header';
import Map from './components/map';
import Sidebar from './components/sidebar';
import { FeatureCollection, Point } from 'geojson';
import { validateJson, validateGeojson } from './lib/validate';
import { convertJson } from './lib/convert';

export type FileFormat = "csv" | "json" | "geojson" | "sample";

async function toCSV(file: File){
  // TODO
}

async function toJSON(file: File){
  // to string
  const text = await file.text();
  // to JSON
  const json = JSON.parse(text);
  // validate
  const validatedJson = validateJson(json);
  // convert to geojson
  const geojson = convertJson(validatedJson);
  return geojson;
}

async function toGeoJSON(file: File){
  // to string
  const text = await file.text();
  // to JSON
  const json = JSON.parse(text);
  // validate as GeoJSON (FeatureCollection)
  const geojson = validateGeojson(json);
  return geojson;
}

const converterMap = {
  'csv': toCSV, 
  'json': toJSON, 
  'geojson': toGeoJSON,
  'sample': toGeoJSON
}

export default function Home() {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection<Point> | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<FileFormat>("geojson");
  const [error, setError] = useState<string>("");

  // handle file upload (parse as GeoJSON)
  async function handleFile(file: File){
    if(!file) throw new Error("File is undefined.");
    setFilename(file.name);
    try {
      // convert based on format
      const data = await converterMap[fileFormat](file);
      //const data = await toGeoJSON(file);
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

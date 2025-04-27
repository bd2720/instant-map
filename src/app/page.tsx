"use client";

import { useState } from 'react';
import Header from './components/header';
import Map from './components/map';
import Sidebar from './components/sidebar';
import { FeatureCollection, Point } from 'geojson';
import { validateJsonCoord, validateJsonAddr, validateGeojson } from './lib/validate';
import { convertJson } from './lib/convert';
import { ZodError } from 'zod';
import { parse, ParseResult } from 'papaparse';
import { geocode } from './lib/geocode';

export type FileFormat = "csv" | "json" | "geojson" | "sample";

// validates, geocodes and/or parses Object to GeoJSON
function parsedToGeojson(data: Object[], useAddress: boolean){
  // validate based on useAddress
  if(useAddress){
    // validate with address schema
    const validatedAddrJson = validateJsonAddr(data);
    // geocode (returns a FeatureCollection)
    const geocodedJson = geocode(validatedAddrJson);
    return geocodedJson;
  } else {
    // validate, then convert to FeatureCollection
    const validatedJson = validateJsonCoord(data);
    // convert to geojson
    const geojson = convertJson(validatedJson);
    return geojson;
  }
}

async function fromCSV(file: File, useAddress: boolean){
  const parserPromise: Promise<ParseResult<Object>> = new Promise((resolve, reject) => {
    // Papa parse
    parse<Object>(file, { 
      delimiter: ",",
      header: true,
      complete: (results, _) => {
        resolve(results);
      },
      error: (errors, _) => {
        reject(errors);
      }
    });
  });
  // to JSON (Papa parse)
  const { data } = await parserPromise;
  return parsedToGeojson(data, useAddress);
}

async function fromJSON(file: File, useAddress: boolean){
  // to string
  const text = await file.text();
  // to JSON
  const json = JSON.parse(text);
  return parsedToGeojson(json, useAddress);

}

async function fromGeoJSON(file: File){
  // to string
  const text = await file.text();
  // to JSON
  const json = JSON.parse(text);
  // validate as GeoJSON (FeatureCollection)
  return validateGeojson(json);
}

const converterMap = {
  'csv': fromCSV, 
  'json': fromJSON, 
  'geojson': fromGeoJSON,
  'sample': fromGeoJSON
}

export default function Home() {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection<Point> | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [fileFormat, setFileFormat] = useState<FileFormat>("geojson");
  const [error, setError] = useState<string>("");
  const [useAddress, setUseAddress] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // handle file upload (parse as GeoJSON)
  async function handleFile(file: File){
    if(!file) throw new Error("File is undefined.");
    setFilename(file.name);
    try {
      // convert based on format
      const data = await converterMap[fileFormat](file, useAddress);
      // update state
      if(!data) throw new Error("Unrecognized file format.");
      setGeojsonData(data);
      setError("");
    } catch(err: unknown){
      console.error(`Error while parsing file "${file.name}":`, err);
      setGeojsonData(null);
      // construct error string
      if(err instanceof Error){
        if(err instanceof ZodError){
          const issue = err.issues[0];
          const pathStr = issue.path.length ? `"${issue.path.join('.')}"` : '(Object root)';
          if(issue){
            setError(`Error: ${issue.message}. Path: ${pathStr}`);
          } else {
            setError(`Error while parsing file "${file.name}"`);
          }
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError(`Error while parsing file "${file.name}"`);
      }
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
          <Map data={geojsonData} mapLoaded={mapLoaded} onLoad={() => setMapLoaded(true)} />
        </div>
        <div className="w-[20%] h-full">
          <Sidebar 
            hasData={!!geojsonData} 
            numFeatures={geojsonData?.features.length} 
            filename={filename}
            fileFormat={fileFormat}
            setFileFormat={setFileFormat}
            useAddress={useAddress}
            setUseAddress={setUseAddress}
            error={error}
            handleFile={handleFile}
            clearFile={handleReset}
            mapLoaded={mapLoaded}
          />
        </div>
      </main>
    </div>
  );
}

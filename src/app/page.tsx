"use client";

import { useState } from 'react';
import Map from './components/map';
import Sidebar from './components/sidebar';
import { FeatureCollection, Point } from 'geojson';
import { validateJsonCoord, validateJsonAddr, validateGeojson } from './lib/validate';
import { convertJson } from './lib/convert';
import { geocode } from './lib/geocode';
import { ZodError } from 'zod';
import { parse, ParseResult } from 'papaparse';

export type FileFormat = "csv" | "json" | "xml" | "geojson" | "sample";

// validates, geocodes and/or parses object to GeoJSON
function parsedToGeojson(data: object[], useAddress: boolean){
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
  const parserPromise: Promise<ParseResult<object>> = new Promise((resolve, reject) => {
    // Papa parse
    parse<object>(file, { 
      delimiter: ",",
      header: true,
      complete: (results) => {
        resolve(results);
      },
      error: (errors) => {
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

async function fromXML(file: File, useAddress: boolean){
  // to string
  const text = await file.text();
  // to JSON (TODO)
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
  'xml': fromXML,
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
  const [mapError, setMapError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // handle file upload (parse as GeoJSON)
  async function handleFile(file: File){
    if(!file) throw new Error("File is undefined.");
    setFilename(file.name);
    setLoading(true);
    try {
      // convert based on format
      const data = await converterMap[fileFormat](file, useAddress);
      // update state
      if(!data) throw new Error("The selected file format is not yet supported.");
      setGeojsonData(data);
      setError("");
      setLoading(false);
    } catch(err: unknown){
      console.error(`Error while parsing file "${file.name}":`, err);
      setGeojsonData(null);
      setLoading(false);
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
    setLoading(false);
  }

  return (
    <main className="flex flex-1 flex-col md:flex-row">
      <div className="w-full h-[600px] md:w-[80%] md:h-full">
        <Map 
          data={geojsonData}
          mapLoaded={mapLoaded}
          mapError={mapError}
          onLoad={() => setMapLoaded(true)}
          onError={(e) => setMapError(e.error.message)}
        />
      </div>
      <div className="w-full md:h-[600px] md:w-[20%] md:h-full">
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
          disableFileInput={!mapLoaded || mapError.length > 0 || loading}
          loading={loading}
        />
      </div>
    </main>
  );
}

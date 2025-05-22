"use client";

import FileFormats from './file-formats';
import FileInput from './file-input';
import { type FileFormat } from '../page';
import FileInfo from './file-info';
import Geometries from './geometries';

interface SidebarProps {
  hasData: boolean
  numFeatures: number | undefined
  filename: string
  fileFormat: FileFormat
  setFileFormat: (f: FileFormat) => void
  useAddress: boolean
  setUseAddress: (use: boolean) => void
  error: string
  setError: (e: string) => void
  handleFile: (file: File) => void
  clearFile: () => void
  disableFileInput: boolean
  loading: boolean
  setLoading: (l: boolean) => void
  setFilename: (f: string) => void
}

export default function Sidebar({ hasData, numFeatures, filename, fileFormat, setFileFormat, useAddress, setUseAddress, error, setError, handleFile, clearFile, disableFileInput, loading, setLoading, setFilename }: SidebarProps){
  const showGeometries = fileFormat !== 'geojson' && fileFormat !== 'sample';
  return (
    <div className="bg-slate-400 h-full p-4 overflow-hidden">
      <FileFormats fileFormat={fileFormat} setFileFormat={setFileFormat} />
      <Geometries disabled={!showGeometries} useAddress={(showGeometries) ? useAddress : false} setUseAddress={setUseAddress} />
      <FileInput fileFormat={fileFormat} disabled={disableFileInput} handleFile={handleFile} clearFile={clearFile} setError={setError} setLoading={setLoading} setFilename={setFilename} />
      <FileInfo hasData={hasData} numFeatures={numFeatures} filename={filename} error={error} loading={loading} />
    </div>
  );
}

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
  handleFile: (file: File) => void
  clearFile: () => void
  disableFileInput: boolean
}

export default function Sidebar({ hasData, numFeatures, filename, fileFormat, setFileFormat, useAddress, setUseAddress, error, handleFile, clearFile, disableFileInput }: SidebarProps){
  const showGeometries = (fileFormat === 'csv' || fileFormat === 'json');
  return (
    <div className="bg-slate-400 h-full p-4 overflow-hidden">
      <FileFormats fileFormat={fileFormat} setFileFormat={setFileFormat} />
      <Geometries disabled={!showGeometries} useAddress={(showGeometries) ? useAddress : false} setUseAddress={setUseAddress} />
      <FileInput fileFormat={fileFormat} disabled={disableFileInput} handleFile={handleFile} clearFile={clearFile} />
      <FileInfo hasData={hasData} numFeatures={numFeatures} filename={filename} error={error} />
    </div>
  );
}

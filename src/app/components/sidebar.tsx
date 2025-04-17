"use client";

import FileFormats from './file-formats';
import FileInput from './file-input';
import { type FileFormat } from '../page';
import FileInfo from './file-info';

interface SidebarProps {
  hasData: boolean
  filename: string
  fileFormat: FileFormat
  setFileFormat: (f: FileFormat) => void
  error: string
  handleFile: (file: File) => void
  clearFile: () => void
}

export default function Sidebar({ hasData, filename, fileFormat, setFileFormat, error, handleFile, clearFile }: SidebarProps){
  return (
    <div className="bg-slate-400 h-full p-4 overflow-hidden">
      <FileFormats fileFormat={fileFormat} setFileFormat={setFileFormat} />
      <FileInput fileFormat={fileFormat} handleFile={handleFile} clearFile={clearFile} />
      <FileInfo hasData={hasData} filename={filename} error={error} />
    </div>
  );
}

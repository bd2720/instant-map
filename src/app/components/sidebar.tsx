"use client";

import FileInput from './file-input';

export default function Sidebar(){
  return (
    <div className="bg-slate-400 h-full p-4 flex flex-col items-center">
      <FileInput handleFile={(file) => console.log('Uploaded:', file)} />
    </div>
  );
}

import { type FileFormat } from '../page';
import Radio from './radio';

const formats: {
  id: FileFormat, name: string
}[] = [
  {id: "csv", name: "CSV"},
  {id: "xlsx", name: "XLSX"},
  {id: "xml", name: "XML"},
  {id: "json", name: "JSON"},
  {id: "geojson", name: "GeoJSON"},
  {id: "sample", name: "Sample"},
];

interface FileFormatsProps {
  fileFormat: FileFormat
  setFileFormat: (f: FileFormat) => void
}

export default function FileFormats({ fileFormat, setFileFormat }: FileFormatsProps){
  return (
    <fieldset className="flex flex-col items-center pb-2">
      <legend className="text-xl font-weighted w-full text-center">File Format</legend>
      {formats.map(f => (
        <Radio
          key={f.id}
          id={f.id}
          name="format"
          value={f.id}
          checked={f.id === fileFormat}
          onChange={() => setFileFormat(f.id)}
        >
          {f.name}
        </Radio>
      ))}
    </fieldset>
  )
}
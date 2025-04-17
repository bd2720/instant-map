import { type FileFormat } from '../page';
import Radio from './radio';


interface FileFormatsProps {
  fileFormat: FileFormat
  setFileFormat: (f: FileFormat) => void
}

export default function FileFormats({ fileFormat, setFileFormat }: FileFormatsProps){
  return (
    <fieldset className="flex flex-col items-center pb-2">
      <legend className="text-xl font-weighted w-full text-center">File Format</legend>
      <Radio id="csv" name="format" value="csv" 
        checked={"csv" === fileFormat}
        onChange={() => setFileFormat("csv")}
      >
        CSV
      </Radio>
      <Radio id="json" name="format" value="json" 
        checked={"json" === fileFormat}
        onChange={() => setFileFormat("json")}
      >
        JSON
      </Radio>
      <Radio id="geojson" name="format" value="geojson" 
        checked={"geojson" === fileFormat}
        onChange={() => setFileFormat("geojson")}
      >
        GeoJSON
      </Radio>
    </fieldset>
  )
}
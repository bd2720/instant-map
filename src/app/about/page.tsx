import Header from "../components/header";

export default function Home() {
  return (
    <div className="h-screen">
      <Header/>
      <main className="text-lg text-slate-400 bg-slate-900 p-4 sm:px-[20%]">
        <h2 className="text-3xl text-slate-200 font-semibold mb-2">What is Instant Map?</h2>
        <p className="mb-4">
          Instant Map is an online mapping tool capable of transforming data of various formats into an interactive map feature.
          Upload a dataset with location attributes to create an <span className="font-thin italic text-slate-100">instant visualization</span> of your data,
          including interactive map markers that display each location&apos;s specific attribute values when clicked.
          Currently, three file formats and two geospatial representations are supported, allowing traditionally non-geospatial file formats to be mapped.
          Instant Map is a free demonstration of a service that can benefit data analysts, map makers, small business owners, or anyone who
          needs a complete solution that geocodes, converts, and maps data <span className="font-thin italic text-slate-100">all with a single click.</span>
        </p>
        <h2 className="text-3xl text-slate-200 font-semibold mb-2">How Does It Work?</h2>
        <ol className="list-decimal ml-12">
          <li className="mb-2">
            <h3 className="text-slate-200 font-semibold">Select the file format of your data:</h3>
            <ul className="list-disc ml-12 text-slate-200 font-thin">
              <li>CSV (must be comma-delineated)</li>
              <li>JSON</li>
              <li>GeoJSON (recommended)</li>
            </ul>
            The <span className="text-slate-200 font-thin">Sample</span> option automatically uploads the <a href="/sample.geojson" title="Download sample.geojson" download className="text-lg font-semibold hover:underline visited:text-slate-200">sample GeoJSON file (15KB)</a>.
            GeoJSON format is recommended due to its exclusive use of coordinates and default compatibility with mapping software.
          </li>
          <li className="mb-2">
          <h3 className="text-slate-200 font-semibold">Select the geographic representation present in your data:</h3>
            <ul className="list-disc ml-12 text-slate-200 font-thin">
              <li>Address</li>
              <li>Coordinates (recommended)</li>
            </ul>
            To use Instant Map, each item in your dataset must contain either coordinates (latitude/longitude) or a complete street address.
            Each address must be an accurate, complete street address.
            The address must be located in a field or column at the top level of your data and must be titled <span className="font-weighted text-slate-200">address</span>.
            Each pair of coordinates must consist of two decimals: latitude (-90 to 90) and longitude (-180 to 180).
            These fields must exist for each item at the top level of your dataset and must be titled <span className="font-weighted text-slate-200">latitude</span> and <span className="font-weighted text-slate-200">longitude</span> respectively.
            Because of the limitations in speed and capacity of the free geocoding service used, the address option supports a maximum of 20 items per dataset.
            If your dataset contains both types of representation, select coordinates.
            Coordinates are always recommended, as they are cheaper and quicker to map.
          </li>
          <li className="mb-2">
            <h3 className="text-slate-200 font-semibold">Click <span className="text-slate-200 font-thin">Upload</span> and watch your custom map feature take shape!</h3>
          </li>
        </ol>
        <h2 className="text-3xl text-slate-200 font-semibold mb-2">Map Interactions</h2>
        <p>
          The map can be panned, zoomed, and rotated using keyboard/mouse or touch controls.
          The navigation control buttons at the top right will also zoom and rotate the map.
          Once data is imported onto the map, you will see dark markers for each item in your dataset at the correct location.
          Use the controls at the top left to toggle the icon type between pins and dots.
          Click on a marker to open a popup window displaying the marker&apos;s properties.
          These correspond to the original fields or columns of the associated item in your dataset.
        </p>
      </main>
    </div>
  );
}
import Link from "../components/link";

export default function Home() {
  return (
    <main className="text-lg text-slate-400 bg-slate-900 p-4 sm:px-[20%] py-8">
      <h2 className="text-3xl text-slate-200 font-semibold mb-4">What is Instant Map?</h2>
      <p className="mb-8">
        <Link href="/" title="Home Page">Instant Map</Link> is an online mapping tool capable of transforming data of various formats into an interactive map feature.
        Upload a dataset with location attributes to create an <span className="font-semibold italic text-slate-100">instant visualization</span> of your data,
        including interactive map markers that display each location&apos;s specific attribute values when clicked.
        Currently, five file formats and two geospatial representations are supported, allowing traditionally non-geospatial file formats to be mapped.
        Instant Map is a free demonstration of a service that can benefit data analysts, map makers, small business owners, or anyone who
        needs a complete solution that geocodes, converts, and maps data <span className="font-semibold italic text-slate-100">all with a single click.</span>
      </p>
      <h2 className="text-3xl text-slate-200 font-semibold mb-4">How Do I Upload Data?</h2>
      <ol className="list-decimal ml-12 mb-8">
        <li className="mb-2">
          <h3>Select the file format of your data:</h3>
          <ul className="list-disc ml-12">
            <li>CSV</li>
            <li>XLSX</li>
            <li>XML</li>
            <li>JSON</li>
            <li>GeoJSON (recommended)</li>
            <li>Sample</li>
          </ul>
          CSV format must use the comma as a delimiter; fields whose values contain commas must be enclosed in double quotes.
          XLSX format will map data from only the first worksheet.
          XML format should contain one parent element, with each dataset item represented by a child element; each dataset item&apos;s keys and values must be encoded using attributes.
          JSON format should contain an array of objects.
          GeoJSON format is recommended due to its exclusive use of coordinates and default compatibility with mapping software.
          The Sample option automatically uploads the <a href="/sample.geojson" title="Download sample.geojson" download className="text-lg font-semibold hover:underline text-slate-200 visited:text-slate-400">sample GeoJSON file (15KB)</a>.
        </li>
        <li className="mb-2">
        <h3>Select the geographic representation present in your data:</h3>
          <ul className="list-disc ml-12">
            <li>Address</li>
            <li>Coordinates (recommended)</li>
          </ul>
          To use Instant Map, each item in your dataset must contain either coordinates (latitude/longitude) or a complete street address.
          To use addresses, each must be an accurate, complete street address.
          The address must be located in a field or column at the top level of each item in your dataset and must be titled <span className="text-slate-100 italic">address</span>.
          To use coordinates, each pair must consist of two decimals: latitude (-90 to 90) and longitude (-180 to 180).
          These fields must exist for each item at the top level of each item in your dataset and must be titled <span className="text-slate-100 italic">latitude</span> and <span className="text-slate-100 italic">longitude</span> respectively.
          Because of the limitations in speed and capacity of the free geocoding service used, the address option supports a maximum of 20 items per dataset.
          If your dataset contains both types of representation, select coordinates.
          Coordinates are always recommended, as they are cheaper and quicker to map.
        </li>
        <li className="mb-2">
          <h3>Click <span className="text-slate-200 font-semibold">Upload</span> and watch your custom map feature take shape!</h3>
        </li>
      </ol>
      <h2 className="text-3xl text-slate-200 font-semibold mb-4">Map Interactions</h2>
      <p className="mb-8">
        The map can be panned, zoomed, and rotated using keyboard/mouse or touch controls.
        The navigation control buttons at the top right will also zoom and rotate the map.
        Once data is imported onto the map, you will see dark markers for each item in your dataset at the correct location.
        Use the controls at the top left to toggle the icon type between pins and dots.
        Click on a marker to open a popup window displaying the marker&apos;s properties.
        These correspond to the original fields or columns of the associated item in your dataset.
        Moving the map will update the URL&apos;s path according to zoom level, latitude, and longitude, in that order.
      </p>
      <h2 className="text-3xl text-slate-200 font-semibold mb-2">Tech Stack</h2>
      <p className="mb-8">
        Instant Map is currently built on software that is either completely free or offers a free plan. 
        The frontend uses React and Tailwind CSS. 
        The frontend and backend are both provided through Next.js and written in TypeScript.
        Validation and parsing are assisted by the Zod, Papa Parse, SheetJS, and xml-js libraries.
        The map library used is <Link href="https://maplibre.org/" newTab>MapLibre</Link>, an open-source fork of Mapbox.
        Map tiles are generously provided by <Link href="https://openfreemap.org/" newTab>OpenFreeMap</Link>, a free, open-source map tile provider.
        The geocoding API (converts addresses to coordinates) is powered by the <Link href="https://www.geoapify.com/" newTab>Geoapify</Link> free plan.
        Upstash for Redis is used to assist with rate limiting the geocoding API and tracking daily use limits.
        Deployment, environment variables, and a cron job that resets the daily geocoding limit are managed through Vercel.
        Instant Map is open-source, and its <Link href="https://github.com/bd2720/instant-map" title="View source code on GitHub" newTab>source code</Link> is available on GitHub.
        Please feel free to fork the project to make changes, and do not hesitate to raise an issue if unexplained bugs or errors occur.
      </p>
      <h2 className="text-3xl text-slate-200 font-semibold mb-2">Why Not Mapbox?</h2>
      <p className="mb-4">
        <Link href="https://www.mapbox.com/" newTab>Mapbox</Link> is a business-oriented location platform with high customization and versatility. 
        It offers access to a map library, geocoding API, and more through a pay-as-you-go pricing system.
        Instant Map originally used Mapbox, both for the map feature and geocoding service.
        Using Mapbox, geocoding was quicker, cheaper, and could comfortably support many more addresses at a time.
        Their map library also provided useful shortcut features, such as SDF icons.
        For now, Instant Map has been migrated to free Mapbox alternatives due to issues with Mapbox&apos;s terms of service.
      </p>
      <p className="mb-4">
        Instant Map originally intended to use a proxy server to handle requests generated by the Mapbox map and geocoding.
        One of the security measures this proxy server offered is being able to hide the Mapbox access token required to call Mapbox APIs.
        A valid access token must be included in all Mapbox API calls, but this unfortunately introduces a vulnerability.
        Calling a Mapbox API from the frontend with an access token exposes that token to the frontend users.
        On any site that directly calls Mapbox API, malicious users can extract the public access token from the Network tab of developer tools,
        using it to make their own API calls from a REST client like Postman.
      </p>
      <p className="mb-4">
        Putting the Mapbox access token in the frontend is extremely detrimental to Mapbox&apos;s customers for the following reasons:
        Mapbox forbids the restriction of certain paid services on a token, for example, geocoding. 
        This means users can make unchecked amounts of API calls, which can eventually rack up unwanted charges.
        Mapbox does not support custom rate limiting either.
        Specifically, Mapbox does not offer developers any method of restricting a token to be used a certain amount of times,
        a common-sense feature that would allow smart developers to put a hard cap on the amount of money spent within each billing period.
      </p>
      <p className="mb-8">
        Instant Map initially solved this problem by proxying Mapbox APIs in order to enforce custom rate limiting, ensuring Mapbox API calls would remain within initial free limits.
        For example, if Mapbox allows 50,000 free monthly map instantiations before the next ones become paid, then a proxy could cap the number of calls made at 50,000 to guarantee free usage.
        The problem is that Mapbox prevents proxying any of their APIs in their terms of service, even if the sole reason is to hide the token for security or to set up rate limiting to prevent overuse.
        Through these restrictions, Mapbox prevents developers from mitigating their pay-as-you-go pricing in any way, even if every API call is accounted for;
        as a consequence, Instant Map has since migrated to alternate services that can be used safely and freely within their respective terms and conditions.
      </p>
    </main>
  );
}
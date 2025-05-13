import { JSONAddresses, GeoJSONSchema } from "./validate";

const GEOCODER_LIMIT = 20;
const DELAY = 1000; // ms

const geocoder = `/api/geocode`;

// define the API return type
interface GeocoderResult {
  results?: [
    {
      lon?: number
      lat?: number
    }
  ]
}

/** Geocodes a JSON object with addresses into longitude/latitude */
export async function geocode(addresses: JSONAddresses): Promise<GeoJSONSchema> {
  console.log('batch in:', addresses);
  // verify limit
  if(addresses.length > GEOCODER_LIMIT) {
    throw new Error(`Too many addresses (limit ${GEOCODER_LIMIT}, received ${addresses.length})`);
  }

  // create request fn for each address
  const requests = addresses.map((a, i) => {
    const address = a.address;
    return async () => {
      const res = await fetch(`${geocoder}?text=${encodeURIComponent(address)}`)
      if(!res.ok){
        throw new Error(`Geocoding failed for address ${i+1} (${address}): ${res.statusText}`)
      }
      const data: GeocoderResult = await res.json();
      
      if(data.results?.length){
        return data.results[0];
      } else {
        throw new Error(`Geocoding failed for address ${i+1}: ${address} (Address Not Found)`)
      }
    }
  });
  // execute each request with a delay
  let batch = []
  for(let i = 0; i < requests.length; i++){
    let req = requests[i];
    let [ _, res ] = await Promise.all([
      new Promise(delayRes => setTimeout(delayRes, DELAY)),
      req(),
    ])
    batch.push(res);
  }

  console.log('batch out:', batch);
  // map each location object to a feature
  const features = batch.map((result, i) => {
    // ensure coords are defined (address is valid)
    if(result.lon === undefined || result.lat === undefined){
      throw new Error(`Failed to geocode address ${i+1}. Please verify street address and try again.`);
    }
    // construct GeoJSON Feature
    return {
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [result.lon, result.lat] as [number, number],
      },
      properties: {
        ...addresses[i] // get properties from original address object
      }
    }
  });
  // construct and return final GeoJSON object
  return {
    type: "FeatureCollection" as const,
    features: features,
  };
}
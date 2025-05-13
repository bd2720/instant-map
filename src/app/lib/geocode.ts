import { JSONAddresses, GeoJSONSchema } from "./validate";

const MAX_ADDRESSES = 20; // cannot geocode more addresses than this at once
const MIN_CONFIDENCE = 0.8; // minimum confidence to consider address accurate
const MIN_DELAY = 1000; // (ms) wait at least this long to trigger next request

const geocoder = `/api/geocode`;

// define the API return type
interface GeocoderResult {
  results: [
    {
      lon?: number
      lat?: number
      rank: {
        confidence: number
        match_type: string
      }
    }
  ]
}

/** Geocodes a JSON object with addresses into longitude/latitude */
export async function geocode(addresses: JSONAddresses): Promise<GeoJSONSchema> {
  console.log('batch in:', addresses);
  // verify limit
  if(addresses.length > MAX_ADDRESSES) {
    throw new Error(`Too many addresses (limit ${MAX_ADDRESSES}, received ${addresses.length})`);
  }

  // create request fn for each address
  const requests = addresses.map((a, i) => {
    const address = a.address;
    return async () => {
      const res = await fetch(`${geocoder}?text=${encodeURIComponent(address)}`)
      if(!res.ok){
        const errorText = await res.text() || res.statusText;
        throw new Error(`Geocoding failed for address ${i+1} (${address}): ${errorText}`);
      }
      const data: GeocoderResult = await res.json();
      
      if(data.results.length){
        return data.results[0];
      } else {
        throw new Error(`Failed to geocode address ${i+1}: ${address} (Address Not Found)`)
      }
    }
  });
  // execute each request with a delay
  const batch = [];
  for(let i = 0; i < requests.length; i++){
    const geocodingRequest = requests[i];
    const results = await Promise.all([
      new Promise(delayRes => setTimeout(delayRes, MIN_DELAY)),
      geocodingRequest(),
    ])
    const geocodingResult = results[1];
    // validate result
    if(geocodingResult.lat === undefined || geocodingResult.lon === undefined || geocodingResult.rank.confidence < MIN_CONFIDENCE || geocodingResult.rank.match_type !== "full_match"){
      throw new Error(`Failed to geocode address ${i+1}. Please verify street address and try again.`);
    }
    
    batch.push(geocodingResult);
  }

  console.log('batch out:', batch);
  // map each location object to a feature
  const features = batch.map((result, i) => {
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
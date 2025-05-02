import { JSONAddresses, GeoJSONSchema } from "./validate";

// use map-proxy
const geocoder = `http://localhost:3000/api/map-proxy/search/geocode/v6/batch`;
const GEOCODER_LIMIT = 100;

// define the API return type
interface GeocoderResult {
  batch: GeoJSONSchema[]
}

/** Geocodes a JSON object with addresses into longitude/latitude */
export async function geocode(addresses: JSONAddresses): Promise<GeoJSONSchema> {
  // verify limit
  if(addresses.length > GEOCODER_LIMIT) {
    throw new Error(`Geocoding error: too many addresses (limit ${GEOCODER_LIMIT}, received ${addresses.length})`);
  }

  // use batch geocoding
  const apiBatch = addresses.map(a => ({
    types: ["address"], // want an address
    limit: 1, // limit number of results per address
    q: a.address
  }));
  console.log('batch in:', apiBatch);
  const geocodePromise: Promise<GeocoderResult> = new Promise((resolve, reject) => {
    fetch(geocoder, {
      method: "POST",
      body: JSON.stringify(apiBatch),
    })
      .then(async res => {
        if(!res.ok){ // API limit errors are caught here
          const errorText = await res.text();
          throw new Error(`${errorText}`);
        }
        return res.json();
      })
      .then(json => {
        resolve(json);
      })
      .catch(err => {
        reject(err);
      });
  });
  const { batch } = await geocodePromise;
  console.log('batch out:', batch);
  // results are a list of featurecollections; must map to just one
  const features = batch.map(result => result.features[0] ?? null);
  // insert properties from original object
  features.forEach((f, i) => {
    // error if the feature is null
    if(f === null){
      throw new Error(`Failed to geocode address ${i+1}. Please verify street address and try again.`);
    }
    const {address, ...properties} = addresses[i];
    f.properties = {
      address: address,
      ...properties
    }
  });

  return {
    type: "FeatureCollection" as const,
    features: features
  };
}
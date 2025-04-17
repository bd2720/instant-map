import { type JSONSchema, type GeoJSONSchema } from "./validate";

/** Convert a validated JSON Object (has geospatial fields) to GeoJSON */
export function convertJson(json: JSONSchema): GeoJSONSchema {
  // assemble feature array
  const features = json.map(obj => {
    // use rest syntax to get properties
    const {longitude, latitude, ...properties} = obj;
    return {
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [longitude, latitude] as [number, number],
      },
      properties: properties,
    }
  });
  // return final geojson object
  return {
    type: "FeatureCollection" as const,
    features: features,
  }
}
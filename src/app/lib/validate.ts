import { z } from 'zod';

// define geojson file format schema
const geojsonSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.object({
    type: z.literal("Feature"),
    geometry: z.object({
      type: z.literal("Point"),
      coordinates: z.tuple([
        z.coerce.number().min(-180).max(180),
        z.coerce.number().min(-90).max(90),
      ]),
    }),
    properties: z.object({}).passthrough() // preserve properties
  }).array(),
});

export type GeoJSONSchema = z.infer<typeof geojsonSchema>;

/** Validate GeoJSON Point data */
export function validateGeojson(data: Object){
  return geojsonSchema.parse(data);
}

// define json file format (need lon/lat)
const jsonSchema = z.object({
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
}).passthrough().array();

export type JSONSchema = z.infer<typeof jsonSchema>;

/** Validate JSON data (needs geospatial fields) */
export function validateJson(data: Object){
  return jsonSchema.parse(data);
}
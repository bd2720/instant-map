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
export function validateGeojson(data: object){
  return geojsonSchema.parse(data);
}

// define json file format (need lon/lat)
const jsonCoordSchema = z.object({
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
}).passthrough().array();

const jsonAddrSchema = z.object({
  address: z.string()
}).passthrough().array();

export type JSONCoords = z.infer<typeof jsonCoordSchema>;
export type JSONAddresses = z.infer<typeof jsonAddrSchema>;

/* Validate JSON data  */

export function validateJsonCoord(data: object){
  return jsonCoordSchema.parse(data);
}

export function validateJsonAddr(data: object){
  return jsonAddrSchema.parse(data);
}
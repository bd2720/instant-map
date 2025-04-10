import { z } from 'zod';

// define geojson file format schema
const geojsonSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.object({
    type: z.literal("Feature"),
    geometry: z.object({
      type: z.literal("Point"),
      coordinates: z.tuple([
        z.number().min(-180).max(180),
        z.number().min(-90).max(90),
      ]),
    }),
    properties: z.object({}).passthrough() // preserve properties
  }).array(),
});

/** Validate GeoJSON Point data */
export function validateGeojson(data: Object){
  return geojsonSchema.parse(data);
}
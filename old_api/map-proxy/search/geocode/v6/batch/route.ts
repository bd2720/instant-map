import { NextRequest } from "next/server";
import { limits } from "@/app/redis/limits";

const MAPBOX_BASE = 'https://api.mapbox.com';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

// User cannot geocode more than this many locations in one request
const GEOCODING_LIMIT = 100;

export async function POST(req: NextRequest){
  const url = new URL(req.url);
  const query = url.searchParams;

  // 403 if token invalid or permanent geocoding enabled
  if(!MAPBOX_TOKEN || (query.has('permanent') && query.get('permanent') !== 'false')){
    return new Response('Forbidden', { status: 403 });
  }

  // validate number of requests in batch
  const batch = await req.json();
  if(batch.length > GEOCODING_LIMIT){
    return new Response(`Too many locations in batch (received: ${batch.length}, max: ${GEOCODING_LIMIT})`, { status: 413 });
  }

  // use Redis to test and set limit
  const limitResponse = await limits('canRequestGeocoding', 'geocodingRequests', batch.length);
  if(limitResponse !== null) return limitResponse;

  // construct and fetch URL
  const fullUrl = `${MAPBOX_BASE}/search/geocode/v6/batch?access_token=${MAPBOX_TOKEN}`;
  const mapboxRes = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batch)
  });

  const contentType = mapboxRes.headers.get('content-type') || 'application/json';

  return new Response(mapboxRes.body, {
    status: mapboxRes.status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
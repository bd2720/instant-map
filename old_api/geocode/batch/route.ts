import { NextRequest } from "next/server";
import { limits } from "@/app/redis/limits";

const GEOCODER_BASE = 'https://api.geoapify.com';
const GEOCODER_TOKEN = process.env.GEOAPIFY_TOKEN;

// User cannot geocode more than this many locations in one request
const GEOCODING_LIMIT = 20;

/* POST used to create geocoding job */
export async function POST(req: NextRequest){
  // 403 if token invalid
  if(!GEOCODER_TOKEN){
    return new Response('Forbidden', { status: 403 });
  }

  // this route should not have any params
  const url = new URL(req.url);
  const query = url.searchParams;
  if(query.size > 0){
    return new Response('This route does not support search parameters', { status: 400 });
  }

  // validate requests in batch
  const batch: string[] = await req.json();
  if(batch.length > GEOCODING_LIMIT){
    return new Response(`Too many locations in batch (received: ${batch.length}, max: ${GEOCODING_LIMIT})`, { status: 400 });
  }

  // verify address strings are not empty
  for(let i = 0; i < batch.length; i++){
    const address = batch[i];
    if(address.length === 0){
      return new Response(`Address ${i+1} is empty`, { status: 400 });
    }
  }

  // use Redis to test and set limit
  // cost of request is 0.5 * locationCount + 1
  const limitResponse = await limits('canRequestGeocoding', 'geocodingRequests', Math.ceil(batch.length / 2) + 1);
  if(limitResponse !== null) return limitResponse;

  // construct and fetch URL
  const fullUrl = `${GEOCODER_BASE}/v1/batch/geocode/search?apiKey=${GEOCODER_TOKEN}`;
  const geocoderRes = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batch)
  });

  // remove token from body
  const resBody = await geocoderRes.json();
  const formattedBody = { id: resBody.id }
  const contentType = geocoderRes.headers.get('content-type') || 'application/json';
  return new Response(JSON.stringify(formattedBody), {
    status: geocoderRes.status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/* GET used to check status and results of the job with a given ID */
export async function GET(req: NextRequest){
  // 403 if token invalid
  if(!GEOCODER_TOKEN){
    return new Response('Forbidden', { status: 403 });
  }

  // this route should only have id param
  const url = new URL(req.url);
  const query = url.searchParams;
  const jobId = query.get('id');
  if(query.size !== 1 || !jobId){
    return new Response('Incorrect search parameters', { status: 400 });
  }

  // use Redis to test and set limit
  const limitResponse = await limits('canRequestGeocoding', 'geocodingRequests');
  if(limitResponse !== null) return limitResponse;

  // construct and fetch URL
  const fullUrl = `${GEOCODER_BASE}/v1/batch/geocode/search?apiKey=${GEOCODER_TOKEN}&id=${jobId}`;
  const geocoderRes = await fetch(fullUrl);

  const contentType = geocoderRes.headers.get('content-type') || 'application/json';
  return new Response(geocoderRes.body, {
    status: geocoderRes.status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
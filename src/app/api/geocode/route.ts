import { NextRequest } from "next/server";
import { limits, secLimit } from "@/app/redis/limits";

const GEOCODER_BASE = 'https://api.geoapify.com';
const GEOCODER_TOKEN = process.env.GEOAPIFY_TOKEN;

/* GET used to check status and results of the job with a given ID */
export async function GET(req: NextRequest){
  // 403 if token invalid
  if(!GEOCODER_TOKEN){
    return new Response('Forbidden', { status: 403 });
  }

  // this route should only have text param
  const url = new URL(req.url);
  const query = url.searchParams;
  const text = query.get('text');
  if(query.size !== 1 || !text){
    return new Response('Incorrect search parameters', { status: 400 });
  }

  // check API rate limit (per second)
  const { success } = await secLimit.limit('geoapify-limit-sec');
  if(!success){
    return new Response('Rate limit exceeded', { status: 429, headers: { 'Retry-After': '1000' } });
  }

  // use Redis to test and set API call limit (per day)
  const limitResponse = await limits('canRequestGeocoding', 'geocodingRequests');
  if(limitResponse !== null) return limitResponse;

  // construct and fetch URL
  const fullUrl = `${GEOCODER_BASE}/v1/geocode/search?apiKey=${GEOCODER_TOKEN}&text=${query.get('text')}&format=json&limit=1`;
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
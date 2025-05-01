import { NextRequest } from "next/server";

const MAPBOX_BASE = 'https://events.mapbox.com';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export async function POST(req: NextRequest){

  // 403 if token invalid or permanent geocoding enabled
  if(!MAPBOX_TOKEN){
    return new Response('Forbidden', { status: 403 });
  }

  // construct and fetch URL
  const fullUrl = `${MAPBOX_BASE}/events/v2?access_token=${MAPBOX_TOKEN}`;
  const body = await req.json();
  
  const mapboxRes = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
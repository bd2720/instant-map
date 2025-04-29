import { NextRequest } from "next/server";

const MAPBOX_BASE = 'https://api.mapbox.com';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export async function POST(req: NextRequest){
  const url = new URL(req.url);
  const query = url.searchParams;

  // 403 if token invalid or permanent geocoding enabled
  if(!MAPBOX_TOKEN || (query.has('permanent') && query.get('permanent') !== 'false')){
    return new Response('Forbidden', { status: 403 });
  }
  query.set('access_token', MAPBOX_TOKEN);

  // construct and fetch URL
  const fullUrl = `${MAPBOX_BASE}/search/geocode/v6/batch?${query.toString()}`;
  
  const mapboxRes = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: req.body,
    // @ts-expect-error: Node.js specific option
    duplex: 'half', // allow streaming request body in Node
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
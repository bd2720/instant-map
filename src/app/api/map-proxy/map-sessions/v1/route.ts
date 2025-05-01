import { NextRequest } from "next/server";

const MAPBOX_BASE = 'https://api.mapbox.com';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export async function GET(req: NextRequest){
  // 403 if token invalid or path not allowed
  if(!MAPBOX_TOKEN) {
    return new Response('Forbidden', { status: 403 });
  }

  const url = new URL(req.url);
  const query = url.searchParams;
  query.set('access_token', MAPBOX_TOKEN);

  // construct and fetch URL
  const fullUrl = `${MAPBOX_BASE}/map-sessions/v1?${query.toString()}`;
  
  const mapboxRes = await fetch(fullUrl);

  // extract values from Mapbox response
  const contentType = mapboxRes.headers.get('content-type') || 'application/octet-stream';

  // forward response body + staus + headers
  return new Response(mapboxRes.body, {
    status: mapboxRes.status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    }
  });
}


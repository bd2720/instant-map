import { NextRequest } from "next/server";

const ALLOWED_PATHS = [
  /^styles\/v1\//,
  /^tiles\/v[34]\//,
  /^fonts\/v1\//,
  /^sprites\/v1\//,
  /^v[34]\//
];

const MAPBOX_BASE = 'https://api.mapbox.com';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export async function GET(req: NextRequest, context: { params: { path: string[] } }){
  // await params, to fix an error, even though it shouldn't have any effect
  const { path } = await context.params;
  const joinedPath = path.join('/');
  
  // 403 if token invalid or path not allowed
  if(!MAPBOX_TOKEN || !ALLOWED_PATHS.some(rx => rx.test(joinedPath))) {
    return new Response('Forbidden', { status: 403 });
  }

  const url = new URL(req.url);
  const query = url.searchParams;
  query.set('access_token', MAPBOX_TOKEN);

  // construct and fetch URL
  const fullUrl = `${MAPBOX_BASE}/${joinedPath}?${query.toString()}`;
  
  const mapboxRes = await fetch(fullUrl);

  // extract values from Mapbox response
  const contentType = mapboxRes.headers.get('content-type') || 'application/octet-stream';
  const body = await mapboxRes.arrayBuffer();

  // forward response body + staus + headers
  return new Response(body, {
    status: mapboxRes.status,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    }
  });
}
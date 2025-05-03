import { NextRequest } from "next/server";
import { limits } from "@/app/redis/limits";

const ALLOWED_PATHS = [
  /^styles\/v1\//, // Mapbox styles
  /^fonts\/v1\//, // Mapbox fonts
  /^v4\//, // Mapbox vector tiles
];

const MAPBOX_BASE = 'https://api.mapbox.com';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }){
  // await params to fix an error, even though it shouldn't have any effect
  const { path } = await params;
  const joinedPath = path.join('/');
  
  // 403 if token invalid or path not allowed
  if(!MAPBOX_TOKEN || !ALLOWED_PATHS.some(rx => rx.test(joinedPath))) {
    return new Response('Forbidden', { status: 403 });
  }

  // use Redis to test and set limit
  let limitResponse = null;
  if(joinedPath[0] === 's'){
    // /styles/v1/... (Styles)
    limitResponse = await limits('canLoadStyle', 'styleLoads');
  } else if(joinedPath[0] === 'v'){
    // /v4/... (Vector Tiles)
    limitResponse = await limits('canRequestTile', 'tileRequests');
  }
  if(limitResponse !== null) return limitResponse;

  const url = new URL(req.url);
  const query = url.searchParams;
  query.set('access_token', MAPBOX_TOKEN);

  // construct and fetch URL
  const fullUrl = `${MAPBOX_BASE}/${joinedPath}?${query.toString()}`;
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


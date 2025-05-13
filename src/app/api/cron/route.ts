import { NextRequest } from "next/server";
import { redis } from "@/app/redis/connect";

// Geoapify's daily free limit
const GEOAPIFY_LIMIT_DAY = process.env.GEOAPIFY_LIMIT_DAY ?? 3000;
// auth secret
const GEOAPIFY_CRON_SECRET = process.env.GEOAPIFY_CRON_SECRET ?? null;

/* Reset the daily API call limit */
export async function GET(req: NextRequest){
  // check secret
  const secret = req.headers.get('x-vercel-cron-secret');
  if(GEOAPIFY_CRON_SECRET === null || secret !== GEOAPIFY_CRON_SECRET){
    return new Response('Unauthorized', { status: 401 });
  }

  // update limit
  const redisRes = await redis.set('geocodingRequests', GEOAPIFY_LIMIT_DAY);
  if(redisRes === null){
    return new Response('Update failed', { status: 500 });
  }
  return new Response('Update successful');
}
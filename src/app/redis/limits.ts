import { Redis } from '@upstash/redis';

// connect to redis from env vars
const redis = Redis.fromEnv();

export async function limits(enabledKey: string, limitKey: string, amount: number = 1){
  // ensure enabled and limit is not exceeded
  const [enabled, limit] = await redis.mget<[boolean, number]>(enabledKey, limitKey);
  if(!enabled) return new Response('Route Disabled', { status: 403 });
  if(!limit || limit < 0) return new Response('Limit Exceeded', { status: 403 });
  // decrement limit
  redis.decrby(limitKey, amount);
  
  // indicate success (no Response)
  return null;
}
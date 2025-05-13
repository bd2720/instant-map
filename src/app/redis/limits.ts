import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './connect';

// maximum requests per second
const GEOAPIFY_LIMIT_SEC = Number(process.env.GEOAPIFY_LIMIT_SEC);

// Fixed window rate limit, 5 req per second
export const secLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(GEOAPIFY_LIMIT_SEC ?? 5, '1s'),
  prefix: 'geoapify-limit-sec',
});

/** Checks if the specified service is enabled and limit is not exceeded.
 * Then decrements the limit by the specified amount.
 */
export async function limits(enabledKey: string, limitKey: string, amount: number = 1){
  // ensure enabled and limit is not exceeded
  const [enabled, limit] = await redis.mget<[boolean, number]>(enabledKey, limitKey);
  if(!enabled) return new Response('Service disabled', { status: 403 });
  if(!limit || limit < 0) return new Response('Daily limit exceeded', { status: 429, headers: { 'Retry-After': "86400000" } });
  // decrement limit
  redis.decrby(limitKey, amount);
  
  // indicate success (no Response)
  return null;
}
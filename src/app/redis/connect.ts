/* Connect to Redis */
import { Redis } from '@upstash/redis';

// connect to redis from env vars
export const redis = Redis.fromEnv();
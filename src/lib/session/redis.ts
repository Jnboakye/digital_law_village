import Redis from 'ioredis';

let redisClient: Redis | null = null;

/**
 * Get or create Redis client
 */
function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      // Removed lazyConnect and enableOfflineQueue - connect immediately for better error handling
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err.message);
      console.error('💡 Make sure Redis is running. Install with: brew install redis (macOS) or docker run -d -p 6379:6379 redis');
    });

    redisClient.on('connect', () => {
      console.log('✓ Connected to Redis');
    });

    // Try to connect immediately
    redisClient.connect().catch((err) => {
      console.error('❌ Failed to connect to Redis:', err.message);
      console.error('💡 Start Redis with: brew services start redis (macOS) or docker run -d -p 6379:6379 redis');
    });
  }

  return redisClient;
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    const client = getRedisClient();
    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return false;
  }
}

export { getRedisClient };


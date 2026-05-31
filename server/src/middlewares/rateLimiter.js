const rateLimit = require('express-rate-limit');
const { Redis } = require('@upstash/redis');
const { RedisStore } = require('rate-limit-redis');

// Initialize Redis client and store if environment variables are set
let redisStore = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Adapt @upstash/redis's connectionless execute method for rate-limit-redis
    redisStore = new RedisStore({
      sendCommand: async (...args) => {
        return await redis.execute(args);
      },
      prefix: 'erpsaa-rl-login:', // Custom prefix for ERP login rate limits
    });

    console.log('🛡️  Upstash Redis Store initialized successfully for persistent Login Rate Limiting.');
  } catch (error) {
    console.error('⚠️  Failed to initialize Upstash Redis Store. Falling back to In-Memory store:', error.message);
  }
} else {
  console.warn('⚠️  Upstash Redis environment variables are missing. Login Rate Limiter is falling back to In-Memory store.');
}

/**
 * General API Rate Limiter
 * Restricts client IP to 300 requests per 15 minutes.
 * Prevents DDoS and API scraping.
 * Kept in-memory as general rate limiting does not require cross-serverless persistence.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict Login Rate Limiter
 * Restricts client IP to 3 failed attempts per 10 minutes.
 * Uses Upstash Redis (if configured) so locks persist across Serverless restarts on Vercel.
 * Uses skipSuccessfulRequests: true to ensure successful logins (status code < 400) do not count.
 */
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again after 10 minutes.'
  },
  skipSuccessfulRequests: true, // Crucial: Only rate limit failed logins (status code >= 400)
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore || undefined, // Fallback to in-memory store if Redis is not configured
});

module.exports = {
  apiLimiter,
  loginLimiter
};

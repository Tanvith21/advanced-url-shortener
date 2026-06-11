const redis = require("../utils/redisClient");

const rateLimiter = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `rate:${ip}`;
  const limit = 10;
  const window = 60; // seconds

  try {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, window);
    }

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - current));

    if (current > limit) {
      return res.status(429).json({
        error: "Too many requests, please try again after a minute",
        retryAfter: await redis.ttl(key),
      });
    }

    next();
  } catch (err) {
    next(); // fail open
  }
};

module.exports = rateLimiter;

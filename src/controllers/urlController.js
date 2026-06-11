const { nanoid } = require("nanoid");
const validUrl = require("valid-url");
const Url = require("../models/Url");
const redis = require("../utils/redisClient");
const analyticsQueue = require("../utils/analyticsQueue");

const CACHE_TTL = 3600;

exports.shortenUrl = async (req, res) => {
  const { originalUrl, alias, expiresInDays } = req.body;

  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const shortCode = alias || nanoid(6);

    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(409).json({ error: "Alias already taken" });
    }

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const url = await Url.create({ originalUrl, shortCode, alias: alias || null, expiresAt });

    await redis.setex(`url:${shortCode}`, CACHE_TTL, originalUrl);

    res.status(201).json({
      originalUrl,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      shortCode,
      expiresAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const cached = await redis.get(`url:${code}`);
    if (cached) {
      // Queue click tracking asynchronously
      await analyticsQueue.add({ shortCode: code });
      return res.redirect(cached);
    }

    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ error: "URL not found" });

    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({ error: "URL has expired" });
    }

    await analyticsQueue.add({ shortCode: code });
    await redis.setex(`url:${code}`, CACHE_TTL, url.originalUrl);

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAnalytics = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ error: "URL not found" });

    res.json({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      cached: !!(await redis.get(`url:${code}`)),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

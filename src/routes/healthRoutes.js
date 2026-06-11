const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const redis = require("../utils/redisClient");

router.get("/health", async (req, res) => {
  try {
    const redisStatus = await redis.ping();
    const mongoStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.json({
      status: "ok",
      uptime: `${Math.floor(process.uptime())}s`,
      services: {
        mongo: mongoStatus,
        redis: redisStatus === "PONG" ? "connected" : "disconnected",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;

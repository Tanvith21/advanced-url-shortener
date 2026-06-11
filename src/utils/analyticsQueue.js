const Bull = require("bull");
const axios = require("axios");
const Url = require("../models/Url");

const analyticsQueue = new Bull("analytics", {
  redis: { host: "localhost", port: 6379 },
});

analyticsQueue.process(async (job) => {
  const { shortCode, ip } = job.data;

  let geo = {};
  try {
    if (ip && ip !== "127.0.0.1" && ip !== "::1") {
      const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
      if (data.status === "success") {
        geo = { country: data.country, city: data.city };
      }
    }
  } catch (err) {
    // geo lookup failed, continue without it
  }

  await Url.findOneAndUpdate(
    { shortCode },
    {
      $inc: { clicks: 1 },
      $push: {
        clickHistory: {
          timestamp: new Date(),
          ...geo,
        },
      },
    }
  );
});

analyticsQueue.on("completed", (job) => {
  console.log(`Analytics job ${job.id} completed for ${job.data.shortCode}`);
});

analyticsQueue.on("failed", (job, err) => {
  console.error(`Analytics job ${job.id} failed:`, err.message);
});

module.exports = analyticsQueue;

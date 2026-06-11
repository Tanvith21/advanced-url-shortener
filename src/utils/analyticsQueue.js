const Bull = require("bull");
const Url = require("../models/Url");

const analyticsQueue = new Bull("analytics", {
  redis: { host: "localhost", port: 6379 },
});

// Process jobs
analyticsQueue.process(async (job) => {
  const { shortCode } = job.data;
  await Url.findOneAndUpdate(
    { shortCode },
    { $inc: { clicks: 1 } }
  );
});

analyticsQueue.on("completed", (job) => {
  console.log(`Analytics job ${job.id} completed for ${job.data.shortCode}`);
});

analyticsQueue.on("failed", (job, err) => {
  console.error(`Analytics job ${job.id} failed:`, err.message);
});

module.exports = analyticsQueue;

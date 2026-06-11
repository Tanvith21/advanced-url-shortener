const express = require("express");
const router = express.Router();
const { shortenUrl, getAnalytics } = require("../controllers/urlController");
const limiter = require("../middleware/rateLimiter");

router.post("/shorten", limiter, shortenUrl);
router.get("/analytics/:code", getAnalytics);

module.exports = router;

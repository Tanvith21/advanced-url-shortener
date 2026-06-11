const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  alias: { type: String, default: null },
  clicks: { type: Number, default: 0 },
  clickHistory: [
    {
      timestamp: { type: Date, default: Date.now },
      country: { type: String, default: null },
      city: { type: String, default: null },
    },
  ],
  expiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Url", urlSchema);

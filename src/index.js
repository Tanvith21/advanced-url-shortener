const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { redirectUrl } = require("./controllers/urlController");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", urlRoutes);
app.use("/api", healthRoutes);
app.get("/:code", redirectUrl);

app.get("/", (req, res) => {
  res.json({ message: "URL Shortener API is running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));

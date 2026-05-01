const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const formRoutes = require("./routes/forms");
const responseRoutes = require("./routes/responses");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/formbuilder";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use("/forms", formRoutes);
app.use("/responses", responseRoutes);

app.get("/", (req, res) => res.json({ message: "FormBuilder API running" }));

// Returns the caller's real LAN hostname so the frontend can build
// shareable links that work on any device on the same network.
app.get("/config/host", (req, res) => {
  const hostname = (req.headers["x-forwarded-host"] || req.headers.host || "").split(":")[0];
  const frontendPort = process.env.FRONTEND_PORT || 3000;
  res.json({ origin: `http://${hostname}:${frontendPort}` });
});

const PORT = process.env.PORT || 5000;
// 0.0.0.0 = listen on all interfaces, making it reachable over LAN
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT} (LAN accessible)`)
);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const routeData = require("./routes/routeData");
const db = require("./config/connectdb");

dotenv.config();

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

db();

const corsOptions = {
  origin: [
    "https://attendo-client.vercel.app",
    "https://attendo-servers.onrender.com",
    process.env.NODE_ENV === "development" && "http://localhost:3000",
  ].filter(Boolean),
  methods: ["GET", "POST"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Add a root route for Render health checks
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/users", routeData);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening at PORT ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

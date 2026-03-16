require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8080;

// ✅ Allow all origins
app.use(cors({
  origin: "*"
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tour Guide API" });
});

// Routes
app.use("/api/plan", require("./routes/planerRoutes"));

app.listen(PORT, () => console.log(`✅ Server running at PORT: ${PORT}`));
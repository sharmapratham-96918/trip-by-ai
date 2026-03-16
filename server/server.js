require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tour Guide API" });
});

// ✅ Import routes correctly (CommonJS)
app.use("/api/plan", require("./routes/planerRoutes"));

app.listen(PORT, () => console.log(`✅ Server running at PORT: ${PORT}`));

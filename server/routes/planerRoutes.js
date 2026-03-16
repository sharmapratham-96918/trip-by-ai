const express = require("express");
const { genratePlan } = require("../controllers/planerController");

const router = express.Router();

router.post("/", genratePlan);

// ✅ Correct export
module.exports = router;

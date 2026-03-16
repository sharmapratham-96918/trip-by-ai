const express = require("express");
const { genratePlan } = require("../../client/trip-planner/src/features/trip/tripSlice");

const router = express.Router();

router.post("/", genratePlan);

// ✅ Correct export
module.exports = router;

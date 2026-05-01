const express = require("express");
const router = express.Router();
const Response = require("../models/Response");

// POST /responses - Submit a form response
router.post("/", async (req, res) => {
  try {
    const response = new Response(req.body);
    const saved = await response.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /responses/:formId - Get all responses for a form
router.get("/:formId", async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

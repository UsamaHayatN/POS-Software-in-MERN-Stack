const Invoice = require("../models/Invoice.js");
const express = require("express");
const router = express.Router();

//! Create invoice
router.post("/add-invoice", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(200).json({ message: "Invoice added successfully", invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Get all invoices
router.get("/get-all", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

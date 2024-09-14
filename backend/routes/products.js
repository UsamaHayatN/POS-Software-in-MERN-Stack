const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();

//! Get all products
router.get("/get-all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Create product
router.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Update product
router.put("/update-product", async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate({ _id: req.body.productId }, req.body, { new: true });
    res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Delete product
router.delete("/delete-product", async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.body.productId });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

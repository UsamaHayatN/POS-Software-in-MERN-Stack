const Category = require("../models/Category.js");
const express = require("express");
const router = express.Router();

//! Get all categories
router.get("/get-all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Create category
router.post("/add-category", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Update category
router.put("/update-category", async (req, res) => {
  try {
    const updatedCategory = await Category.findOneAndUpdate({ _id: req.body.categoryId }, req.body, { new: true });
    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Delete category
router.delete("/delete-category", async (req, res) => {
  try {
    await Category.findOneAndDelete({ _id: req.body.categoryId });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

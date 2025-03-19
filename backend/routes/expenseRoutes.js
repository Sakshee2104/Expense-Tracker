import express from "express";
import Expense from "../models/Expense.js";

const router = express.Router();

// Add a New Expense
router.post("/add", async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const newExpense = new Expense({ title, amount, category });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Expense by ID
router.get("/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an Expense
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid expense ID format" });
    }
    const { title, amount, category } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, category },
      { new: true, runValidators: true }
    );
    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an Expense
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid expense ID format" });
    }
    const deletedExpense = await Expense.findByIdAndDelete(id);
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
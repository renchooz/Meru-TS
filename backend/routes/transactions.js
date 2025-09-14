import express from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /transactions
// Query: page, limit, search, sortBy=date|amount, order=asc|desc, fromDate, toDate
router.get("/", auth, async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "_id",
      order = "desc",
      fromDate,
      toDate,
    } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const filter = { user: req.user._id };

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { description: regex },
        { payee: regex },
        { category: regex },
      ];
    }

    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    const sortField = sortBy === "amount" ? "amount" : "_id";
    const sortOrder = order === "asc" ? 1 : -1;

    const totalRecords = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit) || 1;

    const data = await Transaction.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ data, page, limit, totalPages, totalRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /transactions
router.post("/", auth, async (req, res) => {
  try {
    const { date, description, amount, payee, category } = req.body;
    if (!date || amount == null)
      return res.status(400).json({ message: "date and amount are required" });

    const txn = await Transaction.create({
      user: req.user._id,
      date: new Date(date),
      description: description || "",
      amount: Number(amount),
      payee: payee || "",
      category: category || "",
    });

    res.status(201).json(txn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /transactions/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const txn = await Transaction.findOne({ _id: id, user: req.user._id });
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    const { date, description, amount, payee, category } = req.body;
    if (date) txn.date = new Date(date);
    if (description !== undefined) txn.description = description;
    if (amount !== undefined) txn.amount = Number(amount);
    if (payee !== undefined) txn.payee = payee;
    if (category !== undefined) txn.category = category;

    await txn.save();
    res.json(txn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /transactions/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const txn = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

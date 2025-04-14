// backend/routes/batches.js
import express from "express";
import Batch from "../models/batch.model.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      batchName,
      teacher,
      startDate,
      endDate,
      scheduleDays,
      sessionTime,
      sessionTopic,
    } = req.body;

    const newBatch = new Batch({
      batchName,
      teacher,
      startDate,
      endDate,
      scheduleDays,
      sessionTime,
      sessionTopic,
    });

    await newBatch.save();
    res.status(201).json({ message: "Batch created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create batch" });
  }
});


router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).json(batches);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

export default router;

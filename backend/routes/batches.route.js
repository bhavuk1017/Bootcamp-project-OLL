// backend/routes/batchRoutes.js
import express from 'express';
import Batch from '../models/batch.model.js';

const router = express.Router();

// Create a new batch
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

    if (!batchName || !teacher) {
      return res.status(400).json({ error: "Batch name and teacher are required" });
    }

    const formattedSessionTopic = Array.isArray(sessionTopic)
      ? sessionTopic.join(', ')
      : sessionTopic;

    const newBatch = new Batch({
      batchName,
      teacher,
      startDate,
      endDate,
      scheduleDays,
      sessionTime,
      sessionTopic: formattedSessionTopic,
    });

    const savedBatch = await newBatch.save();
    res.status(201).json({
      message: "Batch created successfully",
      batch: savedBatch
    });
  } catch (err) {
    console.error("Failed to create batch:", err);
    res.status(500).json({ error: "Failed to create batch" });
  }
});

// Get all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).json(batches);
  } catch (error) {
    console.error("Failed to fetch batches:", error);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});

// Get a single batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error("Failed to fetch batch:", error);
    res.status(500).json({ error: "Failed to fetch batch" });
  }
});

// Update a batch
router.put('/:id', async (req, res) => {
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

    const formattedSessionTopic = Array.isArray(sessionTopic)
      ? sessionTopic.join(', ')
      : sessionTopic;

    const updateData = {
      batchName,
      teacher,
      startDate,
      endDate,
      scheduleDays,
      sessionTime,
      sessionTopic: formattedSessionTopic,
    };

    const updatedBatch = await Batch.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    res.status(200).json({
      message: "Batch updated successfully",
      batch: updatedBatch
    });
  } catch (error) {
    console.error("Failed to update batch:", error);
    res.status(500).json({ error: "Failed to update batch" });
  }
});

// Delete a batch
router.delete('/:id', async (req, res) => {
  try {
    const deletedBatch = await Batch.findByIdAndDelete(req.params.id);

    if (!deletedBatch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    res.status(200).json({
      message: "Batch deleted successfully",
      batch: deletedBatch
    });
  } catch (error) {
    console.error("Failed to delete batch:", error);
    res.status(500).json({ error: "Failed to delete batch" });
  }
});

// Get batches by teacher ID
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const batches = await Batch.find({ teacher: req.params.teacherId });
    res.status(200).json(batches);
  } catch (error) {
    console.error("Failed to fetch batches by teacher:", error);
    res.status(500).json({ error: "Failed to fetch batches by teacher" });
  }
});

export default router;

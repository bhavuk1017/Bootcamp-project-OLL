import express from "express";
import Teacher from "../models/teacher.model.js";

const router = express.Router();

// POST /api/teachers
router.post("/", async (req, res) => {
  try {
    const { name, email, phone} = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name and subject are required." });
    }

    const newTeacher = new Teacher({ name, email, phone });
    await newTeacher.save();

    res.status(201).json(newTeacher);
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

export default router;

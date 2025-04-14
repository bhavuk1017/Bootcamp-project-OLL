import express from "express";
import { createStudent } from "../controllers/student.controller.js";
import Student from "../models/student.model.js"; // Assuming you have a Student model

const router = express.Router();

router.post("/", createStudent); // notice just "/", because prefix is used in app.js

router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

export default router;

import express from "express";
import { createStudent } from "../controllers/student.controller.js";
import Student from "../models/student.model.js"; // Assuming you have a Student model
import Batch from "../models/batch.model.js"; // Assuming you have a Batch model
import Teacher from "../models/teacher.model.js"; // Assuming you have a Teacher model
import { updateStudent } from "../controllers/studentUpdate.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

router.post("/", createStudent); // notice just "/", because prefix is used in app.js

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(students);
  } catch (error) {
    console.error("Failed to fetch students:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Get single student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student profile
router.patch("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, email, phone, location, school, grade, batches } = req.body;

    // Check if student exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Handle batch updates if provided
    if (batches && batches.length > 0) {
      const oldBatchId = existingStudent.batches && existingStudent.batches.length > 0 
        ? existingStudent.batches[0].toString() 
        : null;
      const newBatchId = batches[0];

      // Always update batch references, even if it's the same batch
      if (oldBatchId) {
        // Remove student from old batch
        await Batch.findByIdAndUpdate(oldBatchId, {
          $pull: { students: studentId }
        });
      }

      // Add student to new batch
      await Batch.findByIdAndUpdate(newBatchId, {
        $addToSet: { students: studentId }
      });

      // Update teacher records if batch changed
      if (oldBatchId && oldBatchId !== newBatchId) {
        const oldBatch = await Batch.findById(oldBatchId);
        const newBatch = await Batch.findById(newBatchId);

        const oldTeacherId = oldBatch?.teacher?.toString();
        const newTeacherId = newBatch?.teacher?.toString();

        if (oldTeacherId && oldTeacherId !== newTeacherId) {
          // Remove student from old teacher
          await Teacher.findByIdAndUpdate(oldTeacherId, {
            $pull: { students: studentId }
          });

          // Add student to new teacher
          if (newTeacherId) {
            await Teacher.findByIdAndUpdate(newTeacherId, {
              $addToSet: { students: studentId }
            });
          }
        }
      }
    }

    // Update student profile
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        name,
        email,
        phone,
        location,
        school,
        grade,
        ...(batches && { batches })
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // 1. Delete the student
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 2. Remove student reference from all batches
    await Batch.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );

    // 3. Remove student reference from all teachers
    await Teacher.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );

    res.json({
      message: "Student deleted successfully and references cleaned up",
    });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

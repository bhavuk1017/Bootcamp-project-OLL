import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'Student',
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  school: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    trim: true
  },
  joined: {
    type: String, // storing as string like "June 2023" (optional: use Date if standardized)
    trim: true
  },
  batch: {
    type: [String], // changed to array to match new structure
    default: []
  },
  status: {
    type: String,
    trim: true,
    default: 'active'
  },
  earning: {
    type: Number,
    default: 0
  },
  attendance: {
    type: Number,
    default: 0
  },
  taskCompletion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
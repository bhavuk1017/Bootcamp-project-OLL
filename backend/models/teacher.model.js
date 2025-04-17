import mongoose from 'mongoose';
const { Schema } = mongoose;

const earningEntrySchema = new Schema({
  month: String,
  amount: Number
}, { _id: false });

const teacherSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  jobTitle: {
    type: String,
    trim: true
  },
  yearOfExp: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true,
    default: "None"
  },
  status: {
    type: String,
    trim: true,
    default: "Unknown"
  },
  bio: {
    type: String,
    trim: true
  },
  earning: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  totalBatches: {
    type: Number,
    default: 0
  },
  currentBatches: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date
  },
  batches: [{
    type: Schema.Types.ObjectId,
    ref: 'Batch'
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  earnings: [earningEntrySchema]
}, {
  timestamps: true
});

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
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
  yearsExperience: {
    type: Number
  },
  department: {
    type: String,
    trim: true
  },
  bio: {
    type: String
  },
  responsibilities: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';
import Admin from '../models/admin.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to find user by email and type
const findUserByEmail = async (email, userType) => {
  switch (userType) {
    case 'student':
      return await Student.findOne({ email });
    case 'teacher':
      return await Teacher.findOne({ email });
    case 'admin':
      return await Admin.findOne({ email });
    default:
      return null;
  }
};

// Helper function to create user based on type
const createUser = async (userData, userType) => {
  switch (userType) {
    case 'student':
      return new Student(userData);
    case 'teacher':
      return new Teacher(userData);
    case 'admin':
      return new Admin(userData);
    default:
      throw new Error('Invalid user type');
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, userType, ...additionalData } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email, userType);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      ...additionalData
    }, userType);

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Find user
    const user = await findUserByEmail(email, userType);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 
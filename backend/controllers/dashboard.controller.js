import Batch from '../models/batch.model.js';
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';

// Student Dashboard Controller
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id; // From auth middleware
    const student = await Student.findById(studentId)
      .populate('batches')
      .populate('teachers');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Calculate student's progress and stats
    const totalBatches = student.batches.length;
    const completedTasks = student.taskCompletion || 0;
    const progress = Math.round((completedTasks / (totalBatches * 10)) * 100); // Assuming 10 tasks per batch

    // Get student's rank
    const allStudents = await Student.find({}, 'earning');
    const sortedEarnings = allStudents.map(s => s.earning).sort((a, b) => b - a);
    const rank = sortedEarnings.indexOf(student.earning) + 1;

    const dashboardData = {
      name: student.name,
      business: student.business || "Not set",
      earnings: student.earning || 0,
      sales: student.sales || 0,
      progress: progress,
      badges: Math.floor(progress / 20), // One badge per 20% progress
      rank: rank,
      tasks: [
        { id: 1, title: 'Complete business plan', completed: progress >= 20 },
        { id: 2, title: 'Create product photos', completed: progress >= 40 },
        { id: 3, title: 'Set up pricing strategy', completed: progress >= 60 },
        { id: 4, title: 'Make first sale', completed: student.sales > 0 }
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

// Teacher/Mentor Dashboard Controller
export const getMentorDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacher = await Teacher.findById(teacherId)
      .populate('batches')
      .populate('students');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Calculate pending approvals (tasks needing review)
    const pendingApprovals = await Batch.aggregate([
      { $match: { teacher: teacherId } },
      { $unwind: '$tasks' },
      { $match: { 'tasks.status': 'pending_review' } },
      { $count: 'total' }
    ]);

    // Get teacher's rank based on earnings
    const allTeachers = await Teacher.find({}, 'totalEarnings');
    const sortedEarnings = allTeachers.map(t => t.totalEarnings).sort((a, b) => b - a);
    const rank = sortedEarnings.indexOf(teacher.totalEarnings) + 1;

    const dashboardData = {
      name: teacher.name,
      students: teacher.students.length,
      pendingApprovals: pendingApprovals[0]?.total || 0,
      totalEarnings: teacher.totalEarnings || 0,
      rank: rank
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching mentor dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

// Admin Dashboard Controller
export const getAdminDashboard = async (req, res) => {
  try {
    // Get counts and stats
    const totalStudents = await Student.countDocuments();
    const totalMentors = await Teacher.countDocuments();
    
    // Calculate total revenue
    const batches = await Batch.find({}, 'revenue');
    const totalRevenue = batches.reduce((sum, batch) => sum + (batch.revenue || 0), 0);
    
    // Get pending approvals (new registrations, etc.)
    const pendingApprovals = await Student.countDocuments({ status: 'pending' });

    const dashboardData = {
      totalStudents,
      totalMentors,
      totalRevenue,
      pendingApprovals
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
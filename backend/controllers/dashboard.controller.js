// server/controllers/dashboardController.js
import Student from '../models/student.model.js';
import Teacher from '../models/teacher.model.js';
import Batch from '../models/batch.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get counts from each collection
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalBatches = await Batch.countDocuments();
    
    // Calculate total revenue (sum of all batch revenues)
    const batches = await Batch.find({}, 'revenue');
    const totalRevenue = batches.reduce((sum, batch) => sum + (batch.revenue || 0), 0);
    
    // Get monthly revenue data for the chart
    const currentYear = new Date().getFullYear();
    const monthlyRevenueData = await Batch.aggregate([
      {
        $match: {
          startDate: { 
            $gte: new Date(`${currentYear}-01-01`), 
            $lte: new Date(`${currentYear}-12-31`) 
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDate" },
          value: { $sum: "$revenue" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Fill in missing months with zero values
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((month, index) => {
      const foundMonth = monthlyRevenueData.find(item => item._id === index + 1);
      return {
        month,
        value: foundMonth ? foundMonth.value : 0
      };
    });
    
    // Get monthly enrollment data for the chart
    const monthlyEnrollmentData = await Student.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(`${currentYear}-01-01`), 
            $lte: new Date(`${currentYear}-12-31`) 
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          value: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Fill in missing months with zero values
    const enrollmentData = months.map((month, index) => {
      const foundMonth = monthlyEnrollmentData.find(item => item._id === index + 1);
      return {
        month,
        value: foundMonth ? foundMonth.value : 0
      };
    });
    
    // Get batch details for the revenue distribution table
    const batchesMockData = await Batch.find()
      .select('batchName revenue')
      .lean();
      
    // Calculate students per batch and revenue splits
    for (let batch of batchesMockData) {
      batch.students = batch.totalStudents || 0;
      batch.teacherEarning = Math.round(batch.revenue * 0.2); // 20% for teacher
      batch.ollShare = Math.round(batch.revenue * 0.3); // 30% for OLL
      // Student earnings are calculated in the frontend
    }

    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalBatches,
      totalRevenue,
      revenueData,
      enrollmentData,
      batchesMockData
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
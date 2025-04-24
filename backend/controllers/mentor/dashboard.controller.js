// File: /api/teacher/dashboard.js or similar path based on your structure
import Teacher from '../../models/teacher.model.js';
import Batch from '../../models/batch.model.js';

export default async function getTeacherDashboardData(req, res) {
  // For development purposes only - this will be replaced with proper auth later
  const DUMMY_TEACHER_ID = '680289d9994a95276bcd8b79'; // Replace with a valid ObjectId in your DB
  // Once auth is implemented, get teacherId from the JWT token
  // const teacherId = req.user.id;

  try {
    // Get teacher data
    const teacher = await Teacher.findById(DUMMY_TEACHER_ID);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Get recent batches
    const recentBatches = await Batch.find({ teacher: DUMMY_TEACHER_ID })
      .sort({ startDate: -1 })
      .limit(5);

    // Format batch data
    const formattedBatches = recentBatches.map(batch => ({
      id: batch._id,
      name: batch.batchName,
      status: getBatchStatus(batch.startDate, batch.endDate),
      students: batch.students.length,
      earnings: batch.revenue ? (batch.revenue * 0.2).toFixed(2) : '0.00' // 20% commission as mentioned in UI
    }));

    // Calculate next session (assuming it's the closest upcoming session)
    let nextSession = null;
    const currentDate = new Date();
    
    // Find the batch with the closest upcoming session
    for (const batch of recentBatches) {
      if (batch.startDate && batch.scheduleDays && batch.sessionTime) {
        const nextSessionDate = calculateNextSessionDate(batch.startDate, batch.scheduleDays, batch.sessionTime);
        
        if (nextSessionDate > currentDate) {
          if (!nextSession || nextSessionDate < new Date(nextSession.date)) {
            nextSession = {
              batchId: batch._id,
              batch: batch.batchName,
              date: nextSessionDate,
              topic: batch.sessionTopic || 'Regular session'
            };
          }
        }
      }
    }

    // Prepare dashboard data
    const dashboardData = {
      totalEarnings: teacher.totalEarnings.toFixed(2),
      totalStudents: teacher.totalStudents,
      totalBatches: teacher.totalBatches,
      recentBatches: formattedBatches,
      batches: teacher.batches,
      students: teacher.students,
      nextSession
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
  }
}

// Helper function to determine batch status
function getBatchStatus(startDate, endDate) {
  const now = new Date();
  
  if (!startDate || !endDate) {
    return 'unknown';
  }
  
  if (now < new Date(startDate)) {
    return 'upcoming';
  } else if (now > new Date(endDate)) {
    return 'completed';
  } else {
    return 'ongoing';
  }
}

// Helper function to calculate the next session date based on schedule
function calculateNextSessionDate(startDate, scheduleDays, sessionTime) {
  const today = new Date();
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Parse session time (assuming format like "14:00")
  const [hours, minutes] = sessionTime.split(':').map(Number);
  
  // Find the next scheduled day
  let nextDate = new Date(today);
  let daysToAdd = 0;
  let foundNextDay = false;
  
  // Check next 7 days to find the next session
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const dayName = daysOfWeek[checkDate.getDay()].toLowerCase();
    
    if (scheduleDays.map(day => day.toLowerCase()).includes(dayName)) {
      daysToAdd = i;
      foundNextDay = true;
      break;
    }
  }
  
  if (!foundNextDay) {
    // If no day found in next 7 days, use the first scheduled day next week
    const firstScheduledDayIndex = daysOfWeek.findIndex(day => 
      scheduleDays.map(d => d.toLowerCase()).includes(day)
    );
    
    if (firstScheduledDayIndex !== -1) {
      const todayIndex = today.getDay();
      daysToAdd = (7 - todayIndex + firstScheduledDayIndex) % 7;
      if (daysToAdd === 0) daysToAdd = 7; // Next week if today is also a scheduled day
    }
  }
  
  nextDate.setDate(today.getDate() + daysToAdd);
  nextDate.setHours(hours, minutes, 0, 0);
  
  return nextDate;
}
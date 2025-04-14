// /api/dashboard-stats.ts
import { connectToDB } from "@/lib/db"; // your DB connection file
import Student from "@/models/student";
import Teacher from "@/models/teacher";
import Batch from "@/models/batch";

export const GET = async (req) => {
  try {
    await connectToDB();

    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalBatches = await Batch.countDocuments();
    
    const allBatches = await Batch.find({}, "revenue"); // only fetch revenue field
    const totalRevenue = allBatches.reduce((sum, batch) => sum + (batch.revenue || 0), 0);

    return Response.json({
      totalStudents,
      totalTeachers,
      totalRevenue,
      totalBatches,
    });
  } catch (err) {
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
};

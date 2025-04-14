
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentTasks from "./pages/student/Tasks";
import StudentSessions from "./pages/student/Sessions";
import StudentSales from "./pages/student/Sales";
import StudentLeaderboard from "./pages/student/Leaderboard";
import StudentProfile from "./pages/student/Profile";
import StudentFeedback from "./pages/student/Feedback";
import StudentReviews from "./pages/student/Reviews";
import StudentHelp from "./pages/student/Help";

// Mentor Pages
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorBatches from "./pages/mentor/Batches";
import MentorBatchDetails from "./pages/mentor/BatchDetails";
import MentorEarnings from "./pages/mentor/Earnings";
import MentorLeaderboard from "./pages/mentor/Leaderboard";
import MentorStudentDetails from "./pages/mentor/StudentDetails";
import MentorSessions from "./pages/mentor/Sessions";
import MentorProfile from "./pages/mentor/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBatches from "./pages/admin/Batches";
import AdminBatchDetails from "./pages/admin/BatchDetails";
import AdminEarnings from "./pages/admin/Earnings";
import AdminStudents from "./pages/admin/Students";
import AdminStudentDetails from "./pages/admin/StudentDetails";
import AdminTeachers from "./pages/admin/Teachers";
import AdminTeacherDetails from "./pages/admin/TeacherDetails";
import AdminProfile from "./pages/admin/Profile";
import AdminFeedback from "./pages/admin/Feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rewards" element={<Rewards />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/tasks" element={<StudentTasks />} />
            <Route path="/student/sessions" element={<StudentSessions />} />
            <Route path="/student/sales" element={<StudentSales />} />
            <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/feedback" element={<StudentFeedback />} />
            <Route path="/student/reviews" element={<StudentReviews />} />
            <Route path="/student/help" element={<StudentHelp />} />
            
            {/* Mentor Routes */}
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/batches" element={<MentorBatches />} />
            <Route path="/mentor/batches/:batchId" element={<MentorBatchDetails />} />
            <Route path="/mentor/students/:studentId" element={<MentorStudentDetails />} />
            <Route path="/mentor/earnings" element={<MentorEarnings />} />
            <Route path="/mentor/leaderboard" element={<MentorLeaderboard />} />
            <Route path="/mentor/sessions" element={<MentorSessions />} />
            <Route path="/mentor/profile" element={<MentorProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/batches" element={<AdminBatches />} />
            <Route path="/admin/batches/:batchId" element={<AdminBatchDetails />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/students/:studentId" element={<AdminStudentDetails />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/teachers/:teacherId" element={<AdminTeacherDetails />} />
            <Route path="/admin/earnings" element={<AdminEarnings />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

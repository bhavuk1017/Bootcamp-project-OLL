
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  IndianRupee, 
  Users, 
  School, 
  TrendingUp, 
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

// Mock data
const revenueData = [
  { month: 'Jan', value: 1500 },
  { month: 'Feb', value: 2300 },
  { month: 'Mar', value: 3200 },
  { month: 'Apr', value: 2800 },
  { month: 'May', value: 3900 },
  { month: 'Jun', value: 4500 },
  { month: 'Jul', value: 4000 },
  { month: 'Aug', value: 5100 },
  { month: 'Sep', value: 5800 },
  { month: 'Oct', value: 6300 },
  { month: 'Nov', value: 6000 },
  { month: 'Dec', value: 7500 },
];

const enrollmentData = [
  { month: 'Jan', value: 12 },
  { month: 'Feb', value: 19 },
  { month: 'Mar', value: 25 },
  { month: 'Apr', value: 22 },
  { month: 'May', value: 30 },
  { month: 'Jun', value: 35 },
  { month: 'Jul', value: 31 },
  { month: 'Aug', value: 40 },
  { month: 'Sep', value: 45 },
  { month: 'Oct', value: 48 },
  { month: 'Nov', value: 43 },
  { month: 'Dec', value: 55 },
];


const AdminDashboard = () => {
  const totalStudents = 156;
  const totalTeachers = 12;
  const totalRevenue = 24680;
  const totalBatches = 15;

  const [batchesMockData, setBatchesMockData] = useState([
    { id: 1, batchName: 'Business Bootcamp - Batch 1', students: 25, revenue: 6250, teacherEarning: 1250, ollShare: 1875 }
  ]);

  useEffect(()=> {
    const fetchBatchesData = async () => {
      // Replace with your API call
      const response = await fetch('http://localhost:5000/api/batches'); // Adjust the endpoint as needed
      const data = await response.json();
      setBatchesMockData(data);
    };

    fetchBatchesData();
  },[])



  const calculateTotalRevenueSplit = () => {
    const total = batchesMockData.reduce((sum, batch) => sum + batch.revenue, 0);
    const teacherTotal = batchesMockData.reduce((sum, batch) => sum + (batch.revenue * 0.2), 0);
    const ollTotal = batchesMockData.reduce((sum, batch) => sum + (batch.ollShare * 0.3), 0);
    const studentTotal = total - teacherTotal - ollTotal;

    return {
      total,
      teacherTotal,
      ollTotal,
      studentTotal
    };
  };

  const revenueSplit = calculateTotalRevenueSplit();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-success" />
                <div className="text-2xl font-bold">₹{totalRevenue}</div>
              </div>
              <div className="flex items-center text-xs font-medium text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12.5%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-2xl font-bold">{totalStudents}</div>
              </div>
              <div className="flex items-center text-xs font-medium text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8.3%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-secondary" />
                <div className="text-2xl font-bold">{totalTeachers}</div>
              </div>
              <div className="flex items-center text-xs font-medium text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5.0%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                <div className="text-2xl font-bold">{totalBatches}</div>
              </div>
              <div className="flex items-center text-xs font-medium text-destructive">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                3.2%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue from all batches</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${value}`}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment</CardTitle>
            <CardDescription>Monthly student enrollment numbers</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip formatter={(value) => [`${value}`, 'Students']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Distribution */}
      <Card className="animate-fade-in" style={{animationDelay: '0.2s'}}>
        <CardHeader>
          <CardTitle>Revenue Distribution</CardTitle>
          <CardDescription>Breakdown of revenue among students, teachers, and OLL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Student Earnings (50%)</div>
              <div className="text-2xl font-bold">₹{revenueSplit.studentTotal}</div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground mb-1">Teacher Earnings (20%)</div>
              <div className="text-2xl font-bold">₹{revenueSplit.teacherTotal}</div>
            </div>
            <div className="p-4 border rounded-md">
              <div className="text-sm text-muted-foreground mb-1">OLL Share (30%)</div>
              <div className="text-2xl font-bold">₹{revenueSplit.ollTotal}</div>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium">Batch Name</th>
                  <th className="h-12 px-4 text-center align-middle font-medium">Students</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Total Revenue</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Student Earnings</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Teacher Share</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">OLL Share</th>
                </tr>
              </thead>
              <tbody>
                {batchesMockData.map((batch) => (
                  <tr key={batch.id} className="border-b transition-colors hover:bg-muted/20">
                    <td className="p-4 align-middle font-medium">{batch.batchName}</td>
                    <td className="p-4 align-middle text-center">{batch.students}</td>
                    <td className="p-4 align-middle text-right">₹{batch.revenue}</td>
                    <td className="p-4 align-middle text-right">₹{batch.revenue - batch.teacherEarning - batch.ollShare}</td>
                    <td className="p-4 align-middle text-right">₹{batch.teacherEarning}</td>
                    <td className="p-4 align-middle text-right">₹{batch.ollShare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

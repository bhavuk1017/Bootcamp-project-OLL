
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Calendar, ArrowRight, BarChart3, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for the mentor dashboard
const mentorData = {
  totalEarnings: 2450,
  totalStudents: 45,
  totalBatches: 3,
  nextSession: {
    date: "2023-06-15T14:00:00",
    batch: "Business Bootcamp - Batch 2",
    topic: "Marketing Strategies for Small Businesses"
  },
  recentBatches: [
    { id: 1, name: "Business Bootcamp - Batch 1", status: "ongoing", students: 15, earnings: 1200 },
    { id: 2, name: "Business Bootcamp - Batch 2", status: "ongoing", students: 18, earnings: 950 },
    { id: 3, name: "Entrepreneurship 101", status: "upcoming", students: 12, earnings: 0 }
  ]
};

const MentorDashboard = () => {
  const navigate = useNavigate();
  const nextSessionDate = new Date(mentorData.nextSession.date);
  const formattedDate = nextSessionDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = nextSessionDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mentor Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-success" />
              ${mentorData.totalEarnings}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              20% commission from student sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Students</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <Users className="mr-2 h-6 w-6 text-primary" />
              {mentorData.totalStudents}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across {mentorData.totalBatches} batches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Batches</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-accent" />
              {mentorData.totalBatches}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => navigate('/mentor/batches')}
            >
              View all batches
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Next session card */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Next Session
          </CardTitle>
          <CardDescription>
            {mentorData.nextSession.batch}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {formattedDate} at {formattedTime}
              </span>
            </div>
            <div className="text-sm font-medium">
              Topic: {mentorData.nextSession.topic}
            </div>
          </div>
          <div className="flex gap-2">
            <Button>
              Join Session
            </Button>
            <Button variant="outline" onClick={() => navigate(`/mentor/sessions/${1}`)}>
              Session Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent batches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Batches</CardTitle>
          <CardDescription>Overview of your assigned batches</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentorData.recentBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      batch.status === 'ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : batch.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {batch.status}
                    </span>
                  </TableCell>
                  <TableCell>{batch.students}</TableCell>
                  <TableCell className="text-right">${batch.earnings}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/mentor/batches/${batch.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => navigate('/mentor/batches')}>
              View All Batches
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorDashboard;

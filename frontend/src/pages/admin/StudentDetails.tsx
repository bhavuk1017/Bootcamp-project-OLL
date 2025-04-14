
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';

// This is a stub file that would contain the admin student details functionality
// Similar to the mentor student details, but with admin privileges

const AdminStudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/students')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Students
        </Button>
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            This page would display detailed information about Student ID: {studentId}, 
            including their profile, attendance, tasks, sales history, and other data.
            <div className="mt-4">
              <Button onClick={() => navigate('/admin/students')}>
                Return to Students List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                Student overview content would go here, including performance metrics and personal details.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                Student attendance records and history would go here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                Student task submissions and completion status would go here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                Student sales history and earnings would go here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStudentDetails;

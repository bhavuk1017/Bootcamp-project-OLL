import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Search, 
  Users 
} from 'lucide-react';
import axios from 'axios';

const BatchDetails = () => {
  const { batchId } = useParams();
  const [batchData, setBatchData] = useState(null);
  const [students, setStudents] = useState([]); // Ensure it's initialized as an array
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        // Fetch batch data
        const batchResponse = await axios.get(`/api/batches/${batchId}`);
        setBatchData(batchResponse.data);
        
        // Fetch students in this batch with populated data
        const studentsResponse = await axios.get(`/api/batches/${batchId}/students`);
        
        // Ensure studentsResponse.data is an array before setting state
        setStudents(Array.isArray(studentsResponse.data) ? studentsResponse.data : []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load batch data');
        setLoading(false);
      }
    };

    if (batchId) {
      fetchBatchData();
    }
  }, [batchId]);

  // Filter students based on search term - with safety check
  const filteredStudents = Array.isArray(students) 
    ? students.filter(student => 
        (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (student.school?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : [];

  // Calculate average progress metrics with safety checks
  const calculateAverageAttendance = () => {
    if (!Array.isArray(students) || students.length === 0) return 0;
    return Math.round(students.reduce((sum, student) => sum + (student.attendance || 0), 0) / students.length);
  };

  const calculateAverageTaskCompletion = () => {
    if (!Array.isArray(students) || students.length === 0) return 0;
    return Math.round(students.reduce((sum, student) => sum + (student.taskCompletion || 0), 0) / students.length);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading batch information...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!batchData) return <div className="text-center">No batch data found</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{batchData.batchName}</h1>
          <p className="text-muted-foreground">Batch ID: {batchData._id}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="capitalize">
            {new Date() > new Date(batchData.endDate) ? 'completed' : 
             new Date() < new Date(batchData.startDate) ? 'upcoming' : 'active'}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="text-sm">
                {new Date(batchData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                {new Date(batchData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">
                {Array.isArray(students) ? students.filter(s => s.status === 'active').length : 0}
              </div>
              <div className="text-sm text-muted-foreground">active</div>
              {Array.isArray(students) && students.some(s => s.status !== 'active') && (
                <>
                  <div className="text-sm text-muted-foreground mx-1">•</div>
                  <div className="text-sm text-muted-foreground">
                    {students.filter(s => s.status !== 'active').length} inactive
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Session Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-sm">
                {batchData.scheduleDays ? batchData.scheduleDays.join(', ') : 'No schedule set'} at {batchData.sessionTime || 'TBD'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Session Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{batchData.sessionTopic || 'No topic specified'}</p>
        </CardContent>
      </Card>
      
      <div className="relative">
        <div className="absolute right-0 top-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="students" className="mt-6">
          <TabsList className="w-full max-w-md grid grid-cols-2">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="mt-6 space-y-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{student.name?.split(' ').map(n => n[0]).join('') || 'S'}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.school || 'Not specified'}</TableCell>
                        <TableCell>{student.grade || 'Not specified'}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'active' ? 'outline' : 'secondary'} className="capitalize">
                            {student.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Average Attendance</CardTitle>
                  <CardDescription>Student attendance rate for this batch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold">{calculateAverageAttendance()}%</div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden mt-4">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${calculateAverageAttendance()}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Task Completion</CardTitle>
                  <CardDescription>Task completion rate for this batch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold">{calculateAverageTaskCompletion()}%</div>
                    <div className="w-full h-4 bg-muted rounded-full overflow-hidden mt-4">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${calculateAverageTaskCompletion()}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Individual metrics for each student</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Task Completion</TableHead>
                        <TableHead>Earnings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{student.name?.split(' ').map(n => n[0]).join('') || 'S'}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{student.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${student.attendance || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{student.attendance || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${student.taskCompletion || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{student.taskCompletion || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">${student.earning || 0}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No students found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BatchDetails;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Calendar, 
  Clock, 
  Download, 
  Edit, 
  Eye, 
  FileText, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Send, 
  Trash, 
  Upload, 
  Users 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for batch details
const batchData = {
  id: "B-2023-001",
  name: "Summer Entrepreneurship Bootcamp 2023",
  status: "active",
  startDate: "2023-06-15",
  endDate: "2023-08-30",
  description: "A 10-week intensive program designed to help high school students develop entrepreneurial skills and launch their own business ideas.",
  mentors: [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", role: "Lead Mentor", avatar: "/avatars/mentor1.png" },
    { id: 2, name: "Michael Chen", email: "michael.c@example.com", role: "Business Mentor", avatar: "/avatars/mentor2.png" },
  ],
  students: [
    { id: 1, name: "Alex Rodriguez", email: "alex.r@example.com", progress: 85, avatar: "/avatars/student1.png", status: "active" },
    { id: 2, name: "Emma Wilson", email: "emma.w@example.com", progress: 92, avatar: "/avatars/student2.png", status: "active" },
    { id: 3, name: "Jamal Thompson", email: "jamal.t@example.com", progress: 78, avatar: "/avatars/student3.png", status: "active" },
    { id: 4, name: "Sophia Garcia", email: "sophia.g@example.com", progress: 65, avatar: "/avatars/student4.png", status: "active" },
    { id: 5, name: "Ethan Miller", email: "ethan.m@example.com", progress: 90, avatar: "/avatars/student5.png", status: "active" },
    { id: 6, name: "Olivia Davis", email: "olivia.d@example.com", progress: 88, avatar: "/avatars/student6.png", status: "active" },
    { id: 7, name: "Noah Brown", email: "noah.b@example.com", progress: 72, avatar: "/avatars/student7.png", status: "inactive" },
  ],
  sessions: [
    { 
      id: 1, 
      title: "Introduction to Entrepreneurship", 
      date: "2023-06-15", 
      time: "10:00 AM - 12:00 PM", 
      status: "completed",
      attendance: 95,
      recording: "https://example.com/recording1",
      materials: [
        { id: 1, name: "Intro Slides.pdf", size: "2.4 MB" },
        { id: 2, name: "Business Canvas Template.docx", size: "1.1 MB" }
      ]
    },
    { 
      id: 2, 
      title: "Market Research Fundamentals", 
      date: "2023-06-22", 
      time: "10:00 AM - 12:00 PM", 
      status: "completed",
      attendance: 90,
      recording: "https://example.com/recording2",
      materials: [
        { id: 3, name: "Market Research Guide.pdf", size: "3.2 MB" },
        { id: 4, name: "Customer Interview Template.docx", size: "0.9 MB" }
      ]
    },
    { 
      id: 3, 
      title: "Business Model Development", 
      date: "2023-06-29", 
      time: "10:00 AM - 12:00 PM", 
      status: "completed",
      attendance: 88,
      recording: "https://example.com/recording3",
      materials: [
        { id: 5, name: "Business Models Explained.pdf", size: "4.1 MB" }
      ]
    },
    { 
      id: 4, 
      title: "Financial Planning Basics", 
      date: "2023-07-06", 
      time: "10:00 AM - 12:00 PM", 
      status: "upcoming",
      materials: [
        { id: 6, name: "Financial Planning Worksheet.xlsx", size: "1.8 MB" }
      ]
    },
  ],
  assignments: [
    {
      id: 1,
      title: "Business Idea Submission",
      description: "Submit a 1-page description of your business idea, including the problem it solves and target market.",
      dueDate: "2023-06-22",
      status: "completed",
      submissions: 7,
      maxPoints: 100
    },
    {
      id: 2,
      title: "Market Research Report",
      description: "Conduct interviews with 5 potential customers and summarize your findings in a 2-page report.",
      dueDate: "2023-06-29",
      status: "completed",
      submissions: 6,
      maxPoints: 150
    },
    {
      id: 3,
      title: "Business Model Canvas",
      description: "Complete the Business Model Canvas for your startup idea.",
      dueDate: "2023-07-06",
      status: "active",
      submissions: 4,
      maxPoints: 200
    },
    {
      id: 4,
      title: "Financial Projections",
      description: "Create a 6-month financial projection for your business using the provided template.",
      dueDate: "2023-07-13",
      status: "upcoming",
      submissions: 0,
      maxPoints: 200
    },
  ],
  submissions: [
    {
      id: 1,
      assignmentId: 1,
      studentId: 1,
      studentName: "Alex Rodriguez",
      submittedAt: "2023-06-21T14:30:00Z",
      status: "graded",
      grade: 95,
      feedback: "Excellent work! Your business idea is well-defined and addresses a clear market need.",
      files: [
        { id: 1, name: "Business_Idea_Alex.pdf", size: "1.2 MB" }
      ]
    },
    {
      id: 2,
      assignmentId: 1,
      studentId: 2,
      studentName: "Emma Wilson",
      submittedAt: "2023-06-20T09:15:00Z",
      status: "graded",
      grade: 90,
      feedback: "Great job identifying the problem and target market. Consider expanding on your competitive advantage.",
      files: [
        { id: 2, name: "Business_Idea_Emma.docx", size: "950 KB" }
      ]
    },
    {
      id: 3,
      assignmentId: 2,
      studentId: 1,
      studentName: "Alex Rodriguez",
      submittedAt: "2023-06-28T16:45:00Z",
      status: "graded",
      grade: 88,
      feedback: "Good research findings. Your interview questions were well-structured, but try to dig deeper in future interviews.",
      files: [
        { id: 3, name: "Market_Research_Alex.pdf", size: "2.1 MB" },
        { id: 4, name: "Interview_Recordings.zip", size: "15.4 MB" }
      ]
    },
    {
      id: 4,
      assignmentId: 3,
      studentId: 1,
      studentName: "Alex Rodriguez",
      submittedAt: "2023-07-05T11:20:00Z",
      status: "submitted",
      files: [
        { id: 5, name: "Business_Canvas_Alex.pdf", size: "1.8 MB" }
      ]
    },
    {
      id: 5,
      assignmentId: 3,
      studentId: 2,
      studentName: "Emma Wilson",
      submittedAt: "2023-07-04T13:10:00Z",
      status: "submitted",
      files: [
        { id: 6, name: "Business_Canvas_Emma.pdf", size: "1.5 MB" }
      ]
    },
  ],
  leaderboard: {
    national: [
      { id: 1, name: "Alex Rodriguez", points: 1250, earnings: 345, school: "Lincoln High School", rank: 1, nationalRank: 15 },
      { id: 2, name: "Emma Wilson", points: 1100, earnings: 290, school: "Washington Academy", rank: 2, nationalRank: 23 },
      { id: 3, name: "Jamal Thompson", points: 950, earnings: 210, school: "Riverside Prep", rank: 3, nationalRank: 42 },
      { id: 4, name: "Sophia Garcia", points: 900, earnings: 185, school: "Oakwood High", rank: 4, nationalRank: 56 },
      { id: 5, name: "Ethan Miller", points: 850, earnings: 170, school: "Lincoln High School", rank: 5, nationalRank: 78 },
    ],
    batch: [
      { id: 1, name: "Alex Rodriguez", points: 183, earnings: 45, rank: 1 },
      { id: 2, name: "Emma Wilson", points: 175, earnings: 40, rank: 2 },
      { id: 5, name: "Ethan Miller", points: 168, earnings: 38, rank: 3 },
      { id: 3, name: "Jamal Thompson", points: 152, earnings: 35, rank: 4 },
      { id: 4, name: "Sophia Garcia", points: 145, earnings: 32, rank: 5 },
    ]
  }
};

const AdminBatchDetails = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [gradeValue, setGradeValue] = useState('');
  const [leaderboardType, setLeaderboardType] = useState<'national' | 'batch'>('batch');
  
  // Filter students based on search term
  const filteredStudents = batchData.students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter sessions based on search term
  const filteredSessions = batchData.sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter assignments based on search term
  const filteredAssignments = batchData.assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter submissions based on search term
  const filteredSubmissions = batchData.submissions.filter(submission => 
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGradeSubmission = () => {
    if (!gradeValue || isNaN(Number(gradeValue)) || Number(gradeValue) < 0 || Number(gradeValue) > 100) {
      toast({
        title: "Invalid grade",
        description: "Please enter a valid grade between 0 and 100",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Submission graded",
      description: `You've graded ${selectedSubmission.studentName}'s submission with ${gradeValue} points.`
    });
    
    setSelectedSubmission(null);
    setFeedbackText('');
    setGradeValue('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{batchData.name}</h1>
          <p className="text-muted-foreground">Batch ID: {batchData.id}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={batchData.status === 'active' ? 'default' : 'secondary'} className="capitalize">
            {batchData.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Batch Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit size={16} className="mr-2" />
                Edit Batch
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users size={16} className="mr-2" />
                Manage Students
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar size={16} className="mr-2" />
                Schedule Session
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash size={16} className="mr-2" />
                Archive Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <div className="text-2xl font-bold">{batchData.students.filter(s => s.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">active</div>
              {batchData.students.some(s => s.status === 'inactive') && (
                <>
                  <div className="text-sm text-muted-foreground mx-1">•</div>
                  <div className="text-sm text-muted-foreground">
                    {batchData.students.filter(s => s.status === 'inactive').length} inactive
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold">
                {Math.round(batchData.students.reduce((sum, student) => sum + student.progress, 0) / batchData.students.length)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Batch Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{batchData.description}</p>
        </CardContent>
      </Card>
      
      <div className="relative">
        <div className="absolute right-0 top-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="students" className="mt-6">
          <TabsList className="w-full max-w-md grid grid-cols-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="mt-6 space-y-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'active' ? 'outline' : 'secondary'} className="capitalize">
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View Details</Button>
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
            
            <div className="flex justify-end">
              <Button className="gap-1">
                <Plus size={16} />
                Add Student
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-6 space-y-4">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="font-medium">{session.title}</div>
                        </TableCell>
                        <TableCell>
                          <div>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-xs text-muted-foreground">{session.time}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              session.status === 'completed' ? 'outline' : 
                              session.status === 'upcoming' ? 'secondary' : 'default'
                            } 
                            className="capitalize"
                          >
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {session.status === 'completed' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary" 
                                  style={{ width: `${session.attendance}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{session.attendance}%</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit size={16} className="mr-2" />
                                Edit Session
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye size={16} className="mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {session.status === 'completed' && (
                                <DropdownMenuItem>
                                  <Download size={16} className="mr-2" />
                                  Download Recording
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash size={16} className="mr-2" />
                                Cancel Session
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No sessions found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <Button className="gap-1">
                <Plus size={16} />
                Schedule Session
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-6 space-y-4">
            <Tabs defaultValue="assignments">
              <TabsList className="w-full max-w-md grid grid-cols-2">
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assignments" className="mt-4 space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell>
                              <div className="font-medium">{assignment.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {assignment.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(assignment.dueDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  assignment.status === 'completed' ? 'outline' : 
                                  assignment.status === 'active' ? 'default' : 'secondary'
                                } 
                                className="capitalize"
                              >
                                {assignment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span>{assignment.submissions}</span>
                                <span className="text-xs text-muted-foreground">/ {batchData.students.length}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">View Details</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No assignments found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end">
                  <Button className="gap-1">
                    <Plus size={16} />
                    Create Assignment
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="submissions" className="mt-4 space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((submission) => {
                          const assignment = batchData.assignments.find(a => a.id === submission.assignmentId);
                          return (
                            <TableRow key={submission.id}>
                              <TableCell>
                                <div className="font-medium">{submission.studentName}</div>
                              </TableCell>
                              <TableCell>{assignment?.title}</TableCell>
                              <TableCell>
                                {new Date(submission.submittedAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric'
                                })}
                                <div className="text-xs text-muted-foreground">
                                  {new Date(submission.submittedAt).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    submission.status === 'graded' ? 'outline' : 
                                    submission.status === 'submitted' ? 'default' : 'secondary'
                                  } 
                                  className="capitalize"
                                >
                                  {submission.status}
                                </Badge>
                                {submission.status === 'graded' && (
                                  <div className="text-xs mt-1">
                                    Grade: <span className="font-medium">{submission.grade}</span>
                                    <span className="text-muted-foreground">/{assignment?.maxPoints}</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedSubmission(submission);
                                    setFeedbackText(submission.feedback || '');
                                    setGradeValue(submission.grade?.toString() || '');
                                  }}
                                >
                                  {submission.status === 'submitted' ? 'Grade' : 'View'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No submissions found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-6 space-y-4">
            <Tabs 
              defaultValue="batch" 
              onValueChange={(value) => setLeaderboardType(value as 'national' | 'batch')}
            >
              <TabsList className="w-full max-w-md grid grid-cols-2">
                <TabsTrigger value="batch">Batch Leaderboard</TabsTrigger>
                <TabsTrigger value="national">National Leaderboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="batch" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Batch Leaderboard</CardTitle>
                    <CardDescription>Top performing students in this batch</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px] text-center">Rank</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                            <TableHead className="text-right">Earnings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchData.leaderboard.batch.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="text-center font-semibold">
                                {student.rank <= 3 ? (
                                  <div className={`
                                    w-6 h-6 mx-auto rounded-full flex items-center justify-center text-white
                                    ${student.rank === 1 ? 'bg-yellow-500' : 
                                      student.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'}
                                  `}>
                                    {student.rank}
                                  </div>
                                ) : (
                                  student.rank
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{student.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-semibold">{student.points}</TableCell>
                              <TableCell className="text-right text-success font-semibold">${student.earnings}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="national" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>National Leaderboard</CardTitle>
                    <CardDescription>How batch students rank nationally</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px] text-center">Rank</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead className="text-right">National Rank</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                            <TableHead className="text-right">Earnings</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchData.leaderboard.national.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="text-center font-semibold">
                                {student.rank <= 3 ? (
                                  <div className={`
                                    w-6 h-6 mx-auto rounded-full flex items-center justify-center text-white
                                    ${student.rank === 1 ? 'bg-yellow-500' : 
                                      student.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'}
                                  `}>
                                    {student.rank}
                                  </div>
                                ) : (
                                  student.rank
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{student.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{student.school}</TableCell>
                              <TableCell className="text-right font-semibold">#{student.nationalRank}</TableCell>
                              <TableCell className="text-right font-semibold">{student.points}</TableCell>
                              <TableCell className="text-right text-success font-semibold">${student.earnings}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Submission Review Dialog */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedSubmission.status === 'submitted' ? 'Grade Submission' : 'View Submission'}
              </DialogTitle>
              <DialogDescription>
                {batchData.assignments.find(a => a.id === selectedSubmission.assignmentId)?.title} - 
                Submitted by {selectedSubmission.studentName} on {' '}
                {new Date(selectedSubmission.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Attached Files</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSubmission.files.map((file: any) => (
                        <TableRow key={file.id}>
                          <TableCell className="flex items-center gap-2">
                            <FileText size={16} className="text-muted-foreground" />
                            {file.name}
                          </TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {selectedSubmission.status === 'submitted' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade (out of {batchData.assignments.find(a => a.id === selectedSubmission.assignmentId)?.maxPoints})</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max={batchData.assignments.find(a => a.id === selectedSubmission.assignmentId)?.maxPoints}
                      value={gradeValue}
                      onChange={(e) => setGradeValue(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Provide feedback to the student..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={5}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Grade</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-bold">{selectedSubmission.grade}</div>
                      <div className="text-muted-foreground">/ {batchData.assignments.find(a => a.id === selectedSubmission.assignmentId)?.maxPoints}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Feedback</h3>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      {selectedSubmission.feedback}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Cancel
              </Button>
              {selectedSubmission.status === 'submitted' && (
                <Button onClick={handleGradeSubmission} className="gap-1">
                  <Send size={16} />
                  Submit Grade
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminBatchDetails;

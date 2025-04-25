import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  Pencil,
  Trash2,
  Check,
  Plus,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

const API_URL =  "http://localhost:5000/api";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSession, setNewSession] = useState({
    title: "",
    batch: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    notes: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get teacher ID from localStorage
      const teacherId = localStorage.getItem("id");

      // Fetch teacher's sessions
      const sessionsResponse = await axios.get(
        `${API_URL}/sessions/teacher/${teacherId}`
      );
      setSessions(sessionsResponse.data);

      // Fetch teacher's batches for the dropdown
      const batchesResponse = await axios.get(
        `${API_URL}/batches/teacher/${teacherId}`
      );
      setBatches(batchesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load sessions data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter sessions by tab
  const upcomingSessions = sessions.filter(
    (session) => session.status === "upcoming"
  );
  const completedSessions = sessions.filter(
    (session) => session.status === "completed"
  );

  // Filter sessions by selected date
  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : "";
  const sessionsOnSelectedDate = sessions.filter((session) => {
    const sessionDate = new Date(session.date);
    return format(sessionDate, "yyyy-MM-dd") === selectedDateStr;
  });

  const handleNewSessionChange = (e) => {
    setNewSession({
      ...newSession,
      [e.target.name]: e.target.value,
    });
  };

  const handleBatchChange = (value) => {
    setNewSession({
      ...newSession,
      batch: value,
    });
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    if (selectedDate) {
      setNewSession({
        ...newSession,
        date: format(selectedDate, "yyyy-MM-dd"),
      });
    }
  };

<<<<<<< HEAD
  const handleCreateSession = () => {
    // Validate form
    if (!newSession.title || !newSession.batch || !newSession.date || !newSession.time) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive"
=======
  const handleCreateSession = async () => {
    // Validate form
    if (
      !newSession.title ||
      !newSession.batch ||
      !newSession.date ||
      !newSession.time ||
      !newSession.notes
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
      });
      return;
    }

<<<<<<< HEAD
    if (editMode && selectedSession) {
      // Update existing session
      const updatedSessions = sessions.map(session => 
        session.id === selectedSession.id 
          ? { 
              ...session, 
              title: newSession.title,
              batch: newSession.batch,
              date: newSession.date,
              time: newSession.time,
              notes: newSession.notes
            } 
          : session
      );
      setSessions(updatedSessions);
      toast({
        title: "Session updated",
        description: "The session has been updated successfully"
      });
    } else {
      // Create new session
      const newSessionObj = {
        id: sessions.length + 1,
        title: newSession.title,
        batch: newSession.batch,
        date: newSession.date,
        time: newSession.time,
        students: 8, // Default value
        status: 'upcoming' as const,
        attendance: null,
        notes: newSession.notes
      };
      setSessions([...sessions, newSessionObj]);
      toast({
        title: "Session created",
        description: "New session has been created successfully"
      });
    }

    // Reset form and close dialog
    setNewSession({
      title: '',
      batch: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      notes: ''
    });
    setShowSessionDialog(false);
    setEditMode(false);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setNewSession({
      title: session.title,
      batch: session.batch,
      date: session.date,
      time: session.time,
      notes: session.notes || ''
=======
    try {
      if (editMode && selectedSession) {
        // Update existing session
        const response = await axios.put(
          `${API_URL}/sessions/${selectedSession._id}`,
          newSession
        );

        // Update local state
        const updatedSessions = sessions.map((session) =>
          session._id === selectedSession._id ? response.data.session : session
        );
        setSessions(updatedSessions);

        toast({
          title: "Session updated",
          description: "The session has been updated successfully",
        });
      } else {
        // Create new session
        const response = await axios.post(`${API_URL}/sessions`, newSession);
        setSessions([...sessions, response.data.session]);

        toast({
          title: "Session created",
          description: "New session has been created successfully",
        });
      }

      // Reset form and close dialog
      setNewSession({
        title: "",
        batch: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "",
        notes: "",
      });
      setShowSessionDialog(false);
      setEditMode(false);

      // Refresh data to ensure consistency
      fetchData();
    } catch (error) {
      console.error("Error handling session:", error);
      toast({
        title: "Error",
        description: editMode
          ? "Failed to update session"
          : "Failed to create session",
        variant: "destructive",
      });
    }
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setNewSession({
      title: session.title,
      batch: session.batch._id || session.batch,
      date: format(new Date(session.date), "yyyy-MM-dd"),
      time: session.time,
      notes: session.notes || "",
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
    });
    setEditMode(true);
    setShowSessionDialog(true);
  };

<<<<<<< HEAD
  const handleDeleteSession = (sessionId: number) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
    setShowDeleteDialog(false);
    setSessionToDelete(null);
    toast({
      title: "Session deleted",
      description: "The session has been removed"
    });
  };

  const confirmDeleteSession = (sessionId: number) => {
=======
  const handleDeleteSession = async () => {
    try {
      await axios.delete(`${API_URL}/sessions/${sessionToDelete}`);

      // Update local state
      setSessions(
        sessions.filter((session) => session._id !== sessionToDelete)
      );
      setShowDeleteDialog(false);
      setSessionToDelete(null);

      toast({
        title: "Session deleted",
        description: "The session has been removed",
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteSession = (sessionId) => {
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
    setSessionToDelete(sessionId);
    setShowDeleteDialog(true);
  };

<<<<<<< HEAD
  const handleOpenAttendance = (session: Session) => {
=======
  const handleOpenAttendance = (session) => {
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
    setSelectedSession(session);
    setShowAttendanceDialog(true);
  };

<<<<<<< HEAD
  const handleAttendanceChange = (studentId: number, checked: boolean) => {
    if (!selectedSession) return;
    
    // If session doesn't have attendance yet, create mock attendance
    if (!selectedSession.attendance) {
      // Generate mock students
      const mockAttendance: Student[] = Array.from({ length: selectedSession.students }).map((_, index) => ({
        id: index + 1,
        name: `Student ${index + 1}`,
        present: false
      }));
      selectedSession.attendance = mockAttendance;
    }
    
    // Update attendance
    const updatedAttendance = selectedSession.attendance.map(student => 
      student.id === studentId ? { ...student, present: checked } : student
    );
    
    // Update session
    const updatedSession = { ...selectedSession, attendance: updatedAttendance };
    const updatedSessions = sessions.map(session => 
      session.id === selectedSession.id ? updatedSession : session
    );
    
=======
  const handleAttendanceChange = (studentId, checked) => {
    if (!selectedSession) return;

    // If session doesn't have attendance yet, create mock attendance
    if (!selectedSession.attendance) {
      // Generate mock students
      const mockAttendance = Array.from({
        length: selectedSession.students,
      }).map((_, index) => ({
        id: index + 1,
        name: `Student ${index + 1}`,
        present: false,
      }));
      selectedSession.attendance = mockAttendance;
    }

    // Update attendance
    const updatedAttendance = selectedSession.attendance.map((student) =>
      student.id === studentId ? { ...student, present: checked } : student
    );

    // Update session
    const updatedSession = {
      ...selectedSession,
      attendance: updatedAttendance,
    };
    const updatedSessions = sessions.map((session) =>
      session._id === selectedSession._id ? updatedSession : session
    );

>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
    setSessions(updatedSessions);
    setSelectedSession(updatedSession);
  };

  const handleSaveAttendance = () => {
    if (!selectedSession) return;
<<<<<<< HEAD
    
    // Update session status to completed
    const updatedSessions = sessions.map(session => 
      session.id === selectedSession.id 
        ? { ...session, status: 'completed' as const, attendance: selectedSession.attendance } 
        : session
    );
    
    setSessions(updatedSessions);
    setShowAttendanceDialog(false);
    
    toast({
      title: "Attendance saved",
      description: "The attendance has been recorded"
    });
  };

=======

    // Update session status to completed
    const updatedSessions = sessions.map((session) =>
      session._id === selectedSession._id
        ? {
            ...session,
            status: "completed",
            attendance: selectedSession.attendance,
          }
        : session
    );

    setSessions(updatedSessions);
    setShowAttendanceDialog(false);

    toast({
      title: "Attendance saved",
      description: "The attendance has been recorded",
    });

    // In a real app, you would also send this to the backend
    // For now, we're just updating the UI
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading sessions...</span>
      </div>
    );
  }

>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessions</h1>
<<<<<<< HEAD
        <Button onClick={() => {
          setEditMode(false);
          setSelectedSession(null);
          setNewSession({
            title: '',
            batch: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            time: '',
            notes: ''
          });
          setShowSessionDialog(true);
        }}>
=======
        <Button
          onClick={() => {
            setEditMode(false);
            setSelectedSession(null);
            setNewSession({
              title: "",
              batch: "",
              date: format(new Date(), "yyyy-MM-dd"),
              time: "",
              notes: "",
            });
            setShowSessionDialog(true);
          }}
        >
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
          <Plus className="mr-2 h-4 w-4" />
          Create Session
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingSessions.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedSessions.length})
              </TabsTrigger>
            </TabsList>
<<<<<<< HEAD
            
            <TabsContent value="upcoming" className="space-y-4 mt-6">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map(session => (
                  <Card key={session.id}>
=======

            <TabsContent value="upcoming" className="space-y-4 mt-6">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <Card key={session._id}>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{session.title}</CardTitle>
<<<<<<< HEAD
                          <CardDescription>{session.batch}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
=======
                          <CardDescription>
                            {session.batch?.batchName || "No batch"}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                            size="icon"
                            onClick={() => handleEditSession(session)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
<<<<<<< HEAD
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => confirmDeleteSession(session.id)}
=======
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => confirmDeleteSession(session._id)}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
<<<<<<< HEAD
                          <span>{format(new Date(session.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{session.students} Students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>Online Session</span>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>{session.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => handleOpenAttendance(session)}
                      >
                        Take Attendance
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No upcoming sessions scheduled.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedSessions.length > 0 ? (
                completedSessions.map(session => (
                  <Card key={session.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{session.title}</CardTitle>
                          <CardDescription>{session.batch}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => confirmDeleteSession(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(session.date), 'MMMM d, yyyy')}</span>
=======
                          <span>
                            {format(new Date(session.date), "MMMM d, yyyy")}
                          </span>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
<<<<<<< HEAD
                            {session.attendance ? 
                              `${session.attendance.filter(s => s.present).length}/${session.attendance.length} Attended` : 
                              `${session.students} Students`}
=======
                            {session.students ||
                              session.batch?.students.length ||
                              0}{" "}
                            Students
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>Online Session</span>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>{session.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
<<<<<<< HEAD
                      <Button 
                        variant="outline" 
=======
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => handleOpenAttendance(session)}
                      >
                        Take Attendance
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No upcoming sessions scheduled.
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedSessions.length > 0 ? (
                completedSessions.map((session) => (
                  <Card key={session._id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{session.title}</CardTitle>
                          <CardDescription>
                            {session.batch?.batchName || "No batch"}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => confirmDeleteSession(session._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(new Date(session.date), "MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {session.attendance
                              ? `${
                                  session.attendance.filter((s) => s.present)
                                    .length
                                }/${session.attendance.length} Attended`
                              : `${
                                  session.students ||
                                  session.batch?.totalStudents ||
                                  0
                                } Students`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>Online Session</span>
                        </div>
                      </div>
                      {session.notes && (
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p>{session.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                        className="w-full"
                        onClick={() => handleOpenAttendance(session)}
                      >
                        View Attendance
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No completed sessions found.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
<<<<<<< HEAD
        
=======

>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Session Calendar</CardTitle>
<<<<<<< HEAD
              <CardDescription>View and manage sessions by date</CardDescription>
=======
              <CardDescription>
                View and manage sessions by date
              </CardDescription>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>
<<<<<<< HEAD
            
            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">Sessions on {date ? format(date, 'MMMM d, yyyy') : 'selected date'}</h3>
              {sessionsOnSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {sessionsOnSelectedDate.map(session => (
                    <div 
                      key={session.id} 
=======

            <CardContent className="pt-6">
              <h3 className="font-medium mb-3">
                Sessions on{" "}
                {date ? format(date, "MMMM d, yyyy") : "selected date"}
              </h3>
              {sessionsOnSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {sessionsOnSelectedDate.map((session) => (
                    <div
                      key={session._id}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                      className="p-3 rounded-md border hover:border-primary transition-colors cursor-pointer"
                      onClick={() => handleEditSession(session)}
                    >
                      <div className="font-medium">{session.title}</div>
<<<<<<< HEAD
                      <div className="text-sm text-muted-foreground">{session.time}</div>
                      <div className="text-xs mt-1 text-muted-foreground">{session.batch}</div>
=======
                      <div className="text-sm text-muted-foreground">
                        {session.time}
                      </div>
                      <div className="text-xs mt-1 text-muted-foreground">
                        {session.batch?.batchName || "No batch"}
                      </div>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No sessions on this date.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
<<<<<<< HEAD
      
=======

>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
      {/* Create/Edit Session Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
<<<<<<< HEAD
            <DialogTitle>{editMode ? 'Edit Session' : 'Create New Session'}</DialogTitle>
            <DialogDescription>
              {editMode ? 'Update the session details below' : 'Fill in the details for the new session'}
=======
            <DialogTitle>
              {editMode ? "Edit Session" : "Create New Session"}
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? "Update the session details below"
                : "Fill in the details for the new session"}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
              <Label htmlFor="title" className="text-right">Title</Label>
=======
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
              <Input
                id="title"
                name="title"
                value={newSession.title}
                onChange={handleNewSessionChange}
                className="col-span-3"
                placeholder="Session title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
              <Label htmlFor="batch" className="text-right">Batch</Label>
              <Select 
                value={newSession.batch} 
=======
              <Label htmlFor="batch" className="text-right">
                Batch
              </Label>
              <Select
                value={newSession.batch}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                onValueChange={handleBatchChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
<<<<<<< HEAD
                  {batchesMockData.map(batch => (
                    <SelectItem key={batch.id} value={batch.name}>
                      {batch.name}
=======
                  {batches.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.batchName}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
              <Label htmlFor="date" className="text-right">Date</Label>
=======
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
              <Input
                id="date"
                name="date"
                type="date"
                value={newSession.date}
                onChange={handleNewSessionChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
              <Label htmlFor="time" className="text-right">Time</Label>
=======
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
              <Input
                id="time"
                name="time"
                value={newSession.time}
                onChange={handleNewSessionChange}
                className="col-span-3"
                placeholder="e.g., 10:00 AM - 11:30 AM"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
<<<<<<< HEAD
              <Label htmlFor="notes" className="text-right">Notes</Label>
=======
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
              <Textarea
                id="notes"
                name="notes"
                value={newSession.notes}
                onChange={handleNewSessionChange}
                className="col-span-3"
                placeholder="Session details and agenda"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
<<<<<<< HEAD
            <Button variant="outline" onClick={() => setShowSessionDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateSession}>
              {editMode ? 'Update Session' : 'Create Session'}
=======
            <Button
              variant="outline"
              onClick={() => setShowSessionDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSession}>
              {editMode ? "Update Session" : "Create Session"}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
<<<<<<< HEAD
      
      {/* Attendance Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSession?.status === 'completed' ? 'Attendance Record' : 'Take Attendance'}
=======

      {/* Attendance Dialog */}
      <Dialog
        open={showAttendanceDialog}
        onOpenChange={setShowAttendanceDialog}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSession?.status === "completed"
                ? "Attendance Record"
                : "Take Attendance"}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
            </DialogTitle>
            <DialogDescription>
              {selectedSession?.title} - {selectedSession?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedSession && (
              <>
                {/* If attendance exists, show it */}
                {selectedSession.attendance ? (
                  <div className="space-y-2">
<<<<<<< HEAD
                    {selectedSession.attendance.map(student => (
                      <div 
                        key={student.id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`student-${student.id}`}
                            checked={student.present}
                            onCheckedChange={(checked) => 
                              handleAttendanceChange(student.id, checked as boolean)
                            }
                            disabled={selectedSession.status === 'completed'}
                          />
                          <Label htmlFor={`student-${student.id}`}>{student.name}</Label>
=======
                    {selectedSession.attendance.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={student.present}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(
                                student.id,
                                checked as boolean
                              )
                            }
                            disabled={selectedSession.status === "completed"}
                          />
                          <Label htmlFor={`student-${student.id}`}>
                            {student.name}
                          </Label>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                        </div>
                        {student.present ? (
                          <span className="text-xs text-success flex items-center">
                            <Check size={14} className="mr-1" /> Present
                          </span>
                        ) : (
<<<<<<< HEAD
                          <span className="text-xs text-destructive">Absent</span>
                        )}
                      </div>
                    ))}
                    
                    <div className="mt-4 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">Attendance Summary</p>
                      <p className="text-sm">
                        {selectedSession.attendance.filter(s => s.present).length} out of {selectedSession.attendance.length} students present
                        ({Math.round((selectedSession.attendance.filter(s => s.present).length / selectedSession.attendance.length) * 100)}%)
=======
                          <span className="text-xs text-destructive">
                            Absent
                          </span>
                        )}
                      </div>
                    ))}

                    <div className="mt-4 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm font-medium">Attendance Summary</p>
                      <p className="text-sm">
                        {
                          selectedSession.attendance.filter((s) => s.present)
                            .length
                        }{" "}
                        out of {selectedSession.attendance.length} students
                        present (
                        {Math.round(
                          (selectedSession.attendance.filter((s) => s.present)
                            .length /
                            selectedSession.attendance.length) *
                            100
                        )}
                        %)
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                      </p>
                    </div>
                  </div>
                ) : (
                  // If no attendance yet, create a form with mock data
                  <div className="space-y-2">
<<<<<<< HEAD
                    {Array.from({ length: selectedSession.students }).map((_, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`student-${index}`}
                            onCheckedChange={(checked) => 
                              handleAttendanceChange(index + 1, checked as boolean)
                            }
                          />
                          <Label htmlFor={`student-${index}`}>Student {index + 1}</Label>
                        </div>
                      </div>
                    ))}
=======
                    {Array.from({ length: selectedSession.students }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`student-${index}`}
                              onCheckedChange={(checked) =>
                                handleAttendanceChange(
                                  index + 1,
                                  checked as boolean
                                )
                              }
                            />
                            <Label htmlFor={`student-${index}`}>
                              Student {index + 1}
                            </Label>
                          </div>
                        </div>
                      )
                    )}
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
<<<<<<< HEAD
            <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
              Close
            </Button>
            {selectedSession?.status !== 'completed' && (
              <Button onClick={handleSaveAttendance}>
                Save Attendance
              </Button>
=======
            <Button
              variant="outline"
              onClick={() => setShowAttendanceDialog(false)}
            >
              Close
            </Button>
            {selectedSession?.status !== "completed" && (
              <Button onClick={handleSaveAttendance}>Save Attendance</Button>
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
<<<<<<< HEAD
              Are you sure you want to delete this session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
=======
              Are you sure you want to delete this session? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                sessionToDelete && handleDeleteSession(sessionToDelete)
              }
>>>>>>> 59737453444889fddb9d37bd6cf6f6c5b44bc1ed
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sessions;

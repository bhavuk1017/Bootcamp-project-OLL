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
      });
      return;
    }

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
    });
    setEditMode(true);
    setShowSessionDialog(true);
  };

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
    setSessionToDelete(sessionId);
    setShowDeleteDialog(true);
  };

  const handleOpenAttendance = (session) => {
    setSelectedSession(session);
    setShowAttendanceDialog(true);
  };

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

    setSessions(updatedSessions);
    setSelectedSession(updatedSession);
  };

  const handleSaveAttendance = () => {
    if (!selectedSession) return;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessions</h1>
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

            <TabsContent value="upcoming" className="space-y-4 mt-6">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
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
                            onClick={() => handleEditSession(session)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
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
                            {session.students ||
                              session.batch?.students.length ||
                              0}{" "}
                            Students
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
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Session Calendar</CardTitle>
              <CardDescription>
                View and manage sessions by date
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>

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
                      className="p-3 rounded-md border hover:border-primary transition-colors cursor-pointer"
                      onClick={() => handleEditSession(session)}
                    >
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.time}
                      </div>
                      <div className="text-xs mt-1 text-muted-foreground">
                        {session.batch?.batchName || "No batch"}
                      </div>
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
      {/* Create/Edit Session Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Session" : "Create New Session"}
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? "Update the session details below"
                : "Fill in the details for the new session"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
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
              <Label htmlFor="batch" className="text-right">
                Batch
              </Label>
              <Select
                value={newSession.batch}
                onValueChange={handleBatchChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch._id} value={batch._id}>
                      {batch.batchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
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
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
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
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
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
            <Button
              variant="outline"
              onClick={() => setShowSessionDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSession}>
              {editMode ? "Update Session" : "Create Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                        </div>
                        {student.present ? (
                          <span className="text-xs text-success flex items-center">
                            <Check size={14} className="mr-1" /> Present
                          </span>
                        ) : (
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
                      </p>
                    </div>
                  </div>
                ) : (
                  // If no attendance yet, create a form with mock data
                  <div className="space-y-2">
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
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAttendanceDialog(false)}
            >
              Close
            </Button>
            {selectedSession?.status !== "completed" && (
              <Button onClick={handleSaveAttendance}>Save Attendance</Button>
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

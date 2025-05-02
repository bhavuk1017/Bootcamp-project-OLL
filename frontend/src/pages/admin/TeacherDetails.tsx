import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Users,
  Star,
  School,
  Edit,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import UserAvatar from "@/components/ui-custom/UserAvatar";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

const AdminTeacherDetails = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const [teacherData, setTeacherData] = useState({
        id: 1,
        name: 'Jamie Smith',
        email: 'jamie.smith@example.com',
        phone: '+1 234-567-8901',
        specialization: 'Business Strategy',
        status: 'active',
        batches: [],
        students: [],
        totalBatches: 2,
        currentBatches: 1,
        totalStudents: 31,
        totalEarnings: 1450,
        rating: 4.8,
        joiningDate: '2023-01-15',
        earnings: [
          { month: 'January', amount: 450 },
          { month: 'February', amount: 520 },
          { month: 'March', amount: 480 }
        ]
      }
  );

  const [batchData, setBatchData] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchTeacherBatchAndStudent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const teacherResponse = await axios.get(
          `http://localhost:5000/api/teachers/${teacherId}`,
          { headers }
        );
        setTeacherData(teacherResponse.data);

        const batchIds = teacherResponse.data.batches || [];
        const batchPromises = batchIds.map((batchId) =>
          axios.get(`http://localhost:5000/api/batches/${batchId}`, { headers })
        );

        const batchResponses = await Promise.all(batchPromises);
        const fetchedBatches = batchResponses.map((response) => response.data);
        setBatchData(fetchedBatches);

        const studentIds = teacherResponse.data.students || [];
        const studentPromises = studentIds.map((studentId) =>
          axios.get(`http://localhost:5000/api/students/${studentId}`, { headers })
        );
        const studentResponses = await Promise.all(studentPromises);
        const fetchedStudents = studentResponses.map((response) => response.data);
        setStudentData(fetchedStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        setLoading(false);
      }
     }

    if (teacherId) {
      fetchTeacherBatchAndStudent();
    }
  }, [teacherId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/teachers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teachers
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <UserAvatar name={teacherData.name} size="lg" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{teacherData.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{teacherData.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{teacherData.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant={teacherData.status === 'active' ? 'default' : 'secondary'}>
                      {teacherData.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{teacherData.rating} Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Batches</CardTitle>
                <CardDescription>Current and total batches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batchData.map((batch) => (
                    <div key={batch._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{batch.batchName}</span>
                      </div>
                      <Badge variant="outline">{batch.students?.length || 0} students</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>Current students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.map((student) => (
                    <div key={student._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{student.name}</span>
                      </div>
                      <Badge variant="outline">{student.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
                <CardDescription>Recent earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherData.earnings?.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{earning.month}</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span>{earning.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTeacherDetails;
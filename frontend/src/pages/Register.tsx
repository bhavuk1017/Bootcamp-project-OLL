
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Lock, School, Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Register form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [school, setSchool] = useState("");
  const [userType, setUserType] = useState<"student" | "mentor" | "admin">("student");
  
  // Bulk upload
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would be an API call to register the user
    // For demo purposes, we'll just navigate based on user type
    
    if (userType === "student") {
      navigate("/student/dashboard");
    } else if (userType === "mentor") {
      navigate("/mentor/dashboard");
    } else if (userType === "admin") {
      navigate("/admin/dashboard");
    }
    
    toast({
      title: "Registration successful!",
      description: "Your account has been created.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBulkUploadFile(e.target.files[0]);
    }
  };

  const handleBulkUpload = () => {
    if (!bulkUploadFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would process the CSV/Excel file
    toast({
      title: "Bulk upload successful",
      description: "Users have been created successfully",
    });

    setShowBulkUploadDialog(false);
    setBulkUploadFile(null);
    navigate("/admin/students");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Join the OLL Business Bootcamp platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    type="password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword"
                    type="password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="school">School Name (For Students)</Label>
              <div className="relative">
                <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="school"
                  type="text"
                  placeholder="Your School Name"
                  className="pl-10"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  type="button" 
                  variant={userType === "student" ? "default" : "outline"}
                  onClick={() => setUserType("student")}
                  className="flex-1"
                >
                  Student
                </Button>
                <Button 
                  type="button" 
                  variant={userType === "mentor" ? "default" : "outline"}
                  onClick={() => setUserType("mentor")}
                  className="flex-1"
                >
                  Mentor
                </Button>
                <Button 
                  type="button" 
                  variant={userType === "admin" ? "default" : "outline"}
                  onClick={() => setUserType("admin")}
                  className="flex-1"
                >
                  Admin
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          
          {/* Admin bulk upload option */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-3">Admin option</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowBulkUploadDialog(true)}
            >
              <Upload size={16} className="mr-2" />
              Bulk Add Users
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2 border-t p-6 text-center text-sm text-muted-foreground">
          <div>
            Already have an account? 
            <Button variant="link" className="px-2 py-0" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </div>
          <div>
            By continuing, you agree to our 
            <Button variant="link" className="px-1.5 py-0">Terms of Service</Button> and 
            <Button variant="link" className="px-1.5 py-0">Privacy Policy</Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Bulk Upload Dialog */}
      <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bulk Add Users</DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file with user information
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Drag and drop your file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Accepted file types: CSV, XLSX (max 5MB)
              </p>
              <Input 
                id="file-upload" 
                type="file" 
                accept=".csv,.xlsx" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Select File
              </Button>
            </div>
            
            {bulkUploadFile && (
              <div className="mt-4 p-3 bg-muted/30 rounded-md flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Selected file:</span> {bulkUploadFile.name}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setBulkUploadFile(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            )}
            
            <div className="mt-4 text-sm">
              <p className="font-medium">File format must include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-muted-foreground">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Password</li>
                <li>School Name (for students)</li>
                <li>User Type (student, mentor, admin)</li>
              </ul>
            </div>
            
            <div className="mt-4">
              <a 
                href="#" 
                className="text-sm text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  // In a real app, this would download a template
                  toast({
                    title: "Template downloaded",
                    description: "CSV template has been downloaded"
                  });
                }}
              >
                Download CSV template with required columns
              </a>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpload} disabled={!bulkUploadFile}>
              Upload and Create Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Mail, Phone, User, MapPin, Briefcase, Calendar, Shield, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminProfile = () => {
  // Initial profile state
  const [profile, setProfile] = useState({
    name: "Alex Rodriguez",
    email: "alex.rodriguez@oll.co",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    bio: "OLL Business Bootcamp program administrator. Responsible for overseeing all mentors, students, and program operations.",
    jobTitle: "Program Administrator",
    yearsExperience: 7,
    department: "Education Operations",
    responsibilities: [
      "Mentor management and recruitment",
      "Student enrollment coordination",
      "Program curriculum oversight",
      "Financial reporting and analysis"
    ]
  });
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});
  
  // Handle input changes when editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };
  
  // Save profile changes
  const handleSave = async () => {
    try {
      // Create a complete profile object that preserves all properties
      const completeProfile = {
        ...profile,        // Start with all properties from original profile
        ...editedProfile,  // Override with edited values
      };
  
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(completeProfile)
      });
  
      if (response.ok) {
        const result = await response.json();
        
        // Ensure the result has all the properties we need, falling back to our local data
        const updatedProfile = {
          ...completeProfile,  // Use our complete local data as fallback
          ...result,           // Override with server data when available
          // Ensure responsibilities is always an array
          responsibilities: result.responsibilities || completeProfile.responsibilities || []
        };
        
        setProfile(updatedProfile);
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated"
        });
      } else {
        // Try to parse the error
        let errorMessage = "Something went wrong.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use generic message
        }
        
        toast({
          title: "Update failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Network error",
        description: "Failed to connect to the server.",
        variant: "destructive"
      });
    }
  };
  
  // Cancel editing and revert changes
  const handleCancel = () => {
    setEditedProfile({...profile});
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={profile.name} />
                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.jobTitle}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Department
              </h3>
              <p className="text-sm">{profile.department}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Experience
              </h3>
              <p className="text-sm">{profile.yearsExperience} years</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          {isEditing ? (
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={editedProfile.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    name="location"
                    value={editedProfile.location}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle"
                    name="jobTitle"
                    value={editedProfile.jobTitle}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input 
                      id="yearsExperience"
                      name="yearsExperience"
                      type="number"
                      value={editedProfile.yearsExperience}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department"
                      name="department"
                      value={editedProfile.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>{profile.bio}</p>
                
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Core Responsibilities
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {profile.responsibilities.map((resp, index) => (
                      <li key={index} className="text-sm">{resp}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
          <CardDescription>Overall platform performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm text-muted-foreground">Total Batches</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold">243</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-muted-foreground">Active Mentors</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">$45,600</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;

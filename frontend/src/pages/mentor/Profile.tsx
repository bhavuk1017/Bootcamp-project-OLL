
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Mail, Phone, User, MapPin, Briefcase, Calendar, Shield, Edit, Users, Star, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Note: FileUpload was changed to Upload to fix the error

const MentorProfile = () => {
  // Use State for profile data
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@oll.co",
    phone: "+1 (555) 123-4567",
    location: "Boston, MA",
    bio: "Experienced entrepreneurship mentor with a passion for helping students develop their business ideas. Specializing in product development and go-to-market strategies.",
    jobTitle: "Senior Business Mentor",
    yearsExperience: 8,
    specialization: "Product Development",
    students: 11,
    averageRating: 4.7,
    education: [
      "MBA, Harvard Business School",
      "BS in Business Administration, Boston University"
    ],
    achievements: [
      "Led 3 startup incubator programs",
      "Mentored over 50 student-led businesses",
      "Former VP of Product at TechStart Inc."
    ]
  });
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };
  
  // Save changes
  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated"
    });
  };
  
  // Cancel editing
  const handleCancel = () => {
    setEditedProfile({...profile});
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mentor Profile</h1>
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
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Specialization
                </h3>
                <p className="text-sm">{profile.specialization}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Users size={16} className="text-primary" />
                  </div>
                  <p className="text-xl font-bold">{profile.students}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Star size={16} className="text-yellow-500" />
                  </div>
                  <p className="text-xl font-bold">{profile.averageRating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center">
                    <Clock size={16} className="text-accent" />
                  </div>
                  <p className="text-xl font-bold">{profile.yearsExperience}</p>
                  <p className="text-xs text-muted-foreground">Years</p>
                </div>
              </div>
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
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input 
                      id="specialization"
                      name="specialization"
                      value={editedProfile.specialization}
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Education</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {profile.education.map((edu, index) => (
                        <li key={index} className="text-sm">{edu}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Achievements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {profile.achievements.map((achievement, index) => (
                        <li key={index} className="text-sm">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Students</CardTitle>
          <CardDescription>Students you are currently mentoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium">Student</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Business</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Progress</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b transition-colors hover:bg-muted/20">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>EM</AvatarFallback>
                      </Avatar>
                      <span>Ethan Miller</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">Sustainable Bags</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-xs">75%</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="border-b transition-colors hover:bg-muted/20">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>LW</AvatarFallback>
                      </Avatar>
                      <span>Lucas Wright</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">Handcrafted Jewelry</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-xs">60%</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="transition-colors hover:bg-muted/20">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>IK</AvatarFallback>
                      </Avatar>
                      <span>Isabella Kim</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">Eco-friendly Stationery</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-xs">40%</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Students</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentorProfile;

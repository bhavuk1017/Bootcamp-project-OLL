import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User, School } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginUserType, setLoginUserType] = useState<"student" | "teacher" | "admin">("student");
  
  // Register form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [school, setSchool] = useState("");
  const [userType, setUserType] = useState<"student" | "teacher" | "admin">("student");
  
  // Check URL parameters for tab selection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [location]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
        userType: loginUserType
      });
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate based on user type
      const redirectPath = `/${response.data.user.userType}/dashboard`;
      navigate(redirectPath);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive"
        });
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        userType,
        school: userType === 'student' ? school : undefined
      });
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate based on user type
      const redirectPath = `/${response.data.user.userType}/dashboard`;
      navigate(redirectPath);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to register",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">OLL Business Bootcamp</CardTitle>
          <CardDescription>
            {activeTab === "login" 
              ? "Sign in to your account to continue" 
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6">
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant={loginUserType === "student" ? "default" : "outline"}
                      onClick={() => setLoginUserType("student")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Student
                    </Button>
                    <Button 
                      type="button" 
                      variant={loginUserType === "teacher" ? "default" : "outline"}
                      onClick={() => setLoginUserType("teacher")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Teacher
                    </Button>
                    <Button 
                      type="button" 
                      variant={loginUserType === "admin" ? "default" : "outline"}
                      onClick={() => setLoginUserType("admin")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Admin
                    </Button>
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
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password"
                      type="password"
                      className="pl-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="registerEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="registerPassword"
                        type="password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant={userType === "student" ? "default" : "outline"}
                      onClick={() => setUserType("student")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Student
                    </Button>
                    <Button 
                      type="button" 
                      variant={userType === "teacher" ? "default" : "outline"}
                      onClick={() => setUserType("teacher")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Teacher
                    </Button>
                    <Button 
                      type="button" 
                      variant={userType === "admin" ? "default" : "outline"}
                      onClick={() => setUserType("admin")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-2 border-t p-6 text-center text-sm text-muted-foreground">
          <div>
            By continuing, you agree to our 
            <a href="#" className="text-primary hover:underline ml-1">Terms of Service</a> and 
            <a href="#" className="text-primary hover:underline ml-1">Privacy Policy</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CountryRegionSelector } from "@/components/ui/country-region-selector";
import { Heart, Brain, Users } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  country: string;
  region: string;
  allowLocationAccess: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const { toast } = useToast();
  
  // Login form state
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: ""
  });

  // Registration form state
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    age: 18,
    country: "",
    region: "",
    allowLocationAccess: false
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to MindHaven!",
        description: "Your account has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  const resetForms = () => {
    setLoginData({ email: "", password: "" });
    setRegisterData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      age: 18,
      country: "",
      region: "",
      allowLocationAccess: false
    });
  };

  const handleModalClose = () => {
    resetForms();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-center justify-center">
            <div className="flex items-center gap-1">
              <Heart className="h-6 w-6 text-rose-500" />
              <Brain className="h-6 w-6 text-blue-500" />
              <Users className="h-6 w-6 text-green-500" />
            </div>
            MindBridge
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
              type="button"
              onClick={() => onModeChange('login')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onModeChange('register')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                mode === 'register'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="register-firstName">First Name</Label>
                  <Input
                    id="register-firstName"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="register-lastName">Last Name</Label>
                  <Input
                    id="register-lastName"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                  minLength={6}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="register-age">Age</Label>
                <Input
                  id="register-age"
                  type="number"
                  min="13"
                  max="120"
                  value={registerData.age}
                  onChange={(e) => setRegisterData({ ...registerData, age: parseInt(e.target.value) || 18 })}
                  required
                  className="mt-1"
                />
              </div>

              <CountryRegionSelector
                selectedCountry={registerData.country}
                selectedRegion={registerData.region}
                onCountryChange={(country) => setRegisterData({ ...registerData, country })}
                onRegionChange={(region) => setRegisterData({ ...registerData, region })}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="location-access"
                  checked={registerData.allowLocationAccess}
                  onCheckedChange={(checked) => 
                    setRegisterData({ ...registerData, allowLocationAccess: !!checked })
                  }
                />
                <Label htmlFor="location-access" className="text-sm text-gray-600 dark:text-gray-400">
                  Allow location access to find nearby therapists
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                disabled={registerMutation.isPending || !registerData.country}
              >
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              By continuing, you agree to our terms of service and privacy policy.
            </p>
            <p className="mt-2 text-xs">
              🔒 Your data is encrypted and secure
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
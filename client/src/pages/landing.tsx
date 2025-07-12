import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthModal } from "@/components/ui/auth-modal";
import { Heart, Users, UserRound, Brain, Shield, Lock } from "lucide-react";

export default function Landing() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleGetStarted = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-therapy-gray-light">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-therapy-teal to-therapy-blue rounded-lg flex items-center justify-center">
                <Heart className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-semibold text-gray-900">MindHaven</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-therapy-teal transition-colors">Home</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-therapy-teal transition-colors">How It Works</a>
              <a href="#therapists" className="text-gray-700 hover:text-therapy-teal transition-colors">Find Therapists</a>
              <a href="#community" className="text-gray-700 hover:text-therapy-teal transition-colors">Community</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleSignIn}
                className="text-therapy-blue hover:text-therapy-blue-light"
              >
                Sign In
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-therapy-teal hover:bg-therapy-teal-light text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-therapy-gray-light to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Welcome to <span className="text-therapy-teal">MindHaven</span> — your safe space for support, healing, and personal growth
                </h1>
                <p className="text-xl text-therapy-gray leading-relaxed">
                  Let's start this journey together. Connect with our empathetic AI assistant and licensed mental health professionals who understand your unique needs.
                </p>
              </div>
              
              {/* Sign Up Form */}
              <Card className="shadow-lg border border-gray-100">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Begin Your Journey</h3>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                        <Input placeholder="Enter your name" className="mt-2" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Age</Label>
                        <Input type="number" placeholder="Your age" className="mt-2" />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                      <Input type="email" placeholder="your.email@example.com" className="mt-2" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Region/State</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="california">California</SelectItem>
                            <SelectItem value="texas">Texas</SelectItem>
                            <SelectItem value="new-york">New York</SelectItem>
                            <SelectItem value="florida">Florida</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Country</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="united-states">United States</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Checkbox id="location-consent" />
                      <Label htmlFor="location-consent" className="text-sm text-gray-600">
                        Allow location access to find nearby therapists (optional)
                      </Label>
                    </div>
                    
                    <Button 
                      onClick={handleGetStarted}
                      className="w-full bg-therapy-teal hover:bg-therapy-teal-light text-white py-3"
                    >
                      Start My Journey
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    By signing up, you agree to our Terms of Service and Privacy Policy. 
                    <strong className="block mt-1">AI support is not a replacement for professional therapy.</strong>
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:pl-8">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Diverse group of people in supportive community circle" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How MindBridge Supports Your Healing Journey
            </h2>
            <p className="text-xl text-therapy-gray max-w-3xl mx-auto">
              Our platform combines empathetic AI guidance with licensed professional support to help you take the first step toward healing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-therapy-yellow-light rounded-full flex items-center justify-center mx-auto">
                <Brain className="text-therapy-yellow h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Meet Therabot</h3>
              <p className="text-therapy-gray">Start with our empathetic AI assistant who listens without judgment and provides initial coping strategies.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <UserRound className="text-therapy-blue h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Connect with Professionals</h3>
              <p className="text-therapy-gray">Get matched with licensed therapists in your area who understand your unique situation and needs.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="text-therapy-teal h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Join the Community</h3>
              <p className="text-therapy-gray">Connect with others on similar journeys in a safe, moderated environment that reduces isolation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-therapy-teal to-therapy-blue rounded-lg flex items-center justify-center">
                  <Heart className="text-white h-6 w-6" />
                </div>
                <span className="text-xl font-semibold">MindBridge</span>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-md">
                Your safe space for support, healing, and personal growth. Connecting you with empathetic AI assistance and licensed mental health professionals.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#how-it-works" className="hover:text-therapy-teal transition-colors">How It Works</a></li>
                <li><a href="#therapists" className="hover:text-therapy-teal transition-colors">Find Therapists</a></li>
                <li><a href="#community" className="hover:text-therapy-teal transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-therapy-teal transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-therapy-teal transition-colors">Crisis Resources</a></li>
                <li><a href="#" className="hover:text-therapy-teal transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-therapy-teal transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="text-sm text-gray-400">
                <p>© 2025 MindHaven. All rights reserved.</p>
                <p className="mt-1">
                  <strong>Disclaimer:</strong> AI support is not a replacement for professional therapy. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-therapy-teal" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-therapy-teal" />
                    <span>End-to-End Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}

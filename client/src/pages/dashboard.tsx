import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodTracker } from "@/components/ui/mood-tracker";
import { Heart, Brain, Book, Users, Wind, LogOut, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: recentSessions } = useQuery({
    queryKey: ["/api/sessions"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: moodEntries } = useQuery({
    queryKey: ["/api/mood"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: therapists } = useQuery({
    queryKey: ["/api/therapists"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-therapy-gray-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-therapy-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-therapy-gray">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getStreak = () => {
    if (!moodEntries || moodEntries.length === 0) return 0;
    // Simple streak calculation - count consecutive days with mood entries
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = moodEntries.some(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getLastSessionDate = () => {
    if (!recentSessions || recentSessions.length === 0) return "No sessions yet";
    const lastSession = recentSessions[0];
    const date = new Date(lastSession.createdAt);
    const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Yesterday";
    return `${daysDiff} days ago`;
  };

  return (
    <div className="min-h-screen bg-therapy-gray-light">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-therapy-teal to-therapy-blue rounded-lg flex items-center justify-center">
                <Heart className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-semibold text-gray-900">MindBridge</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-therapy-teal transition-colors">Dashboard</Link>
              <Link href="/therapists" className="text-gray-700 hover:text-therapy-teal transition-colors">Therapists</Link>
              <Link href="/community" className="text-gray-700 hover:text-therapy-teal transition-colors">Community</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-therapy-blue rounded-full flex items-center justify-center text-white text-sm">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName || 'User'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-therapy-teal to-therapy-blue text-white rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">
                Welcome back, {user?.firstName || 'there'}
              </h1>
              <p className="text-blue-100 mt-1">Last session: {getLastSessionDate()}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{getStreak()}</div>
              <div className="text-blue-100">day streak</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Therabot Section */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-therapy-yellow rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="text-white h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat with Therabot</h3>
                    <p className="text-therapy-gray mb-4">I'm here to listen and support you. How are you feeling today?</p>
                    
                    {/* Chat Preview */}
                    <div className="bg-white rounded-lg p-4 space-y-3 mb-4 border">
                      <div className="flex justify-end">
                        <div className="bg-therapy-blue text-white rounded-lg px-4 py-2 max-w-xs text-sm">
                          I've been feeling overwhelmed lately
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs text-sm">
                          I understand how overwhelming that can feel. Let's explore some ways to support you today. Would you like to try a breathing exercise or talk about what's been on your mind?
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link href="/chat">
                        <Button className="bg-therapy-teal hover:bg-therapy-teal-light text-white">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Continue Chat
                        </Button>
                      </Link>
                      <Link href="/chat?guided=true">
                        <Button variant="outline" className="border-therapy-teal text-therapy-teal hover:bg-therapy-teal hover:text-white">
                          Guided Questions
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Therapist Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recommended Therapists
                  <Link href="/therapists">
                    <Button variant="link" className="text-therapy-blue">
                      View All →
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {therapists && therapists.length > 0 ? (
                  therapists.slice(0, 2).map((therapist: any) => (
                    <div key={therapist.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <img 
                        src={therapist.profileImageUrl || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
                        alt={`${therapist.name} profile`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{therapist.name}</h4>
                        <p className="text-sm text-therapy-gray">{therapist.credentials}</p>
                        <p className="text-sm text-therapy-gray">{therapist.yearsExperience} years experience</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-therapy-yellow">
                            {"★".repeat(Math.floor(parseFloat(therapist.rating || "0")))}
                          </div>
                          <span className="text-sm text-therapy-gray ml-2">
                            {therapist.rating} ({therapist.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-therapy-blue hover:bg-therapy-blue-light text-white">
                        Request Appointment
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-therapy-gray">
                    <p>No therapists available in your area yet.</p>
                    <p className="text-sm mt-1">Check back soon as we're adding new professionals daily.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Tracking */}
            <MoodTracker />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {/* TODO: Implement journal */}}
                >
                  <Book className="h-4 w-4 mr-3" />
                  Write in Journal
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {/* TODO: Implement breathing exercise */}}
                >
                  <Wind className="h-4 w-4 mr-3" />
                  Breathing Exercise
                </Button>
                
                <Link href="/community" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-3" />
                    Visit Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

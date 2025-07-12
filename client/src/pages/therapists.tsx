import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TherapistCard } from "@/components/ui/therapist-card";
import { Heart, Search, MapPin, Clock, Star } from "lucide-react";
import { Link } from "wouter";

export default function Therapists() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [filters, setFilters] = useState({
    specialization: "",
    location: "",
    availability: "",
  });

  const { data: therapists, isLoading: therapistsLoading } = useQuery({
    queryKey: ["/api/therapists", filters],
    enabled: isAuthenticated,
    retry: false,
  });

  const requestAppointmentMutation = useMutation({
    mutationFn: async ({ therapistId, message }: { therapistId: number; message: string }) => {
      await apiRequest('POST', '/api/therapist-requests', { therapistId, message });
    },
    onSuccess: () => {
      toast({
        title: "Request Sent",
        description: "Your appointment request has been sent to the therapist. They will respond within 5 days.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to send appointment request. Please try again.",
        variant: "destructive",
      });
    },
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
          <p className="text-therapy-gray">Loading therapists...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleRequestAppointment = (therapistId: number) => {
    const message = "I would like to schedule an appointment to discuss my mental health needs.";
    requestAppointmentMutation.mutate({ therapistId, message });
  };

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/therapists"] });
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
              <span className="text-xl font-semibold text-gray-900">MindHaven</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-therapy-teal transition-colors">Dashboard</Link>
              <Link href="/therapists" className="text-therapy-teal font-medium">Therapists</Link>
              <Link href="/community" className="text-gray-700 hover:text-therapy-teal transition-colors">Community</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Licensed Mental Health Professionals
          </h1>
          <p className="text-xl text-therapy-gray max-w-3xl mx-auto">
            Connect with experienced, verified therapists who are part of our collaborative network and understand your journey.
          </p>
        </div>
        
        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Specialization</Label>
                <Select value={filters.specialization} onValueChange={(value) => setFilters(prev => ({ ...prev, specialization: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specializations</SelectItem>
                    <SelectItem value="anxiety">Anxiety & Depression</SelectItem>
                    <SelectItem value="trauma">Trauma & PTSD</SelectItem>
                    <SelectItem value="relationships">Relationship Therapy</SelectItem>
                    <SelectItem value="family">Family Therapy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="My Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">My Area</SelectItem>
                    <SelectItem value="10">Within 10 miles</SelectItem>
                    <SelectItem value="25">Within 25 miles</SelectItem>
                    <SelectItem value="virtual">Virtual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">Availability</Label>
                <Select value={filters.availability} onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                    <SelectItem value="month">Within Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full bg-therapy-teal hover:bg-therapy-teal-light text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Therapist Grid */}
        {therapistsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : therapists && therapists.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist: any) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onRequestAppointment={() => handleRequestAppointment(therapist.id)}
                isLoading={requestAppointmentMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-therapy-gray">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No therapists found</h3>
                <p>Try adjusting your search filters or check back later as we're adding new professionals daily.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

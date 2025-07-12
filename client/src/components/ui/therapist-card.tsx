import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Star, Mail, Phone } from "lucide-react";

interface Therapist {
  id: number;
  name: string;
  credentials: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  specializations?: string[];
  yearsExperience?: number;
  rating?: string;
  reviewCount?: number;
  profileImageUrl?: string;
  location?: string;
}

interface TherapistCardProps {
  therapist: Therapist;
  onRequestAppointment: () => void;
  onViewProfile?: () => void;
  isLoading?: boolean;
}

export function TherapistCard({ 
  therapist, 
  onRequestAppointment, 
  onViewProfile,
  isLoading = false 
}: TherapistCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250";
  
  const getSpecializationColor = (spec: string) => {
    const colors: Record<string, string> = {
      'anxiety': 'bg-blue-100 text-blue-800',
      'depression': 'bg-purple-100 text-purple-800',
      'trauma': 'bg-red-100 text-red-800',
      'ptsd': 'bg-red-100 text-red-800',
      'relationships': 'bg-pink-100 text-pink-800',
      'family': 'bg-green-100 text-green-800',
      'cbt': 'bg-yellow-100 text-yellow-800',
      'dbt': 'bg-indigo-100 text-indigo-800',
      'emdr': 'bg-orange-100 text-orange-800',
    };
    
    const key = spec.toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800';
  };

  const renderRating = () => {
    if (!therapist.rating) return null;
    
    const rating = parseFloat(therapist.rating);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex text-therapy-yellow">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < fullStars 
                  ? 'fill-current' 
                  : i === fullStars && hasHalfStar 
                    ? 'fill-current opacity-50' 
                    : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-therapy-gray">
          {rating.toFixed(1)} ({therapist.reviewCount || 0})
        </span>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <div className="relative">
        <img 
          src={therapist.profileImageUrl || defaultImage}
          alt={`${therapist.name} profile`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-700 border-0">
            Verified
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {therapist.name}
            </h3>
            <p className="text-therapy-gray text-sm">
              {therapist.credentials}
            </p>
          </div>
          <div className="text-right">
            {renderRating()}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {therapist.location && (
            <div className="flex items-center text-sm text-therapy-gray">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{therapist.location}</span>
            </div>
          )}
          
          {therapist.yearsExperience && (
            <div className="flex items-center text-sm text-therapy-gray">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{therapist.yearsExperience} years experience</span>
            </div>
          )}
          
          {therapist.email && (
            <div className="flex items-center text-sm text-therapy-gray">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{therapist.email}</span>
            </div>
          )}
          
          {therapist.phone && (
            <div className="flex items-center text-sm text-therapy-gray">
              <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{therapist.phone}</span>
            </div>
          )}
        </div>
        
        {therapist.specializations && therapist.specializations.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {therapist.specializations.slice(0, 3).map((spec, index) => (
                <Badge 
                  key={index}
                  className={`text-xs ${getSpecializationColor(spec)} border-0`}
                >
                  {spec}
                </Badge>
              ))}
              {therapist.specializations.length > 3 && (
                <Badge className="text-xs bg-gray-100 text-gray-600 border-0">
                  +{therapist.specializations.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {therapist.bio && (
          <div className="mb-4">
            <p className="text-sm text-therapy-gray line-clamp-3">
              {therapist.bio}
            </p>
          </div>
        )}
        
        <div className="flex space-x-3">
          <Button 
            onClick={onRequestAppointment}
            disabled={isLoading}
            className="flex-1 bg-therapy-teal hover:bg-therapy-teal-light text-white"
          >
            {isLoading ? "Requesting..." : "Request Appointment"}
          </Button>
          {onViewProfile && (
            <Button 
              onClick={onViewProfile}
              variant="outline"
              className="border-therapy-blue text-therapy-blue hover:bg-therapy-blue hover:text-white"
            >
              View Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

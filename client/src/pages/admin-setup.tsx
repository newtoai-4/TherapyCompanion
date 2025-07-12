import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSetup() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isPromoted, setIsPromoted] = useState(false);

  const promoteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/admin/promote-self", "POST", {});
    },
    onSuccess: () => {
      setIsPromoted(true);
      toast({
        title: "Success",
        description: "You are now an admin! Please refresh the page.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to grant admin privileges",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Admin Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please sign in to set up your admin account.
            </p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            MindHaven Admin Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {isPromoted ? (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-green-700">
                  Admin Access Granted!
                </h3>
                <p className="text-gray-600 mt-2">
                  You now have full access to MindHaven. Please refresh the page to continue.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = "/"}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Welcome to MindHaven
                </h3>
                <p className="text-gray-600 mt-2">
                  You're the first user! Click below to grant yourself admin privileges and gain full access to the platform.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Signed in as:</strong> {user?.email || "Unknown"}
                </p>
              </div>

              <Button 
                onClick={() => promoteMutation.mutate()}
                disabled={promoteMutation.isPending}
                className="w-full"
              >
                {promoteMutation.isPending ? "Granting Access..." : "Grant Admin Access"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
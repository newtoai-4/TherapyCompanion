import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-red-700">
            <AlertTriangle className="h-6 w-6" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <Shield className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Restricted Access
              </h3>
              <p className="text-gray-600 mt-2">
                This application is currently restricted to authorized administrators only. 
                You don't have permission to access this resource.
              </p>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                If you believe you should have access, please contact the system administrator.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = "/api/logout"}
                variant="outline"
                className="w-full"
              >
                Sign Out
              </Button>
              <Button 
                onClick={() => window.location.href = "/admin-setup"}
                className="w-full"
              >
                Admin Setup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
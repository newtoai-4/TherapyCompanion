import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Therapists from "@/pages/therapists";
import Community from "@/pages/community";
import Chat from "@/pages/chat";
import AdminSetup from "@/pages/admin-setup";
import AccessDenied from "@/pages/access-denied";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-therapy-gray-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-therapy-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-therapy-gray">Loading MindHaven...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/admin-setup" component={AdminSetup} />
      <Route path="/access-denied" component={AccessDenied} />
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/therapists" component={Therapists} />
          <Route path="/community" component={Community} />
          <Route path="/chat" component={Chat} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

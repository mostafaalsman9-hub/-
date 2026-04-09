import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useGetSettings } from "@workspace/api-client-react";
import { useEffect } from "react";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

import AdminDashboard from "@/pages/admin/index";
import AdminUsers from "@/pages/admin/users";
import AdminAnnouncements from "@/pages/admin/announcements";
import AdminVideos from "@/pages/admin/videos";
import AdminPdfs from "@/pages/admin/pdfs";
import AdminCourses from "@/pages/admin/courses";
import AdminSettings from "@/pages/admin/settings";
import AdminContact from "@/pages/admin/contact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function SiteBackground() {
  const { data: settings } = useGetSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings?.backgroundUrl) {
      root.style.setProperty("--site-bg-image", `url('${settings.backgroundUrl}')`);
      document.body.style.backgroundImage = `url('${settings.backgroundUrl}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundPosition = "center";
    } else if (settings?.backgroundColor) {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = settings.backgroundColor;
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [settings]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/announcements" component={AdminAnnouncements} />
      <Route path="/admin/videos" component={AdminVideos} />
      <Route path="/admin/pdfs" component={AdminPdfs} />
      <Route path="/admin/courses" component={AdminCourses} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/contact" component={AdminContact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  return (
    <AuthProvider>
      <SiteBackground />
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppInner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

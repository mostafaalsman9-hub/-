import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      setLocation("/dashboard");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading || (user && user.role !== "admin")) {
    return null;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}

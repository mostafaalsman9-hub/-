import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, token } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isLoading && !token) {
      setLocation("/login");
    }
  }, [isLoading, token, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.status !== "approved" && user.role !== "admin") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50">
              <AlertCircle className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">حالة الحساب: {
              user.status === "pending" ? "قيد المراجعة" :
              user.status === "rejected" ? "مرفوض" :
              user.status === "banned" ? "محظور" : user.status
            }</CardTitle>
            <CardDescription>
              {user.status === "pending" && "حسابك قيد المراجعة من قبل الإدارة. يرجى الانتظار حتى يتم الموافقة عليه لتتمكن من الوصول إلى محتوى المنصة."}
              {user.status === "rejected" && "نأسف، لقد تم رفض طلب تسجيلك في المنصة."}
              {user.status === "banned" && "تم حظر حسابك من استخدام المنصة."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

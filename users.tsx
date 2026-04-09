import { useState } from "react";
import { useListUsers, useUpdateUserStatus, useDeleteUser, useGetUserStats, getListUsersQueryKey, getGetUserStatsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { AdminRoute } from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Ban, Trash2, Users } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  approved: "مقبول",
  rejected: "مرفوض",
  banned: "محظور",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  banned: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function AdminUsers() {
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const params = filter === "all" ? {} : { status: filter as any };
  const { data, isLoading } = useListUsers(params);
  const { data: stats } = useGetUserStats();

  const updateStatus = useUpdateUserStatus({
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
        toast({ title: "تم تحديث حالة المستخدم بنجاح" });
      },
      onError: () => {
        toast({ variant: "destructive", title: "فشل تحديث الحالة" });
      },
    },
  });

  const deleteUser = useDeleteUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserStatsQueryKey() });
        toast({ title: "تم حذف المستخدم بنجاح" });
      },
      onError: () => {
        toast({ variant: "destructive", title: "فشل حذف المستخدم" });
      },
    },
  });

  const handleStatusChange = (userId: number, status: "approved" | "rejected" | "banned") => {
    updateStatus.mutate({ id: userId, data: { status } });
  };

  const handleDelete = (userId: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      deleteUser.mutate({ id: userId });
    }
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">إدارة المستخدمين</h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>الكل: <strong>{stats?.total ?? 0}</strong></span>
                <span className="text-yellow-600">معلق: <strong>{stats?.pending ?? 0}</strong></span>
                <span className="text-green-600">مقبول: <strong>{stats?.approved ?? 0}</strong></span>
                <span className="text-red-600">مرفوض: <strong>{stats?.rejected ?? 0}</strong></span>
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="تصفية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="approved">مقبول</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
                <SelectItem value="banned">محظور</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : !data?.users?.length ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد مستخدمون في هذه الفئة</p>
                </CardContent>
              </Card>
            ) : (
              data.users.map((user) => (
                <Card key={user.id} className="transition-shadow hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-2 flex-wrap">
                            {user.fullName}
                            {user.role === "admin" && <Badge variant="secondary">أدمن</Badge>}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[user.status]}`}>
                              {statusLabels[user.status]}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
                            <div>{user.email}</div>
                            <div className="flex gap-4 flex-wrap">
                              <span>هاتف: {user.phone ?? "—"}</span>
                              <span>الفرقة: {user.studyYear ?? "—"}</span>
                              <span>الرقم القومي: {user.nationalId ?? "—"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {user.role !== "admin" && (
                        <div className="flex flex-wrap gap-2 shrink-0">
                          {user.status !== "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50 gap-1"
                              onClick={() => handleStatusChange(user.id, "approved")}
                              disabled={updateStatus.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                              قبول
                            </Button>
                          )}
                          {user.status !== "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 gap-1"
                              onClick={() => handleStatusChange(user.id, "rejected")}
                              disabled={updateStatus.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                              رفض
                            </Button>
                          )}
                          {user.status !== "banned" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-600 border-gray-200 hover:bg-gray-50 gap-1"
                              onClick={() => handleStatusChange(user.id, "banned")}
                              disabled={updateStatus.isPending}
                            >
                              <Ban className="h-4 w-4" />
                              حظر
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive/20 hover:bg-destructive/5 gap-1"
                            onClick={() => handleDelete(user.id)}
                            disabled={deleteUser.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </Layout>
    </AdminRoute>
  );
}

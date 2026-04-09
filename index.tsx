import { useGetUserStats, useListAnnouncements, useListVideos, useListPdfs, useListCourses } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { AdminRoute } from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, Video, FileText, BookOpen, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: stats } = useGetUserStats();
  const { data: announcements } = useListAnnouncements();
  const { data: videos } = useListVideos({});
  const { data: pdfs } = useListPdfs({});
  const { data: courses } = useListCourses();

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
            <p className="text-muted-foreground">مرحباً بك في لوحة إدارة منصة الدكتور علي سعد</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats?.total ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">{stats?.approved ?? 0} معتمد</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  طلبات معلقة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats?.pending ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">بانتظار المراجعة</p>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">الفيديوهات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{videos?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">فيديو مرفوع</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">ملفات PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{pdfs?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">ملف مرفوع</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/users">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">إدارة المستخدمين</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">قبول / رفض / حظر</p>
                    </div>
                  </div>
                </CardHeader>
                {stats?.pending > 0 && (
                  <CardContent>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm p-2 rounded-md">
                      {stats.pending} طلب قيد الانتظار
                    </div>
                  </CardContent>
                )}
              </Card>
            </Link>

            <Link href="/admin/announcements">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">الإعلانات</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{announcements?.length ?? 0} إعلان</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/videos">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">الفيديوهات</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{videos?.length ?? 0} فيديو</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/pdfs">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">ملفات PDF</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{pdfs?.length ?? 0} ملف</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/courses">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">الكورسات</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">{courses?.length ?? 0} كورس</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                    </div>
                    <div>
                      <CardTitle className="text-base">إعدادات الموقع</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">خلفية وتخصيص</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </Layout>
    </AdminRoute>
  );
}

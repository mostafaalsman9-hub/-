import { useState } from "react";
import { useListCourses, useCreateCourse, useDeleteCourse, getListCoursesQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { AdminRoute } from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, BookOpen, X, Clock, Calendar } from "lucide-react";

export default function AdminCourses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [schedule, setSchedule] = useState("");

  const { data: courses, isLoading } = useListCourses();

  const createMutation = useCreateCourse({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        toast({ title: "تم إنشاء الكورس بنجاح" });
        setName(""); setDescription(""); setDuration(""); setSchedule(""); setShowForm(false);
      },
      onError: () => toast({ variant: "destructive", title: "فشل إنشاء الكورس" }),
    },
  });

  const deleteMutation = useDeleteCourse({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCoursesQueryKey() });
        toast({ title: "تم حذف الكورس" });
      },
      onError: () => toast({ variant: "destructive", title: "فشل الحذف" }),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ data: { name, description: description || undefined, duration: duration || undefined, schedule: schedule || undefined } });
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">الكورسات</h1>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "إلغاء" : "كورس جديد"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 border-primary/20">
              <CardHeader><CardTitle className="text-lg">إنشاء كورس جديد</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>اسم الكورس *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الكورس" required />
                  </div>
                  <div className="space-y-2">
                    <Label>وصف الكورس</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف الكورس..." rows={3} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>مدة الكورس</Label>
                      <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="مثال: 4 أسابيع" />
                    </div>
                    <div className="space-y-2">
                      <Label>جدول المواعيد</Label>
                      <Input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="مثال: الجمعة والسبت - 10 صباحاً" />
                    </div>
                  </div>
                  <Button type="submit" disabled={createMutation.isPending} className="w-full">
                    {createMutation.isPending ? "جاري الإنشاء..." : "إنشاء الكورس"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-6 w-2/3" /><Skeleton className="h-16 w-full mt-2" /></CardHeader></Card>)
            ) : !courses?.length ? (
              <Card className="col-span-full text-center py-16">
                <CardContent>
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد كورسات بعد</p>
                </CardContent>
              </Card>
            ) : (
              courses.map((course) => (
                <Card key={course.id} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {course.name}
                        </CardTitle>
                        {course.description && <CardDescription className="mt-2 leading-relaxed">{course.description}</CardDescription>}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => { if (confirm("تأكيد حذف الكورس؟ سيتم إلغاء ربطه بالفيديوهات والملفات.")) deleteMutation.mutate({ id: course.id }); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {course.duration && <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{course.duration}</div>}
                      {course.schedule && <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{course.schedule}</div>}
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

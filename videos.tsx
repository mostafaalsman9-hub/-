import { useState } from "react";
import { useListVideos, useCreateVideo, useDeleteVideo, useListCourses, getListVideosQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { AdminRoute } from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Video, X } from "lucide-react";

export default function AdminVideos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<"youtube" | "googledrive" | "mega">("youtube");
  const [courseId, setCourseId] = useState<string>("");

  const { data: videos, isLoading } = useListVideos({});
  const { data: courses } = useListCourses();

  const createMutation = useCreateVideo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListVideosQueryKey() });
        toast({ title: "تم إضافة الفيديو بنجاح" });
        setTitle(""); setDescription(""); setUrl(""); setSource("youtube"); setCourseId(""); setShowForm(false);
      },
      onError: () => toast({ variant: "destructive", title: "فشل إضافة الفيديو" }),
    },
  });

  const deleteMutation = useDeleteVideo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListVideosQueryKey() });
        toast({ title: "تم حذف الفيديو" });
      },
      onError: () => toast({ variant: "destructive", title: "فشل الحذف" }),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    createMutation.mutate({ data: { title, description: description || undefined, url, source, courseId: courseId ? parseInt(courseId) : undefined } });
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">الفيديوهات</h1>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "إلغاء" : "فيديو جديد"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 border-primary/20">
              <CardHeader><CardTitle className="text-lg">إضافة فيديو جديد</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vtitle">عنوان الفيديو *</Label>
                      <Input id="vtitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الفيديو" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vsource">المصدر *</Label>
                      <Select value={source} onValueChange={(v) => setSource(v as any)}>
                        <SelectTrigger id="vsource"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="googledrive">Google Drive</SelectItem>
                          <SelectItem value="mega">Mega</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vurl">رابط الفيديو *</Label>
                    <Input id="vurl" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." dir="ltr" className="text-left" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vdesc">وصف الفيديو</Label>
                      <Textarea id="vdesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف الفيديو (اختياري)" rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vcourse">الكورس (اختياري)</Label>
                      <Select value={courseId} onValueChange={setCourseId}>
                        <SelectTrigger id="vcourse"><SelectValue placeholder="اختر كورس" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">بدون كورس</SelectItem>
                          {courses?.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" disabled={createMutation.isPending} className="w-full">
                    {createMutation.isPending ? "جاري الإضافة..." : "إضافة الفيديو"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader></Card>)
            ) : !videos?.length ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد فيديوهات بعد</p>
                </CardContent>
              </Card>
            ) : (
              videos.map((video) => (
                <Card key={video.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{video.source}</Badge>
                          {video.courseName && <Badge variant="secondary">{video.courseName}</Badge>}
                        </div>
                        {video.description && <CardDescription className="mt-2">{video.description}</CardDescription>}
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs" dir="ltr">{video.url}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => { if (confirm("تأكيد حذف الفيديو؟")) deleteMutation.mutate({ id: video.id }); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </Layout>
    </AdminRoute>
  );
}

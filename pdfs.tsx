import { useState } from "react";
import { useListPdfs, useCreatePdf, useDeletePdf, useListCourses, getListPdfsQueryKey } from "@workspace/api-client-react";
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
import { Plus, Trash2, FileText, X } from "lucide-react";

export default function AdminPdfs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<"upload" | "mega" | "link">("link");
  const [courseId, setCourseId] = useState<string>("");

  const { data: pdfs, isLoading } = useListPdfs({});
  const { data: courses } = useListCourses();

  const createMutation = useCreatePdf({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPdfsQueryKey() });
        toast({ title: "تم إضافة الملف بنجاح" });
        setTitle(""); setDescription(""); setUrl(""); setSource("link"); setCourseId(""); setShowForm(false);
      },
      onError: () => toast({ variant: "destructive", title: "فشل إضافة الملف" }),
    },
  });

  const deleteMutation = useDeletePdf({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPdfsQueryKey() });
        toast({ title: "تم حذف الملف" });
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
            <h1 className="text-3xl font-bold">ملفات PDF</h1>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "إلغاء" : "ملف جديد"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 border-primary/20">
              <CardHeader><CardTitle className="text-lg">إضافة ملف PDF</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>عنوان الملف *</Label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="اسم الملف" required />
                    </div>
                    <div className="space-y-2">
                      <Label>المصدر *</Label>
                      <Select value={source} onValueChange={(v) => setSource(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="link">رابط مباشر</SelectItem>
                          <SelectItem value="mega">Mega</SelectItem>
                          <SelectItem value="upload">رفع من الجهاز</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>رابط الملف *</Label>
                    <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." dir="ltr" className="text-left" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>وصف الملف</Label>
                      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف مختصر (اختياري)" rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>الكورس (اختياري)</Label>
                      <Select value={courseId} onValueChange={setCourseId}>
                        <SelectTrigger><SelectValue placeholder="اختر كورس" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">بدون كورس</SelectItem>
                          {courses?.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" disabled={createMutation.isPending} className="w-full">
                    {createMutation.isPending ? "جاري الإضافة..." : "إضافة الملف"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader></Card>)
            ) : !pdfs?.length ? (
              <Card className="text-center py-16">
                <CardContent>
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد ملفات بعد</p>
                </CardContent>
              </Card>
            ) : (
              pdfs.map((pdf) => (
                <Card key={pdf.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          {pdf.title}
                        </CardTitle>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline">{pdf.source}</Badge>
                          {pdf.courseName && <Badge variant="secondary">{pdf.courseName}</Badge>}
                        </div>
                        {pdf.description && <CardDescription className="mt-2">{pdf.description}</CardDescription>}
                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs" dir="ltr">{pdf.url}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => { if (confirm("تأكيد حذف الملف؟")) deleteMutation.mutate({ id: pdf.id }); }}
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

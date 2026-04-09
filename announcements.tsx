import { useState } from "react";
import { useListAnnouncements, useCreateAnnouncement, useDeleteAnnouncement, getListAnnouncementsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { AdminRoute } from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Megaphone, X } from "lucide-react";

export default function AdminAnnouncements() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data, isLoading } = useListAnnouncements();

  const createMutation = useCreateAnnouncement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        toast({ title: "تم إضافة الإعلان بنجاح" });
        setTitle(""); setContent(""); setImageUrl(""); setShowForm(false);
      },
      onError: () => toast({ variant: "destructive", title: "فشل إضافة الإعلان" }),
    },
  });

  const deleteMutation = useDeleteAnnouncement({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
        toast({ title: "تم حذف الإعلان" });
      },
      onError: () => toast({ variant: "destructive", title: "فشل الحذف" }),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    createMutation.mutate({ data: { title, content, imageUrl: imageUrl || undefined } });
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">الإعلانات</h1>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "إلغاء" : "إعلان جديد"}
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">إضافة إعلان جديد</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان الإعلان *</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإعلان" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">محتوى الإعلان *</Label>
                    <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="اكتب محتوى الإعلان هنا..." rows={4} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">رابط الصورة (اختياري)</Label>
                    <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" dir="ltr" className="text-left" />
                  </div>
                  <Button type="submit" disabled={createMutation.isPending} className="w-full">
                    {createMutation.isPending ? "جاري الإضافة..." : "إضافة الإعلان"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}><CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
              ))
            ) : !data?.length ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">لا توجد إعلانات بعد</p>
                </CardContent>
              </Card>
            ) : (
              data.map((ann) => (
                <Card key={ann.id} className="overflow-hidden">
                  {ann.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{ann.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(ann.createdAt).toLocaleDateString("ar-EG")}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                        onClick={() => { if (confirm("تأكيد الحذف؟")) deleteMutation.mutate({ id: ann.id }); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{ann.content}</p>
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

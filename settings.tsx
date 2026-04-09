import { useState, useEffect } from "react";
import { useGetSettings, useUpdateBackground, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { AdminRoute } from "@/components/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Save, Image, Palette } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings();

  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");

  useEffect(() => {
    if (settings) {
      setBackgroundUrl(settings.backgroundUrl ?? "");
      setBackgroundColor(settings.backgroundColor ?? "#0f172a");
    }
  }, [settings]);

  const updateMutation = useUpdateBackground({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "تم تحديث خلفية الموقع بنجاح" });
      },
      onError: () => toast({ variant: "destructive", title: "فشل التحديث" }),
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      data: {
        backgroundUrl: backgroundUrl || undefined,
        backgroundColor: backgroundColor || undefined,
      },
    });
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">إعدادات الموقع</h1>
            <p className="text-muted-foreground">تخصيص مظهر وخلفية المنصة</p>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Image className="h-5 w-5 text-primary" />
                  خلفية الموقع بصورة
                </CardTitle>
                <CardDescription>أدخل رابط صورة لاستخدامها كخلفية للموقع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="bgUrl">رابط الصورة</Label>
                  <Input
                    id="bgUrl"
                    value={backgroundUrl}
                    onChange={(e) => setBackgroundUrl(e.target.value)}
                    placeholder="https://example.com/background.jpg"
                    dir="ltr"
                    className="text-left"
                  />
                  {backgroundUrl && (
                    <div className="relative h-32 rounded-lg overflow-hidden border">
                      <img src={backgroundUrl} alt="معاينة الخلفية" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="h-5 w-5 text-primary" />
                  لون الخلفية
                </CardTitle>
                <CardDescription>اختر لوناً للخلفية إذا لم تكن تستخدم صورة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="bgColor">لون الخلفية</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="bgColor"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="h-10 w-20 rounded border cursor-pointer"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#000000"
                      dir="ltr"
                      className="text-left max-w-32"
                    />
                    <div className="h-10 w-10 rounded border" style={{ backgroundColor }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending || isLoading}
              className="w-full gap-2"
              size="lg"
            >
              <Save className="h-4 w-4" />
              {updateMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>
          </div>
        </div>
      </Layout>
    </AdminRoute>
  );
}

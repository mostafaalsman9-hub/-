import { useGetContact } from "@workspace/api-client-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Droplets, Phone, Mail, Facebook, Send, MessageCircle, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const { data: contact, isLoading } = useGetContact();

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Droplets className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">تواصل معنا</h1>
          <p className="text-muted-foreground text-lg">منصة الدكتور علي سعد التعليمية</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">نبذة عن المنصة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap">
                  {contact?.about ?? "منصة الدكتور علي سعد التعليمية - متخصصة في دورات السباحة والإنقاذ المائي."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl">وسائل التواصل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contact?.phone && (
                    <a href={`tel:${contact.phone}`}>
                      <Button variant="outline" className="w-full justify-start gap-3 h-12">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-xs text-muted-foreground">الهاتف</p>
                          <p className="font-medium" dir="ltr">{contact.phone}</p>
                        </div>
                      </Button>
                    </a>
                  )}
                  {contact?.email && (
                    <a href={`mailto:${contact.email}`}>
                      <Button variant="outline" className="w-full justify-start gap-3 h-12">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                          <p className="font-medium" dir="ltr">{contact.email}</p>
                        </div>
                      </Button>
                    </a>
                  )}
                  {contact?.whatsapp && (
                    <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-3 h-12">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-xs text-muted-foreground">واتساب</p>
                          <p className="font-medium">{contact.whatsapp}</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </a>
                  )}
                  {contact?.facebook && (
                    <a href={contact.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-3 h-12">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Facebook className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-xs text-muted-foreground">فيسبوك</p>
                          <p className="font-medium">صفحة المنصة</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </a>
                  )}
                  {contact?.telegram && (
                    <a href={contact.telegram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-3 h-12">
                        <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                          <Send className="h-4 w-4 text-sky-600" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-xs text-muted-foreground">تيليجرام</p>
                          <p className="font-medium">قناة المنصة</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </a>
                  )}
                  {contact?.instagram && (
                    <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full justify-start gap-3 h-12">
                        <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                          <Instagram className="h-4 w-4 text-pink-600" />
                        </div>
                        <div className="text-right flex-1">
                          <p className="text-xs text-muted-foreground">إنستجرام</p>
                          <p className="font-medium">حساب المنصة</p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </a>
                  )}
                </div>

                {!contact?.phone && !contact?.email && !contact?.facebook && !contact?.telegram && !contact?.whatsapp && !contact?.instagram && (
                  <p className="text-center text-muted-foreground py-4">لم يتم إضافة وسائل تواصل بعد</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

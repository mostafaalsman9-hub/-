import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Loader2, CheckCircle2 } from "lucide-react";
import { useRegister } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  fullName: z.string().min(3, { message: "الاسم الكامل مطلوب (3 أحرف على الأقل)" }),
  nationalId: z.string().min(14, { message: "الرقم القومي يجب أن يكون 14 رقم" }),
  phone: z.string().min(10, { message: "رقم الهاتف غير صالح" }),
  studyYear: z.string().min(1, { message: "الفرقة الدراسية مطلوبة" }),
  email: z.string().email({ message: "بريد إلكتروني غير صالح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      nationalId: "",
      phone: "",
      studyYear: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
        toast({
          title: "تم التسجيل بنجاح",
          description: "حسابك الآن قيد المراجعة",
        });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "فشل التسجيل",
          description: error.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب",
        });
      },
    },
  });

  function onSubmit(data: RegisterFormValues) {
    registerMutation.mutate({ data });
  }

  if (isSuccess) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
        <Card className="w-full max-w-md shadow-lg border-primary/10 text-center">
          <CardHeader className="space-y-2 pb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold font-heading text-green-700">تم التسجيل بنجاح!</CardTitle>
            <CardDescription className="text-base mt-2">
              تم إنشاء حسابك وهو الآن قيد المراجعة من قبل الإدارة.
              <br />
              يرجى الانتظار حتى يتم تفعيل حسابك لتتمكن من الدخول للمنصة.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-4 border-t flex justify-center">
            <Link href="/login">
              <Button className="w-full px-8">الذهاب لصفحة تسجيل الدخول</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
      <Card className="w-full max-w-xl shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
            <Droplets className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-heading">حساب جديد</CardTitle>
          <CardDescription className="text-base">
            أنشئ حسابك للوصول إلى المنصة والمقررات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الرباعي</FormLabel>
                      <FormControl>
                        <Input placeholder="الاسم كاملاً" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرقم القومي</FormLabel>
                      <FormControl>
                        <Input placeholder="14 رقم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input placeholder="01xxxxxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studyYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الفرقة الدراسية</FormLabel>
                      <FormControl>
                        <Input placeholder="الفرقة الأولى / الثانية..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" type="email" dir="ltr" className="text-left" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" dir="ltr" className="text-left" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button type="submit" className="w-full h-11" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin ml-2" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    "إنشاء حساب"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

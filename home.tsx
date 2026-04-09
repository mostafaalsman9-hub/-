import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Droplets, GraduationCap, Users, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-24 sm:py-32 flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)' }} />
        
        <div className="container relative z-10 px-4 mx-auto text-center">
          <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 space-x-reverse overflow-hidden rounded-full border border-primary/20 bg-primary/10 px-7 py-2 backdrop-blur transition-all hover:bg-primary/20 mb-8">
            <Droplets className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold text-primary">أكاديمية السباحة الاحترافية</p>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-heading mb-6 leading-tight">
            منصة الدكتور <span className="text-primary">علي سعد</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl mb-10 leading-relaxed">
            المنصة التعليمية الرائدة لتعلم السباحة وفنون الإنقاذ. نوفر محتوى تعليمي متكامل يجمع بين الجانب النظري والتطبيق العملي لبناء سباحين محترفين.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                  الذهاب للوحة التحكم
                  <ArrowLeft className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                    سجل الآن
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                    تسجيل الدخول
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">محتوى أكاديمي معتمد</h3>
              <p className="text-muted-foreground leading-relaxed">
                مناهج علمية وعملية معتمدة تغطي كافة جوانب رياضة السباحة من التأسيس حتى الاحتراف.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-6">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">متابعة مستمرة</h3>
              <p className="text-muted-foreground leading-relaxed">
                تواصل مباشر وتقييم دوري لمستوى الطلاب لضمان تحقيق أقصى استفادة من البرامج التدريبية.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="h-14 w-14 rounded-full bg-chart-2/10 flex items-center justify-center text-chart-2 mb-6">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">بيئة آمنة</h3>
              <p className="text-muted-foreground leading-relaxed">
                منصة مخصصة للطلاب المعتمدين فقط تضمن جودة البيئة التعليمية وسرية المحتوى.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

# منصة الدكتور علي سعد التعليمية

## نظرة عامة
منصة تعليمية متخصصة في دورات السباحة والإنقاذ المائي للدكتور علي سعد. تتميز بواجهة عربية RTL احترافية، نظام مصادقة JWT مع موافقة الأدمن، ولوحة تحكم متكاملة.

## المعمارية
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui (Arabic RTL, Cairo font)
- **Backend**: Express + PostgreSQL + Drizzle ORM + JWT Auth
- **API Client**: Auto-generated from OpenAPI spec (orval codegen)
- **Notifications**: Telegram Bot integration

## الـ Ports
- API Server: port 8080 (external port 80)
- Frontend Dev: port 18961 (external port 3000)
- الـ Vite proxy يوجه `/api/*` إلى `localhost:8080`

## هيكل الملفات
```
artifacts/
  api-server/       - Express backend (port 8080)
    src/
      routes/       - auth, users, announcements, videos, pdfs, courses, contact
      middlewares/  - JWT auth (requireAuth, requireAdmin, requireApproved)
      lib/          - telegram.ts, db.ts, logger.ts
  dr-ali-saad/      - React frontend (port 18961)
    src/
      pages/        - home, login, register, dashboard, contact
      pages/admin/  - index, users, announcements, videos, pdfs, courses, settings, contact
      components/   - Layout, ProtectedRoute, AdminRoute
      contexts/     - AuthContext
      lib/          - api-config.ts
lib/
  api-spec/         - OpenAPI specification
  api-client-react/ - Auto-generated API hooks
  db/               - Drizzle schema + migrations
```

## بيانات الأدمن
- **Email**: abu_alsaman@asiauniv.edu.eg
- **Password**: admin2026
- **Role**: admin (status: approved)

## المميزات المكتملة
- [x] نظام تسجيل دخول/خروج بـ JWT
- [x] تسجيل طلاب جدد مع انتظار موافقة الأدمن
- [x] لوحة تحكم الأدمن (إدارة مستخدمين، إعلانات، فيديوهات، PDFs، كورسات، إعدادات)
- [x] لوحة الطالب (عرض الإعلانات، الفيديوهات، الـ PDFs، الكورسات)
- [x] إشعارات Telegram عند التسجيل والموافقة والنشر
- [x] صفحة التواصل قابلة للتعديل من الأدمن
- [x] خلفية الموقع قابلة للتخصيص (صورة أو لون)
- [x] تصميم RTL عربي كامل بخط Cairo

## متغيرات البيئة المهمة
- `SESSION_SECRET` - موجود في Replit secrets
- `DATABASE_URL` - تلقائي من Replit PostgreSQL
- Telegram Token & Chat ID مضمنة في api-server/src/lib/telegram.ts

## قاعدة البيانات
الجداول: users, courses, announcements, videos, pdfs, site_settings
Schema: lib/db/src/schema/index.ts

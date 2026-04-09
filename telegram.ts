import { logger } from "./logger";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8757797763:AAFVyKAzAd8TR0FgSbTtBVtBo2v96nQoMaI";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7924927222";

async function sendTelegramMessage(message: string): Promise<void> {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error({ error }, "Telegram API error");
    }
  } catch (err) {
    logger.error({ err }, "Failed to send Telegram message");
  }
}

export async function notifyNewRegistration(user: {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  studyYear: string;
}): Promise<void> {
  const message = `
🆕 <b>طلب تسجيل جديد</b>

👤 الاسم: ${user.fullName}
📧 البريد: ${user.email}
📞 الهاتف: ${user.phone}
🪪 الرقم القومي: ${user.nationalId}
🎓 الفرقة: ${user.studyYear}

⏰ يرجى مراجعة لوحة التحكم للموافقة أو الرفض.
  `.trim();

  await sendTelegramMessage(message);
}

export async function notifyUserApproved(user: {
  fullName: string;
  email: string;
}): Promise<void> {
  const message = `
✅ <b>تم قبول مستخدم</b>

👤 الاسم: ${user.fullName}
📧 البريد: ${user.email}

🎉 يمكنه الآن الدخول إلى المنصة.
  `.trim();

  await sendTelegramMessage(message);
}

export async function notifyNewVideo(video: {
  title: string;
  source: string;
  url: string;
  courseName?: string | null;
}): Promise<void> {
  const message = `
🎬 <b>تم رفع فيديو جديد</b>

📹 العنوان: ${video.title}
🔗 المصدر: ${video.source}
${video.courseName ? `📚 الكورس: ${video.courseName}` : ""}
🌐 الرابط: ${video.url}
  `.trim();

  await sendTelegramMessage(message);
}

export async function notifyNewPdf(pdf: {
  title: string;
  source: string;
  url: string;
  courseName?: string | null;
}): Promise<void> {
  const message = `
📄 <b>تم رفع ملف PDF جديد</b>

📋 العنوان: ${pdf.title}
🔗 المصدر: ${pdf.source}
${pdf.courseName ? `📚 الكورس: ${pdf.courseName}` : ""}
🌐 الرابط: ${pdf.url}
  `.trim();

  await sendTelegramMessage(message);
}

export async function notifyNewAnnouncement(announcement: {
  title: string;
  content: string;
}): Promise<void> {
  const message = `
📢 <b>إعلان جديد</b>

📌 العنوان: ${announcement.title}
📝 المحتوى: ${announcement.content.slice(0, 200)}${announcement.content.length > 200 ? "..." : ""}
  `.trim();

  await sendTelegramMessage(message);
}

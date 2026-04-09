import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

async function getOrCreateSettings() {
  const existing = await db.select().from(siteSettingsTable).limit(1);
  if (existing.length > 0) {
    return existing[0];
  }
  const [settings] = await db.insert(siteSettingsTable).values({}).returning();
  return settings;
}

// GET /contact - Get contact info (public)
router.get("/contact", async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json({
    about: settings.about,
    phone: settings.phone,
    email: settings.email,
    facebook: settings.facebook,
    telegram: settings.telegram,
    whatsapp: settings.whatsapp,
    instagram: settings.instagram,
  });
});

// PUT /contact - Update contact info (admin only)
router.put("/contact", requireAdmin, async (req, res): Promise<void> => {
  const { about, phone, email, facebook, telegram, whatsapp, instagram } = req.body;

  await getOrCreateSettings();

  const [settings] = await db
    .update(siteSettingsTable)
    .set({
      about: about ?? undefined,
      phone: phone ?? null,
      email: email ?? null,
      facebook: facebook ?? null,
      telegram: telegram ?? null,
      whatsapp: whatsapp ?? null,
      instagram: instagram ?? null,
    })
    .returning();

  req.log.info("Contact info updated");
  res.json({
    about: settings.about,
    phone: settings.phone,
    email: settings.email,
    facebook: settings.facebook,
    telegram: settings.telegram,
    whatsapp: settings.whatsapp,
    instagram: settings.instagram,
  });
});

// PUT /settings/background - Update background (admin only)
router.put("/settings/background", requireAdmin, async (req, res): Promise<void> => {
  const { backgroundUrl, backgroundColor } = req.body;

  await getOrCreateSettings();

  await db.update(siteSettingsTable).set({
    backgroundUrl: backgroundUrl ?? null,
    backgroundColor: backgroundColor ?? null,
  });

  req.log.info("Background updated");
  res.json({ message: "تم تحديث خلفية الموقع بنجاح" });
});

// GET /settings - Get site settings (public)
router.get("/settings", async (req, res): Promise<void> => {
  const settings = await getOrCreateSettings();
  res.json({
    backgroundUrl: settings.backgroundUrl,
    backgroundColor: settings.backgroundColor,
  });
});

export default router;

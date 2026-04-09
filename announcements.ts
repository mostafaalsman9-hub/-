import { Router } from "express";
import { db } from "@workspace/db";
import { announcementsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireApproved } from "../middlewares/auth";
import { notifyNewAnnouncement } from "../lib/telegram";

const router = Router();

// GET /announcements - List announcements (approved users + admin)
router.get("/announcements", requireApproved, async (req, res): Promise<void> => {
  const announcements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt));

  res.json(announcements);
});

// POST /announcements - Create announcement (admin only)
router.post("/announcements", requireAdmin, async (req, res): Promise<void> => {
  const { title, content, imageUrl } = req.body;

  if (!title || !content) {
    res.status(400).json({ error: "Bad Request", message: "Title and content are required" });
    return;
  }

  const [announcement] = await db
    .insert(announcementsTable)
    .values({ title, content, imageUrl: imageUrl || null })
    .returning();

  await notifyNewAnnouncement({ title, content });

  req.log.info({ announcementId: announcement.id }, "Announcement created");
  res.status(201).json(announcement);
});

// DELETE /announcements/:id - Delete announcement (admin only)
router.delete("/announcements/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId);
  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid ID" });
    return;
  }

  const deleted = await db.delete(announcementsTable).where(eq(announcementsTable.id, id)).returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Not Found", message: "Announcement not found" });
    return;
  }

  req.log.info({ announcementId: id }, "Announcement deleted");
  res.json({ message: "تم حذف الإعلان بنجاح" });
});

export default router;

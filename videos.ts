import { Router } from "express";
import { db } from "@workspace/db";
import { videosTable, coursesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireApproved } from "../middlewares/auth";
import { notifyNewVideo } from "../lib/telegram";

const router = Router();

// GET /videos - List videos (approved users + admin)
router.get("/videos", requireApproved, async (req, res): Promise<void> => {
  const { courseId } = req.query as Record<string, string>;

  const videos = await db
    .select({
      id: videosTable.id,
      title: videosTable.title,
      description: videosTable.description,
      url: videosTable.url,
      source: videosTable.source,
      courseId: videosTable.courseId,
      courseName: coursesTable.name,
      createdAt: videosTable.createdAt,
    })
    .from(videosTable)
    .leftJoin(coursesTable, eq(videosTable.courseId, coursesTable.id))
    .where(courseId ? eq(videosTable.courseId, parseInt(courseId)) : undefined)
    .orderBy(desc(videosTable.createdAt));

  res.json(videos);
});

// POST /videos - Add video (admin only)
router.post("/videos", requireAdmin, async (req, res): Promise<void> => {
  const { title, description, url, source, courseId } = req.body;

  if (!title || !url || !source) {
    res.status(400).json({ error: "Bad Request", message: "Title, url, and source are required" });
    return;
  }

  if (!["youtube", "googledrive", "mega"].includes(source)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid source" });
    return;
  }

  const [video] = await db
    .insert(videosTable)
    .values({
      title,
      description: description || null,
      url,
      source,
      courseId: courseId || null,
    })
    .returning();

  // Get course name for notification
  let courseName: string | null = null;
  if (courseId) {
    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);
    courseName = course?.name || null;
  }

  await notifyNewVideo({ title, source, url, courseName });

  req.log.info({ videoId: video.id }, "Video added");
  res.status(201).json({ ...video, courseName });
});

// DELETE /videos/:id - Delete video (admin only)
router.delete("/videos/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId);
  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid ID" });
    return;
  }

  const deleted = await db.delete(videosTable).where(eq(videosTable.id, id)).returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Not Found", message: "Video not found" });
    return;
  }

  req.log.info({ videoId: id }, "Video deleted");
  res.json({ message: "تم حذف الفيديو بنجاح" });
});

export default router;

import { Router } from "express";
import { db } from "@workspace/db";
import { pdfsTable, coursesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireApproved } from "../middlewares/auth";
import { notifyNewPdf } from "../lib/telegram";

const router = Router();

// GET /pdfs - List PDFs (approved users + admin)
router.get("/pdfs", requireApproved, async (req, res): Promise<void> => {
  const { courseId } = req.query as Record<string, string>;

  const pdfs = await db
    .select({
      id: pdfsTable.id,
      title: pdfsTable.title,
      description: pdfsTable.description,
      url: pdfsTable.url,
      source: pdfsTable.source,
      courseId: pdfsTable.courseId,
      courseName: coursesTable.name,
      createdAt: pdfsTable.createdAt,
    })
    .from(pdfsTable)
    .leftJoin(coursesTable, eq(pdfsTable.courseId, coursesTable.id))
    .where(courseId ? eq(pdfsTable.courseId, parseInt(courseId)) : undefined)
    .orderBy(desc(pdfsTable.createdAt));

  res.json(pdfs);
});

// POST /pdfs - Add PDF (admin only)
router.post("/pdfs", requireAdmin, async (req, res): Promise<void> => {
  const { title, description, url, source, courseId } = req.body;

  if (!title || !url || !source) {
    res.status(400).json({ error: "Bad Request", message: "Title, url, and source are required" });
    return;
  }

  if (!["upload", "mega", "link"].includes(source)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid source" });
    return;
  }

  const [pdf] = await db
    .insert(pdfsTable)
    .values({
      title,
      description: description || null,
      url,
      source,
      courseId: courseId || null,
    })
    .returning();

  let courseName: string | null = null;
  if (courseId) {
    const [course] = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.id, courseId))
      .limit(1);
    courseName = course?.name || null;
  }

  await notifyNewPdf({ title, source, url, courseName });

  req.log.info({ pdfId: pdf.id }, "PDF added");
  res.status(201).json({ ...pdf, courseName });
});

// DELETE /pdfs/:id - Delete PDF (admin only)
router.delete("/pdfs/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId);
  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid ID" });
    return;
  }

  const deleted = await db.delete(pdfsTable).where(eq(pdfsTable.id, id)).returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Not Found", message: "PDF not found" });
    return;
  }

  req.log.info({ pdfId: id }, "PDF deleted");
  res.json({ message: "تم حذف الملف بنجاح" });
});

export default router;

import { Router } from "express";
import { db } from "@workspace/db";
import { coursesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireApproved } from "../middlewares/auth";

const router = Router();

// GET /courses - List courses (approved users + admin)
router.get("/courses", requireApproved, async (req, res): Promise<void> => {
  const courses = await db
    .select()
    .from(coursesTable)
    .orderBy(desc(coursesTable.createdAt));

  res.json(courses);
});

// POST /courses - Create course (admin only)
router.post("/courses", requireAdmin, async (req, res): Promise<void> => {
  const { name, description, duration, schedule } = req.body;

  if (!name) {
    res.status(400).json({ error: "Bad Request", message: "Course name is required" });
    return;
  }

  const [course] = await db
    .insert(coursesTable)
    .values({
      name,
      description: description || null,
      duration: duration || null,
      schedule: schedule || null,
    })
    .returning();

  req.log.info({ courseId: course.id }, "Course created");
  res.status(201).json(course);
});

// DELETE /courses/:id - Delete course (admin only)
router.delete("/courses/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId);
  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid ID" });
    return;
  }

  const deleted = await db.delete(coursesTable).where(eq(coursesTable.id, id)).returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Not Found", message: "Course not found" });
    return;
  }

  req.log.info({ courseId: id }, "Course deleted");
  res.json({ message: "تم حذف الكورس بنجاح" });
});

export default router;

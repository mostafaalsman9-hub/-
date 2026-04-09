import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { notifyUserApproved } from "../lib/telegram";

const router = Router();

// GET /users - List all users (admin only)
router.get("/users", requireAdmin, async (req, res): Promise<void> => {
  const { status, page = "1", limit = "50" } = req.query as Record<string, string>;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  let query = db.select().from(usersTable).$dynamic();

  if (status && ["pending", "approved", "rejected", "banned"].includes(status)) {
    query = query.where(eq(usersTable.status, status as any));
  }

  const users = await query.limit(limitNum).offset(offset);
  const [{ value: total }] = await db.select({ value: count() }).from(usersTable);

  const sanitized = users.map(({ passwordHash: _, ...u }) => u);

  res.json({ users: sanitized, total, page: pageNum, limit: limitNum });
});

// GET /users/stats - User statistics (admin only)
router.get("/users/stats", requireAdmin, async (req, res): Promise<void> => {
  const allUsers = await db.select().from(usersTable);

  const stats = {
    total: allUsers.length,
    pending: allUsers.filter((u) => u.status === "pending").length,
    approved: allUsers.filter((u) => u.status === "approved").length,
    rejected: allUsers.filter((u) => u.status === "rejected").length,
    banned: allUsers.filter((u) => u.status === "banned").length,
  };

  res.json(stats);
});

// GET /users/:id - Get user by ID (admin only)
router.get("/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId);
  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid ID" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

  if (!user) {
    res.status(404).json({ error: "Not Found", message: "User not found" });
    return;
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// PATCH /users/:id - Update user status (admin only)
router.patch("/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId);
  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid ID" });
    return;
  }

  const { status } = req.body;

  if (!["approved", "rejected", "banned"].includes(status)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid status" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ status })
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "Not Found", message: "User not found" });
    return;
  }

  // Notify Telegram on approval
  if (status === "approved") {
    await notifyUserApproved({ fullName: user.fullName, email: user.email });
  }

  req.log.info({ userId: id, status }, "User status updated");
  const { passwordHash: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// DELETE /users/:id - Delete user (admin only)
router.delete("/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId);
  if (isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "Invalid ID" });
    return;
  }

  const deleted = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();

  if (deleted.length === 0) {
    res.status(404).json({ error: "Not Found", message: "User not found" });
    return;
  }

  req.log.info({ userId: id }, "User deleted");
  res.json({ message: "تم حذف المستخدم بنجاح" });
});

export default router;

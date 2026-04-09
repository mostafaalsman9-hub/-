import { pgTable, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { coursesTable } from "./courses";

export const pdfSourceEnum = pgEnum("pdf_source", ["upload", "mega", "link"]);

export const pdfsTable = pgTable("pdfs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  source: pdfSourceEnum("source").notNull(),
  courseId: integer("course_id").references(() => coursesTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPdfSchema = createInsertSchema(pdfsTable).omit({ id: true, createdAt: true });
export type InsertPdf = z.infer<typeof insertPdfSchema>;
export type Pdf = typeof pdfsTable.$inferSelect;

import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  backgroundUrl: text("background_url"),
  backgroundColor: text("background_color"),
  about: text("about").notNull().default("منصة الدكتور علي سعد التعليمية - متخصصة في دورات السباحة والإنقاذ"),
  phone: text("phone"),
  email: text("email"),
  facebook: text("facebook"),
  telegram: text("telegram"),
  whatsapp: text("whatsapp"),
  instagram: text("instagram"),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;

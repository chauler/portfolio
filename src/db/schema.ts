import {
  customType,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { type Language } from "~/types/language-icons";

export const postsTable = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  title: text("title").unique().notNull(),
  contentPath: text("content").notNull(),
  thumbnailPath: text("thumbnailPath").notNull(),
  briefPath: text("brief").notNull(),
  ghLink: text("ghLink"),
  languages: text("languages", { mode: "json" }).$type<{
    languages: Language[];
  }>(),
});

export const imagesTable = sqliteTable("images", {
  id: integer("id").primaryKey(),
  postID: integer("postID")
    .references(() => postsTable.id)
    .notNull(),
  link: text("link").notNull(),
});

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
export type InsertImage = typeof imagesTable.$inferInsert;
export type SelectImage = typeof imagesTable.$inferSelect;

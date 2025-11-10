import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const greetings = pgTable("greetings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientName: text("recipient_name").notNull(),
  recipientAge: integer("recipient_age").notNull(),
  photos: text("photos").array().notNull(),
});

export const insertGreetingSchema = createInsertSchema(greetings).omit({
  id: true,
});

export type InsertGreeting = z.infer<typeof insertGreetingSchema>;
export type Greeting = typeof greetings.$inferSelect;

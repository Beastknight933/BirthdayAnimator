import { greetings, type Greeting, type InsertGreeting } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createGreeting(greeting: InsertGreeting): Promise<Greeting>;
  getGreeting(id: string): Promise<Greeting | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createGreeting(insertGreeting: InsertGreeting): Promise<Greeting> {
    const [greeting] = await db
      .insert(greetings)
      .values(insertGreeting)
      .returning();
    return greeting;
  }

  async getGreeting(id: string): Promise<Greeting | undefined> {
    const [greeting] = await db.select().from(greetings).where(eq(greetings.id, id));
    return greeting || undefined;
  }
}

export const storage = new DatabaseStorage();

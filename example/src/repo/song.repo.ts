import type { z } from 'zod';
import { db } from '../database/database';
import { schema } from '../database/models';
import { Err, Ok } from '../errors/Result';
import { createInsertSchema } from 'drizzle-zod';

const insertSchema = createInsertSchema(schema.songs);
export type InsertSchema = z.infer<typeof insertSchema>;

export const SongRepo = {
  create: async (data: InsertSchema) => {
    try {
      const [song] = await db.insert(schema.songs).values(data).returning();
      return Ok(song);
    } catch (error) {
      return Err({ message: 'Something went wrong', status: 500 });
    }
  },
  getMany: async () => {
    try {
      const songs = await db.select().from(schema.songs);
      return Ok(songs);
    } catch (error) {
      return Err({ message: 'Something went wrong', status: 500 });
    }
  },
};

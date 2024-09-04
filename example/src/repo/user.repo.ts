import { eq } from 'drizzle-orm';
import { db } from '../database/database';
import { schema } from '../database/models';
import { Err, Ok } from '../errors/Result';

export const UserRepo = {
  async findOneById(id: string) {
    try {
      const user = await db.query.users.findFirst({
        where(fields, operators) {
          return operators.eq(fields.id, id);
        },
      });

      if (!user) return Err({ message: 'User not found', status: 404 });

      return Ok(user);
    } catch (error) {
      return Err({ message: 'Something went wrong', status: 500 });
    }
  },

  async findOneByEmail(email: string) {
    try {
      const user = await db.query.users.findFirst({
        where(fields, operators) {
          return operators.eq(fields.email, email);
        },
      });

      if (!user) return Ok(null);

      return Ok(user);
    } catch (error) {
      return Err({ message: 'Something went wrong', status: 500 });
    }
  },

  async createOne(data: { name: string; email: string; password: string }) {
    try {
      const [user] = await db.insert(schema.users).values(data).returning();
      return Ok(user);
    } catch (error) {
      return Err({ message: 'Something went wrong', status: 500 });
    }
  },

  async updateOneById(id: string, data: { name: string; email: string }) {
    try {
      const [updatedUser] = await db
        .update(schema.users)
        .set(data)
        .where(eq(schema.users.id, id))
        .returning({ name: schema.users.name, email: schema.users.email });
      return Ok(updatedUser);
    } catch (error) {
      return Err({ message: 'Something went wrong', status: 500 });
    }
  },
};

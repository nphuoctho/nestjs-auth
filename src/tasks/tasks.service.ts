import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { type Database, DATABASE } from '../db/index.js';
import { Task, tasks } from '../db/schema.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import type { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async findAllForUser(userId: string): Promise<Task[] | []> {
    return this.db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
    });
  }

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const [task] = await this.db
      .insert(tasks)
      .values({ ...dto, userId })
      .returning();

    return task;
  }

  async update(id: string, userId: string, data: UpdateTaskDto): Promise<Task> {
    const [task] = await this.db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  async delete(id: string, userId: string) {
    const [task] = await this.db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning({ id: tasks.id });

    if (!task) throw new NotFoundException('Task not found');

    return { message: 'Task delete successfully!' };
  }
}

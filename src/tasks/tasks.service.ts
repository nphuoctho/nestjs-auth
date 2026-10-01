import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, tasks } from '../db/schema.js';
import { DATABASE, type Database } from '../db/index.js';
import { and, eq } from 'drizzle-orm';
import { CreateTaskDto } from './dto/create-task.dto.js';

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

  async update(id: string, userId: string, data: Partial<CreateTaskDto>) {
    const task = await this.db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) throw new NotFoundException('Task not found');

    if (task.userId !== userId)
      throw new ForbiddenException('You do not own this task');

    const updated = await this.db
      .update(tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

    return updated;
  }

  async delete(id: string, userId: string) {
    const task = await this.db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) throw new NotFoundException('Task not found');

    if (task.userId !== userId)
      throw new ForbiddenException('You do not own this task');

    await this.db.delete(tasks).where(eq(tasks.id, id));

    return { message: 'Task delete successfully!' };
  }
}

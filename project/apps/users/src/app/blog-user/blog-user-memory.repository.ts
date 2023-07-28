import { CRUDRepository } from '@project/util/util-types';
import { User } from '@project/shared/app-types';
import { BlogUserEntity } from './blog-user.entity';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogUserMemoryRepository implements CRUDRepository<BlogUserEntity, string, User> {
  private repository: Record<string, User> = {};

  public async create(item: BlogUserEntity): Promise<User> {
    const entry = { ...item.toObject(), id: randomUUID() };
    this.repository[entry.id] = entry;

    return entry;
  }

  public async findById(id: string): Promise<User> {
    if (this.repository[id]) {
      return { ...this.repository[id] };
    }

    return null;
  }

  public findByEmail(email: string): User | null {
    const existUser = Object.values(this.repository)
      .find(userItem => userItem.email === email);

    if (!existUser) {
      return null;
    }

    return { ...existUser };
  }

  public async destroy(id: string): Promise<void> {
    delete this.repository[id];
  }

  public async update(id: string, item: BlogUserEntity): Promise<User> {
    this.repository[id] = { ...item.toObject(), id };
    return this.findById(id);
  }
}

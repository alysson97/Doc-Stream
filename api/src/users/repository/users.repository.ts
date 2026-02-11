import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
export abstract class UserRepository {
  abstract create(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: string): Promise<void>;
}

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }
  async update(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index === -1) throw new Error('User not found');
    this.users[index] = user;
    return user;
  }
  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}

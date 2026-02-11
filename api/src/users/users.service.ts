import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './repository/users.repository';
import { User } from './entities/user.entity';
import { ulid } from 'ulid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
  async create(username: string, email: string, password: string): Promise<User> {
    const isUserExists = await this.userRepository.findByEmail(email);
    if (isUserExists) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = User.create({
      id: ulid(),
      username,
      email,
      password: passwordHash,
    });
    return this.userRepository.create(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, body: Partial<User>) {
    if (!body) throw new ConflictException('No data provided for update');
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

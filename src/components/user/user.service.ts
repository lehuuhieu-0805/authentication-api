import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    await this.repo.insert(user);

    return user;
  }

  async findOne(email: string): Promise<User> {
    return await this.repo.findOne({ where: { email } });
  }

  async update(user: User): Promise<User> {
    await this.repo.save(user);

    return user;
  }
}

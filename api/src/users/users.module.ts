import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UserRepository } from './repository/users.repository';
import { UsersController } from './users.controller';
import { InMemoryUserRepository, UserRepository } from './repository/users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository, // O "ID" (abstract class)
      useClass: InMemoryUserRepository, // A implementação
    },
  ],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UserRepository } from './repository/users.repository';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useValue:
        null /*useClass:  /* inserir aqui classe de infra que se conecta com banco, como alguma classe do Prisma ou TypeORM */,
    },
  ],
  exports: ['UserRepository'],
})
export class UsersModule {}

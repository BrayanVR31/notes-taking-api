import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './auth/guards/jwt-refresh-auth.guard';

@Module({
  imports: [TagsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: JwtRefreshAuthGuard }, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }, AppService, PrismaService],
})
export class AppModule { }

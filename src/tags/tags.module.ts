import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TagsController],
  providers: [PrismaService, TagsService],
})
export class TagsModule {}

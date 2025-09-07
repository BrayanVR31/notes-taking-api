import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpCode,
  Query,
  Req,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { parseSortQueryList } from 'src/libs/sorting-query';
import { getFullURL } from 'src/libs/url';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  @HttpCode(200)
  async findAll(
    @Req() req: Request,
    @Query('orderby') queryOrder: string,
    @Query('maxpagesize') take: number = 25,
    @Query('skip') skip: number = 0,
  ) {
    const orderBy = parseSortQueryList(queryOrder);
    const tags = await this.tagsService.findAll({
      orderBy,
      take: +take,
      skip: +skip,
    });
    const nextLink = getFullURL(req);
    return {
      value: tags,
      nextLink,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}

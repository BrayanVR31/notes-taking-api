import { Body, Controller, Get, HttpCode, Post, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { parseSortQueryList } from 'src/libs/sorting-query';
import { getFullURL } from 'src/libs/url';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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
    const users = await this.userService.findAll({
      orderBy,
      take: +take,
      skip: +skip,
    });
    const nextLink = getFullURL(req);
    return {
      value: users,
      nextLink,
    };
  }


}

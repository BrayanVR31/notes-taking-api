import { Body, Controller, Param, Get, HttpCode, ParseIntPipe, Patch, Post, Query, Req, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { parseSortQueryList } from '@/libs/sorting-query';
import { getFullURL } from '@/libs/url';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipAuth } from '@/constants/jwt.constant';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

// TODO: implement authGuard in necessary endpoints
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @SkipAuth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(":id")
  updateOne(@Param("id", ParseIntPipe) userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findOne({ id: userId });
  }
}

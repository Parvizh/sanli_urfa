import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from './user.service';
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { IsAdminGuard } from "../auth/guards/is-admin.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { User } from "./entities/user.entity";
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/')
  @UseGuards(IsAdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto, 1);
  }

  @Get('/')
  @UseGuards(IsAdminGuard)
  get(@Query() query) {
    return this.userService.get(query.role);
  }

  @Get('current-user')
  getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Get('/:id')
  @UseGuards(IsAdminGuard)
  getById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userService.getById(id);
  }

  @Patch('current-user')
  updateCurrentUser(@GetUser('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @Patch('/:id')
  @UseGuards(IsAdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @UseGuards(IsAdminGuard)
  delete(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userService.delete(id, user.id);
  }

  @Patch('upload/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() avatar: Express.Multer.File, @GetUser() user: User) {
    return this.userService.uploadAvatar(avatar.filename, user.id, user.imageUrl);
  }

  @Delete('delete/avatar')
  deleteAvatar(@GetUser() user: User) {
    return this.userService.deletAvatar(user.id, user.imageUrl);
  }
}
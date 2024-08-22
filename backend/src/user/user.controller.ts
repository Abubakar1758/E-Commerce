import { Controller, Post, Body, UploadedFile, UseInterceptors, ConflictException, UnauthorizedException, Get, Param,ParseIntPipe  } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('displayPicture'))
  async signUp(
    @Body() body: any,
    @UploadedFile() displayPicture: Express.Multer.File,
  ) {
    let fileBuffer: Buffer | null = null;
    let originalFileName: string | null = null;

    if (displayPicture) {
      fileBuffer = displayPicture.buffer;
      originalFileName = displayPicture.originalname; // Use the original filename
    }

    try {
      const user = await this.userService.createUser(body, fileBuffer, originalFileName);
      return user;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    const { email, password } = body;

    try {
      const result = await this.userService.loginUser(email, password);
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  // New route to get user details by userId
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.getUserById(id);
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}

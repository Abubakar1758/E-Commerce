import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SupabaseService } from '../supabase/supabase.service';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createUser(
    data: any,
    fileBuffer: Buffer | null,
    originalFileName: string | null,
  ) {
    const { firstName, lastName, email, password, role, ...userData } = data;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let pictureUrl: string | null = null;

    if (fileBuffer && originalFileName) {
      const uniqueFileName = `${uuidv4()}${path.extname(originalFileName)}`;
      const bucket = process.env.SUPABASE_USER_BUCKET;

      try {
        await this.supabaseService.uploadImage(
          { buffer: fileBuffer, originalname: originalFileName },
          uniqueFileName,
          bucket,
        );
        pictureUrl = await this.supabaseService.getImageUrl(uniqueFileName, bucket);
      } catch (error) {
        throw new InternalServerErrorException('Failed to upload display picture.');
      }
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
          role,
          displayPicture: pictureUrl,
        },
      });

      return {
        message: 'Sign-up successful!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          displayPicture: user.displayPicture,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating the user.');
    }
  }

  async loginUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return {
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        displayPicture: user.displayPicture,
      },
    };
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        displayPicture: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}

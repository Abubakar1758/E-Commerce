import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { SupabaseModule } from '../supabase/supabase.module'; // Import SupabaseModule

@Module({
  imports: [PrismaModule, SupabaseModule], // Import SupabaseModule here
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

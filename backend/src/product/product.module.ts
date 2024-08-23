import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupabaseModule } from 'src/supabase/supabase.module'; // Import SupabaseModule
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [PrismaModule, SupabaseModule], // Include SupabaseModule here
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

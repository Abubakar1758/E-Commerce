import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CouponModule } from './coupon/coupon.module';
import { StripeModule } from './stripe/stripe.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PrismaModule,
    ProductModule,
    CouponModule,
    StripeModule,
    SupabaseModule,
  ],
})
export class AppModule { }

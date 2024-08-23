// src/stripe/stripe.module.ts
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService], // Exporting StripeService if needed elsewhere
})
export class StripeModule {}

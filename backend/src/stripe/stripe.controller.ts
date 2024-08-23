// src/stripe/stripe.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('create-payment-intent')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async createPaymentIntent(@Body() body: { amount: number }) {
    const { amount } = body;
    const paymentIntent = await this.stripeService.createPaymentIntent(amount);
    return { clientSecret: paymentIntent.client_secret };
  }
}

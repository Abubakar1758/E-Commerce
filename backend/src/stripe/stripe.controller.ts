import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('payment')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body('amount') amount: number) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(amount);
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      throw new HttpException('Failed to create payment intent', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

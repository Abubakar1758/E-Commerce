import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('sk_test_51Pqx2N05ECef6IIAEt1RjLTru7UYt8ycVoykQepOshcGNubwidWBIOdCxoNAeFh90KsmH8SQEINQdTOoi5KbyOhP00FJKiHmfX', {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
  }
}

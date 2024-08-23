import { StripeService } from './stripe.service';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createPaymentIntent(body: {
        amount: number;
    }): Promise<{
        clientSecret: string;
    }>;
}

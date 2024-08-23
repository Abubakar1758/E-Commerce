import Stripe from 'stripe';
export declare class StripeService {
    private stripe;
    constructor();
    createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent>;
}

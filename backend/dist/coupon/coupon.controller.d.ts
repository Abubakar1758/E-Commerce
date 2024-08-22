import { CouponService } from './coupon.service';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    validateCoupon(code: string): Promise<{
        discountPercentage: number;
    }>;
}

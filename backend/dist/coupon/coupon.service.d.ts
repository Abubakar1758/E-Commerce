import { PrismaService } from '../prisma/prisma.service';
export declare class CouponService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validateCoupon(code: string): Promise<{
        discountPercentage: number;
    }>;
}

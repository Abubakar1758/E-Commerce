import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async validateCoupon(code: string): Promise<{ discountPercentage: number }> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found.');
    }

    return { discountPercentage: coupon.discountPercentage };
  }
}

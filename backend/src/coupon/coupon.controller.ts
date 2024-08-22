import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CouponService } from './coupon.service';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get('validate')
  async validateCoupon(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('Coupon code is required.');
    }
    const { discountPercentage } = await this.couponService.validateCoupon(code);
    return { discountPercentage };
  }
}

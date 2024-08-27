// src/order/order.controller.ts
import { Body, Controller, Post, Get, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body() body: {
      userId: number;
      totalAmount: number;
      coupon: string | null;
      items: {
        productId: number;
        name: string;
        quantity: number;
        price: number;
      }[];
    },
  ) {
    try {
      const { userId, totalAmount, coupon, items } = body;
      const order = await this.orderService.createOrder(userId, totalAmount, coupon, items);
      return { order };
    } catch (error) {
      throw new InternalServerErrorException('Error creating order');
    }
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) { // Changed to string
    try {
      const orders = await this.orderService.getOrdersByUser(Number(userId)); // Convert to number
      if (!orders) {
        throw new NotFoundException('Orders not found');
      }
      return { orders };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new InternalServerErrorException('Error fetching orders');
    }
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) { // Changed to string
    try {
      const order = await this.orderService.getOrderById(Number(orderId)); // Convert to number
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return { order };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new InternalServerErrorException('Error fetching order');
    }
  }
}

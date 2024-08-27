// src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(
    userId: number,
    totalAmount: number,
    coupon: string | null,
    cart: any[],
  ) {
    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error('Cart items are required and should be an array.');
    }

    try {
      const order = await this.prisma.order.create({
        data: {
          userId,
          totalAmount,
          coupon,
          orderItems: {
            create: cart.map((item) => ({
              itemName: item.name,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Error creating order');
    }
  }

  async getOrdersByUser(userId: number) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        include: { orderItems: true },
      });
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Error fetching orders');
    }
  }

  async getOrderById(orderId: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });
      return order;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Error fetching order');
    }
  }
}

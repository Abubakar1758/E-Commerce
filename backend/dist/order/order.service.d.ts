import { PrismaService } from 'src/prisma/prisma.service';
export declare class OrderService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrder(userId: number, totalAmount: number, coupon: string | null, cart: any[]): Promise<{
        orderItems: {
            id: number;
            itemName: string;
            productId: number;
            quantity: number;
            price: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number;
        totalAmount: number;
        coupon: string | null;
        createdAt: Date;
    }>;
    getOrdersByUser(userId: number): Promise<({
        orderItems: {
            id: number;
            itemName: string;
            productId: number;
            quantity: number;
            price: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number;
        totalAmount: number;
        coupon: string | null;
        createdAt: Date;
    })[]>;
    getOrderById(orderId: number): Promise<{
        orderItems: {
            id: number;
            itemName: string;
            productId: number;
            quantity: number;
            price: number;
            orderId: number;
        }[];
    } & {
        id: number;
        userId: number;
        totalAmount: number;
        coupon: string | null;
        createdAt: Date;
    }>;
}

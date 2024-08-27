import { OrderService } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(body: {
        userId: number;
        totalAmount: number;
        coupon: string | null;
        items: {
            productId: number;
            name: string;
            quantity: number;
            price: number;
        }[];
    }): Promise<{
        order: {
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
        };
    }>;
    getOrdersByUser(userId: string): Promise<{
        orders: ({
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
        })[];
    }>;
    getOrderById(orderId: string): Promise<{
        order: {
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
        };
    }>;
}

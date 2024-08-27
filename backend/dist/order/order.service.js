"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrderService = class OrderService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrder(userId, totalAmount, coupon, cart) {
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
        }
        catch (error) {
            console.error('Error creating order:', error);
            throw new Error('Error creating order');
        }
    }
    async getOrdersByUser(userId) {
        try {
            const orders = await this.prisma.order.findMany({
                where: { userId },
                include: { orderItems: true },
            });
            return orders;
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Error fetching orders');
        }
    }
    async getOrderById(orderId) {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id: orderId },
                include: { orderItems: true },
            });
            return order;
        }
        catch (error) {
            console.error('Error fetching order:', error);
            throw new Error('Error fetching order');
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrderService);
//# sourceMappingURL=order.service.js.map
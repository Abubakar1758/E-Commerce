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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(body) {
        try {
            const { userId, totalAmount, coupon, items } = body;
            const order = await this.orderService.createOrder(userId, totalAmount, coupon, items);
            return { order };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error creating order');
        }
    }
    async getOrdersByUser(userId) {
        try {
            const orders = await this.orderService.getOrdersByUser(Number(userId));
            if (!orders) {
                throw new common_1.NotFoundException('Orders not found');
            }
            return { orders };
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            throw new common_1.InternalServerErrorException('Error fetching orders');
        }
    }
    async getOrderById(orderId) {
        try {
            const order = await this.orderService.getOrderById(Number(orderId));
            if (!order) {
                throw new common_1.NotFoundException('Order not found');
            }
            return { order };
        }
        catch (error) {
            console.error('Error fetching order:', error);
            throw new common_1.InternalServerErrorException('Error fetching order');
        }
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrdersByUser", null);
__decorate([
    (0, common_1.Get)(':orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map
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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const promises_1 = require("fs/promises");
const path_1 = require("path");
let ProductService = class ProductService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProduct(createProductDto, imagePaths) {
        const { name, description, price, serialNumber, userId } = createProductDto;
        try {
            return await this.prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price.toString()),
                    serialNumber,
                    userId: parseInt(userId.toString()),
                    images: {
                        create: imagePaths.map((path) => ({ url: path })),
                    },
                },
                include: {
                    images: true,
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create product. Please try again.');
        }
    }
    async getAllProducts() {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        });
    }
    async getLatestProducts(limit) {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { images: true },
        });
    }
    async getProductById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { images: true, comments: true }
        });
    }
    async addComment(productId, userId, content) {
        try {
            return await this.prisma.comment.create({
                data: {
                    content,
                    productId,
                    userId,
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to add comment. Please try again.');
        }
    }
    async updateComment(commentId, content) {
        try {
            return await this.prisma.comment.update({
                where: { id: commentId },
                data: { content },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update comment. Please try again.');
        }
    }
    async deleteComment(commentId) {
        try {
            await this.prisma.comment.delete({
                where: { id: commentId },
            });
            return { message: 'Comment deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete comment. Please try again.');
        }
    }
    async getCommentCountByProductId(productId) {
        return this.prisma.comment.count({
            where: { productId },
        });
    }
    async getProductsByUserId(userId) {
        return this.prisma.product.findMany({
            where: { userId },
            include: { images: true, comments: true },
        });
    }
    async updateProduct(id, updateProductDto, imagePaths) {
        const { name, description, price } = updateProductDto;
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        try {
            if (imagePaths.length > 0) {
                const oldImagePaths = existingProduct.images.map((image) => image.url);
                await Promise.all(oldImagePaths.map(async (path) => {
                    try {
                        await (0, promises_1.unlink)((0, path_1.join)(__dirname, '..', '..', path));
                    }
                    catch (error) {
                        console.error(`Failed to delete image ${path}`, error);
                    }
                }));
                await this.prisma.image.deleteMany({
                    where: { productId: id },
                });
            }
            return await this.prisma.product.update({
                where: { id },
                data: {
                    name,
                    description,
                    price: parseFloat(price.toString()),
                    images: {
                        create: imagePaths.map((path) => ({ url: path })),
                    },
                },
                include: { images: true },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update product. Please try again.');
        }
    }
    async deleteProduct(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { images: true, comments: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        try {
            await Promise.all(product.images.map(async (image) => {
                try {
                    await (0, promises_1.unlink)((0, path_1.join)(__dirname, '..', '..', image.url));
                }
                catch (error) {
                    console.error(`Failed to delete image ${image.url}`, error);
                }
            }));
            await this.prisma.comment.deleteMany({
                where: { productId },
            });
            await this.prisma.image.deleteMany({
                where: { productId },
            });
            await this.prisma.product.delete({
                where: { id: productId },
            });
            return { message: 'Product deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete product. Please try again.');
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map
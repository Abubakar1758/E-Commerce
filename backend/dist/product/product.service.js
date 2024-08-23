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
const supabase_service_1 = require("../supabase/supabase.service");
let ProductService = class ProductService {
    constructor(prisma, supabaseService) {
        this.prisma = prisma;
        this.supabaseService = supabaseService;
    }
    async createProduct(createProductDto, imageFiles) {
        const { name, description, price, serialNumber, userId } = createProductDto;
        try {
            const imagePaths = await Promise.all(imageFiles.map(async (file) => {
                const path = file.originalname;
                await this.supabaseService.uploadImage(file, path, 'product-images');
                const imageUrl = await this.supabaseService.getImageUrl(path, 'product-images');
                return { url: imageUrl };
            }));
            return await this.prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price.toString()),
                    serialNumber,
                    userId: parseInt(userId.toString()),
                    images: {
                        create: imagePaths,
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
        if (isNaN(limit) || limit <= 0) {
            throw new common_1.BadRequestException('Invalid limit value.');
        }
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
    async updateProduct(id, updateProductDto, imageFiles) {
        const { name, description, price } = updateProductDto;
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        try {
            const newImagePaths = imageFiles.length > 0
                ? await Promise.all(imageFiles.map(async (file) => {
                    const path = file.originalname;
                    await this.supabaseService.uploadImage(file, path, 'product-images');
                    const imageUrl = await this.supabaseService.getImageUrl(path, 'product-images');
                    return { url: imageUrl };
                }))
                : [];
            if (existingProduct.images.length > 0) {
                await Promise.all(existingProduct.images.map(async (image) => {
                    try {
                        const imagePath = image.url.split('/').pop();
                        if (imagePath) {
                            await this.supabaseService.deleteImage(imagePath, 'product-images');
                        }
                    }
                    catch (error) {
                        console.error(`Failed to delete image ${image.url}`, error);
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
                        create: newImagePaths,
                    },
                },
                include: { images: true },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update product. Please try again.');
        }
    }
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true, comments: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        try {
            await Promise.all(product.images.map(async (image) => {
                const imagePath = image.url.split('/').pop();
                if (imagePath) {
                    await this.supabaseService.deleteImage(imagePath, 'product-images');
                }
            }));
            await this.prisma.comment.deleteMany({
                where: { productId: id },
            });
            await this.prisma.image.deleteMany({
                where: { productId: id },
            });
            await this.prisma.product.delete({
                where: { id },
            });
            return { message: 'Product and all associated data deleted successfully' };
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to delete product. Please try again.');
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], ProductService);
//# sourceMappingURL=product.service.js.map
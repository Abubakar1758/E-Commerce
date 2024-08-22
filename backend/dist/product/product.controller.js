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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const promises_1 = require("fs/promises");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async createProduct(createProductDto, files) {
        const imagePaths = files.images ? files.images.map(file => file.path) : [];
        try {
            const product = await this.productService.createProduct(createProductDto, imagePaths);
            return { success: true, message: 'Product created successfully!', product };
        }
        catch (error) {
            if (files.images) {
                await Promise.all(files.images.map(file => (0, promises_1.unlink)((0, path_1.join)(__dirname, '..', '..', file.path))));
            }
            throw new common_1.BadRequestException('An error occurred while creating the product.');
        }
    }
    async getAllProducts() {
        return this.productService.getAllProducts();
    }
    async getLatestProducts(limit) {
        const limitNumber = parseInt(limit, 10) || 10;
        return this.productService.getLatestProducts(limitNumber);
    }
    async getProductById(id) {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new common_1.BadRequestException('Invalid product ID.');
        }
        const product = await this.productService.getProductById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found.');
        }
        return product;
    }
    async addComment(id, createCommentDto) {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new common_1.BadRequestException('Invalid product ID.');
        }
        const { userId, content } = createCommentDto;
        if (isNaN(userId)) {
            throw new common_1.BadRequestException('Invalid user ID.');
        }
        return this.productService.addComment(productId, userId, content);
    }
    async updateComment(productId, commentId, content) {
        const productIdNum = parseInt(productId, 10);
        const commentIdNum = parseInt(commentId, 10);
        if (isNaN(productIdNum) || isNaN(commentIdNum)) {
            throw new common_1.BadRequestException('Invalid product or comment ID.');
        }
        return this.productService.updateComment(commentIdNum, content);
    }
    async deleteComment(productId, commentId) {
        const productIdNum = parseInt(productId, 10);
        const commentIdNum = parseInt(commentId, 10);
        if (isNaN(productIdNum) || isNaN(commentIdNum)) {
            throw new common_1.BadRequestException('Invalid product or comment ID.');
        }
        return this.productService.deleteComment(commentIdNum);
    }
    async getCommentCount(id) {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new common_1.BadRequestException('Invalid product ID.');
        }
        const count = await this.productService.getCommentCountByProductId(productId);
        return { count };
    }
    async getProductsByUserId(userId) {
        const userIdNum = parseInt(userId, 10);
        if (isNaN(userIdNum)) {
            throw new common_1.BadRequestException('Invalid user ID.');
        }
        const products = await this.productService.getProductsByUserId(userIdNum);
        if (!products || products.length === 0) {
            throw new common_1.NotFoundException('No products found for this user.');
        }
        return products;
    }
    async updateProduct(id, updateProductDto, files) {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new common_1.BadRequestException('Invalid product ID.');
        }
        const imagePaths = files.images ? files.images.map((file) => file.path) : [];
        try {
            const product = await this.productService.updateProduct(productId, updateProductDto, imagePaths);
            return { success: true, message: 'Product updated successfully!', product };
        }
        catch (error) {
            console.error('Error updating product in controller:', error);
            if (files.images) {
                await Promise.all(files.images.map((file) => (0, promises_1.unlink)((0, path_1.join)(__dirname, '..', '..', file.path))));
            }
            throw new common_1.BadRequestException('An error occurred while updating the product.');
        }
    }
    async deleteProduct(productId) {
        const productIdNum = parseInt(productId, 10);
        if (isNaN(productIdNum)) {
            throw new common_1.BadRequestException('Invalid product');
        }
        return this.productService.deleteProduct(productIdNum);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'images', maxCount: 5 }], {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('get-all-products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('latest'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getLatestProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Post)(':id/comment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addComment", null);
__decorate([
    (0, common_1.Put)(':productId/comment/:commentId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateComment", null);
__decorate([
    (0, common_1.Delete)(':productId/comment/:commentId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)(':id/comments/count'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getCommentCount", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsByUserId", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'images', maxCount: 5 }], {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/products',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { unlink } from 'fs/promises'; // For deleting files
import { join } from 'path';


@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(createProductDto: CreateProductDto, imagePaths: string[]) {
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
        } catch (error) {
            throw new BadRequestException('Failed to create product. Please try again.');
        }
    }

    async getAllProducts() {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        });
    }
    
    async getLatestProducts(limit: number) {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { images: true },
        });
    }

    async getProductById(id: number) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { images: true, comments: true }
        });
    }

    async addComment(productId: number, userId: number, content: string) {
        try {
            return await this.prisma.comment.create({
                data: {
                    content,
                    productId,
                    userId,
                },
            });
        } catch (error) {
            throw new BadRequestException('Failed to add comment. Please try again.');
        }
    }

    async updateComment(commentId: number, content: string) {
        try {
            return await this.prisma.comment.update({
                where: { id: commentId },
                data: { content },
            });
        } catch (error) {
            throw new BadRequestException('Failed to update comment. Please try again.');
        }
    }

    async deleteComment(commentId: number) {
        try {
            await this.prisma.comment.delete({
                where: { id: commentId },
            });
            return { message: 'Comment deleted successfully' };
        } catch (error) {
            throw new BadRequestException('Failed to delete comment. Please try again.');
        }
    }

    async getCommentCountByProductId(productId: number): Promise<number> {
        return this.prisma.comment.count({
            where: { productId },
        });
    }

    async getProductsByUserId(userId: number) {
        return this.prisma.product.findMany({
            where: { userId },
            include: { images: true, comments: true },
        });
    }


    async updateProduct(
        id: number,
        updateProductDto: CreateProductDto,
        imagePaths: string[],
    ) {
        const { name, description, price } = updateProductDto;

        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        try {
            // Delete old images if new images are provided
            if (imagePaths.length > 0) {
                const oldImagePaths = existingProduct.images.map((image) => image.url);

                // Delete images from the file system (optional, if you store images locally)
                await Promise.all(
                    oldImagePaths.map(async (path) => {
                        try {
                            await unlink(join(__dirname, '..', '..', path));
                        } catch (error) {
                            console.error(`Failed to delete image ${path}`, error);
                        }
                    }),
                );


                await this.prisma.image.deleteMany({
                    where: { productId: id },
                });
            }

            // Update the product
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
        } catch (error) {
            throw new BadRequestException('Failed to update product. Please try again.');
        }
    }



    async deleteProduct(productId: number) {
        // Find the product with associated images and comments
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { images: true, comments: true },
        });
    
        if (!product) {
            throw new NotFoundException('Product not found');
        }
    
        try {
            // Delete images from the file system
            await Promise.all(
                product.images.map(async (image) => {
                    try {
                        await unlink(join(__dirname, '..', '..', image.url));
                    } catch (error) {
                        console.error(`Failed to delete image ${image.url}`, error);
                    }
                })
            );
    
            // Delete associated comments
            await this.prisma.comment.deleteMany({
                where: { productId },
            });
    
            // Delete associated images
            await this.prisma.image.deleteMany({
                where: { productId },
            });
    
            // Finally, delete the product itself
            await this.prisma.product.delete({
                where: { id: productId },
            });
    
            return { message: 'Product deleted successfully' };
        } catch (error) {
            throw new BadRequestException('Failed to delete product. Please try again.');
        }
    }
    

}

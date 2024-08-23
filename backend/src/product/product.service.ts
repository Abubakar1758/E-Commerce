import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async createProduct(createProductDto: CreateProductDto, imageFiles: Express.Multer.File[]) {
    const { name, description, price, serialNumber, userId } = createProductDto;

    try {
      const imagePaths = await Promise.all(imageFiles.map(async (file) => {
        // Use filename as the path to store images directly in the bucket
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
    if (isNaN(limit) || limit <= 0) {
      throw new BadRequestException('Invalid limit value.');
    }

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
    imageFiles: Express.Multer.File[],
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
      // Upload new images
      const newImagePaths = imageFiles.length > 0
        ? await Promise.all(imageFiles.map(async (file) => {
          const path = file.originalname; // Use filename as the path to store images directly in the bucket
          await this.supabaseService.uploadImage(file, path, 'product-images');
          const imageUrl = await this.supabaseService.getImageUrl(path, 'product-images');
          return { url: imageUrl };
        }))
        : [];

      // Delete old images
      if (existingProduct.images.length > 0) {
        await Promise.all(
          existingProduct.images.map(async (image) => {
            try {
              const imagePath = image.url.split('/').pop();
              if (imagePath) {
                await this.supabaseService.deleteImage(imagePath, 'product-images');
              }
            } catch (error) {
              console.error(`Failed to delete image ${image.url}`, error);
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
            create: newImagePaths,
          },
        },
        include: { images: true },
      });
    } catch (error) {
      throw new BadRequestException('Failed to update product. Please try again.');
    }
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, comments: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      // Delete product images from Supabase
      await Promise.all(
        product.images.map(async (image) => {
          const imagePath = image.url.split('/').pop();
          if (imagePath) {
            await this.supabaseService.deleteImage(imagePath, 'product-images');
          }
        }),
      );

      // Delete comments associated with the product
      await this.prisma.comment.deleteMany({
        where: { productId: id },
      });

      // Delete product images from the database
      await this.prisma.image.deleteMany({
        where: { productId: id },
      });

      // Finally, delete the product
      await this.prisma.product.delete({
        where: { id },
      });

      return { message: 'Product and all associated data deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete product. Please try again.');
    }
  }
}

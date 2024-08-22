import { Controller, Post, Body, UploadedFiles, UseInterceptors, BadRequestException, Get, Query, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { unlink } from 'fs/promises';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const imagePaths = files.images ? files.images.map(file => file.path) : [];

    try {
      const product = await this.productService.createProduct(createProductDto, imagePaths);
      return { success: true, message: 'Product created successfully!', product };
    } catch (error) {
      // If there's an error, remove the uploaded images
      if (files.images) {
        await Promise.all(
          files.images.map(file => unlink(join(__dirname, '..', '..', file.path)))
        );
      }
      throw new BadRequestException('An error occurred while creating the product.');
    }
  }

  @Get('get-all-products')
  async getAllProducts() {
    return this.productService.getAllProducts();
  }


  @Get('latest')
  async getLatestProducts(@Query('limit') limit: string) {
    const limitNumber = parseInt(limit, 10) || 10;
    return this.productService.getLatestProducts(limitNumber);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID.');
    }

    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  @Post(':id/comment')
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID.');
    }

    const { userId, content } = createCommentDto;
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID.');
    }

    return this.productService.addComment(productId, userId, content);
  }

  @Put(':productId/comment/:commentId')
  async updateComment(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    const productIdNum = parseInt(productId, 10);
    const commentIdNum = parseInt(commentId, 10);
    if (isNaN(productIdNum) || isNaN(commentIdNum)) {
      throw new BadRequestException('Invalid product or comment ID.');
    }

    return this.productService.updateComment(commentIdNum, content);
  }

  @Delete(':productId/comment/:commentId')
  async deleteComment(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
  ) {
    const productIdNum = parseInt(productId, 10);
    const commentIdNum = parseInt(commentId, 10);
    if (isNaN(productIdNum) || isNaN(commentIdNum)) {
      throw new BadRequestException('Invalid product or comment ID.');
    }

    return this.productService.deleteComment(commentIdNum);
  }

  @Get(':id/comments/count')
  async getCommentCount(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID.');
    }

    const count = await this.productService.getCommentCountByProductId(productId);
    return { count };
  }

  @Get('user/:userId')
  async getProductsByUserId(@Param('userId') userId: string) {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      throw new BadRequestException('Invalid user ID.');
    }

    const products = await this.productService.getProductsByUserId(userIdNum);
    if (!products || products.length === 0) {
      throw new NotFoundException('No products found for this user.');
    }

    return products;
  }


  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID.');
    }

    const imagePaths = files.images ? files.images.map((file) => file.path) : [];

    try {
      const product = await this.productService.updateProduct(productId, updateProductDto, imagePaths);
      return { success: true, message: 'Product updated successfully!', product };
    } catch (error) {
      console.error('Error updating product in controller:', error); // Log the error
      if (files.images) {
        await Promise.all(
          files.images.map((file) => unlink(join(__dirname, '..', '..', file.path))),
        );
      }
      throw new BadRequestException('An error occurred while updating the product.');
    }
  }


  @Delete(':id')
  async deleteProduct(
    @Param('id') productId: string,
  ) {
    const productIdNum = parseInt(productId, 10);
  
    if (isNaN(productIdNum)) {
      throw new BadRequestException('Invalid product');
    }

    return this.productService.deleteProduct(productIdNum);
  }

}

import { Controller, Post, Body, UploadedFiles, UseInterceptors, BadRequestException, Get, Query, Param, NotFoundException, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('create')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const imageFiles = files.images || [];
    return this.productService.createProduct(createProductDto, imageFiles);
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get('latest')
  async getLatestProducts(@Query('limit') limit: string) {
    const limitNumber = parseInt(limit, 10);
    if (isNaN(limitNumber) || limitNumber <= 0) {
      throw new BadRequestException('Invalid limit value.');
    }
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

  @Get('user/:userId')
  async getProductsByUser(@Param('userId') userId: string) {
    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      throw new BadRequestException('Invalid user ID.');
    }

    return this.productService.getProductsByUserId(userIdNumber);
  }

  @Get(':id/comments/count')
  async getCommentCountByProductId(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID.');
    }

    const count = await this.productService.getCommentCountByProductId(productId);
    return { count };
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

    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    return this.productService.addComment(
      productId,
      createCommentDto.userId,
      createCommentDto.content,
    );
  }

  @Put(':id/comment/:commentId')
  async updateComment(
    @Param('id') productId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: { content: string },
  ) {
    const commentIdNumber = parseInt(commentId, 10);

    if (isNaN(commentIdNumber)) {
      throw new BadRequestException('Invalid comment ID.');
    }

    return this.productService.updateComment(commentIdNumber, updateCommentDto.content);
  }

  @Delete(':id/comment/:commentId')
  async deleteComment(
    @Param('id') productId: string,
    @Param('commentId') commentId: string,
  ) {
    const commentIdNumber = parseInt(commentId, 10);

    if (isNaN(commentIdNumber)) {
      throw new BadRequestException('Invalid comment ID.');
    }

    return this.productService.deleteComment(commentIdNumber);
  }


  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('Invalid product ID.');
    }

    const imageFiles = files.images || [];
    return this.productService.updateProduct(productId, updateProductDto, imageFiles);
  }

  @Delete(':id')
async deleteProduct(@Param('id') id: string) {
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    throw new BadRequestException('Invalid product ID.');
  }
  return this.productService.deleteProduct(productId);
}
}

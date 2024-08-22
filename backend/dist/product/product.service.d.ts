import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    createProduct(createProductDto: CreateProductDto, imagePaths: string[]): Promise<{
        images: {
            id: number;
            url: string;
            productId: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        price: number;
        userId: number;
        serialNumber: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllProducts(): Promise<({
        images: {
            id: number;
            url: string;
            productId: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        price: number;
        userId: number;
        serialNumber: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getLatestProducts(limit: number): Promise<({
        images: {
            id: number;
            url: string;
            productId: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        price: number;
        userId: number;
        serialNumber: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getProductById(id: number): Promise<{
        comments: {
            id: number;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            userId: number;
        }[];
        images: {
            id: number;
            url: string;
            productId: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        price: number;
        userId: number;
        serialNumber: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addComment(productId: number, userId: number, content: string): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        userId: number;
    }>;
    updateComment(commentId: number, content: string): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        userId: number;
    }>;
    deleteComment(commentId: number): Promise<{
        message: string;
    }>;
    getCommentCountByProductId(productId: number): Promise<number>;
    getProductsByUserId(userId: number): Promise<({
        comments: {
            id: number;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            userId: number;
        }[];
        images: {
            id: number;
            url: string;
            productId: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        price: number;
        userId: number;
        serialNumber: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateProduct(id: number, updateProductDto: CreateProductDto, imagePaths: string[]): Promise<{
        images: {
            id: number;
            url: string;
            productId: number;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        price: number;
        userId: number;
        serialNumber: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteProduct(productId: number): Promise<{
        message: string;
    }>;
}

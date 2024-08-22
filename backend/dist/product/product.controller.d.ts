import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    createProduct(createProductDto: CreateProductDto, files: {
        images?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        product: {
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
        };
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
    getLatestProducts(limit: string): Promise<({
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
    getProductById(id: string): Promise<{
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
    addComment(id: string, createCommentDto: CreateCommentDto): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        userId: number;
    }>;
    updateComment(productId: string, commentId: string, content: string): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        productId: number;
        userId: number;
    }>;
    deleteComment(productId: string, commentId: string): Promise<{
        message: string;
    }>;
    getCommentCount(id: string): Promise<{
        count: number;
    }>;
    getProductsByUserId(userId: string): Promise<({
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
    updateProduct(id: string, updateProductDto: CreateProductDto, files: {
        images?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        product: {
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
        };
    }>;
    deleteProduct(productId: string): Promise<{
        message: string;
    }>;
}

import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(data: any, fileBuffer: Buffer | null, originalFileName: string | null): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            displayPicture: string;
        };
    }>;
    loginUser(email: string, password: string): Promise<{
        message: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            displayPicture: string;
        };
    }>;
    getUserById(userId: number): Promise<{
        id: number;
        name: string;
        email: string;
        displayPicture: string;
        role: string;
    }>;
}

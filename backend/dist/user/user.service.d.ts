import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
export declare class UserService {
    private readonly prisma;
    private readonly supabaseService;
    constructor(prisma: PrismaService, supabaseService: SupabaseService);
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
        email: string;
        role: string;
        id: number;
        name: string;
        displayPicture: string;
    }>;
}

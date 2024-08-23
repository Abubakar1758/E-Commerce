export declare class SupabaseService {
    private supabase;
    constructor();
    uploadImage(file: {
        buffer: Buffer;
        originalname: string;
    }, path: string, bucket: string): Promise<any>;
    getImageUrl(path: string, bucket: string): Promise<any>;
    deleteImage(path: string, bucket: string): Promise<void>;
}

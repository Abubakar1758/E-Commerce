import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadImage(
    file: { buffer: Buffer; originalname: string },
    path: string,
    bucket: string,
  ) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.originalname.split('.').pop() || 'application/octet-stream',
      });

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    return data.path; // Return the path within the bucket
  }

  async getImageUrl(path: string, bucket: string) {
    const { data, error } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    if (error) {
      throw new Error(`Failed to retrieve image URL: ${error.message}`);
    }

    return data.publicUrl;
  }

  async deleteImage(path: string, bucket: string) {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}

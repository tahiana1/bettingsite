import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket name - update this to match your Supabase bucket name
const STORAGE_BUCKET = 'betting';

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param path - The path in the storage bucket where the file should be stored
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique file name with timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Deletes a file from Supabase Storage
 * @param path - The path of the file to delete
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    if (!path) {
      throw new Error('No file path provided');
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Gets a list of files from a specific path in Supabase Storage
 * @param path - The path to list files from
 * @returns Array of file objects
 */
export const listFiles = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(path || '');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}; 
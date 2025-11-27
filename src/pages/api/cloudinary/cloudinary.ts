import { v2 as cloudinary } from 'cloudinary';

export class fileManager {


    constructor() {
        import.meta.env;
        cloudinary.config({
            cloud_name: import.meta.env.CLOUD_NAME,
            api_key: import.meta.env.API_KEY,
            api_secret: import.meta.env.API_SECRET
        });
    }

    async uploadImage(filePath: string) {
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'news_images',
                use_filename: true,
            });
            return { url: result.secure_url, public_id: result.public_id };
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw error;
        }
    }

}
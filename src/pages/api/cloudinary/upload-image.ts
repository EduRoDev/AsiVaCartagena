import type { APIRoute } from 'astro';
import { fileManager } from './cloudinary';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

export const prerender = false;

const uploader = new fileManager();

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: "No image received" }), { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Usar el directorio temporal del sistema operativo
        const tmpPath = join(tmpdir(), file.name);
        await writeFile(tmpPath, buffer);

        const result = await uploader.uploadImage(tmpPath);

        // Eliminar el archivo temporal después de subirlo
        await unlink(tmpPath).catch(console.error);

        return new Response(JSON.stringify({ url: result.url }), { status: 200 });

    } catch (error) {
        console.error("Upload error:", error);
        return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
    }
};
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
// import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    // Hey, can you user authenticate
    // const { userId } = await auth();
    // if (!userId) return NextResponse.json({ message: 'Un-authorize User' }, { status: 401 });

    try {
        if (
            !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            return NextResponse.json(
                { message: 'Cloudinary credentials not found' },
                { status: 404 }
            );
        }
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const originSize = formData.get('originalSize') as string;

        if (!file) return NextResponse.json({ error: 'File not found' }, { status: 400 });

        // Convert the file to an ArrayBuffer
        const bytes = await file.arrayBuffer();
        // Convert the ArrayBuffer into a Node.js Buffer
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: 'cloud-based-videos',
                    transformation: [{ quality: 'auto', fetch_formate: 'mp4' }],
                },
                (err, data) => {
                    if (err) reject(err);
                    resolve(data as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });

        const video = await prisma.video.create({
            data: {
                title,
                description,
                originSize,
                publicId: result.public_id,
                compressedSize: String(result.bytes),
                duration: result.duration || 0,
            },
        });

        return NextResponse.json(video, { status: 200 });
    } catch (error) {
        console.log('UPload video failed', error);
        return NextResponse.json({ message: 'UPload video failed' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

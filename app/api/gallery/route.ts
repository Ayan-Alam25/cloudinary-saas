import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const images = await new Promise<CloudinaryUploadResult[]>((resolve, reject) => {
            cloudinary.api.resources(
                {
                    type: 'upload',
                    prefix: 'cloud-based-images', // Specify the folder name
                },
                (err, result) => {
                    if (err) reject(err); // Reject the promise on error
                    resolve(result.resources as CloudinaryUploadResult[]); // Resolve with the resources array
                }
            );
        });

        return NextResponse.json({ videos, images }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching videos', error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

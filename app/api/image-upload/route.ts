import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
// import { auth } from '@clerk/nextjs/server';

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    // Hey, can you user authenticate
    // const { userId } = await auth();
    // if (!userId) return NextResponse.json({ error: 'Un-authorize' }, { status: 401 });

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

        if (!file) return NextResponse.json({ error: 'File not found' }, { status: 400 });

        // Convert the file to an ArrayBuffer
        const bytes = await file.arrayBuffer();
        // Convert the ArrayBuffer into a Node.js Buffer
        const buffer = Buffer.from(bytes);

        const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'cloud-based-images' },
                (err, data) => {
                    if (err) reject(err);
                    resolve(data as CloudinaryUploadResult);
                }
            );
            // End the stream with the file buffer
            uploadStream.end(buffer);
        });
        return NextResponse.json({ publicId: result.public_id }, { status: 200 });
    } catch (error) {
        console.log('UPload image failed', error);
        return NextResponse.json({ error: 'Upload image failed' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
        });
        if (!videos.length || videos.length === 0) {
            return NextResponse.json({ message: 'videos not found' }, { status: 404 });
        }
        return NextResponse.json(videos, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching videos', error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

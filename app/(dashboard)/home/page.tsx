'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VideoCard from '@/app/components/VideoCard';
import ImageCard from '@/app/components/ImageCard';

const HomePage = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [images, setImages] = useState<CloudinaryUploadResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            const response = await axios.get('/api/gallery');
            if (Array.isArray(response.data.videos) && Array.isArray(response.data.images)) {
                setVideos(response.data.videos);
                setImages(response.data.images);
            } else {
                throw new Error(' Unexpected response format');
            }
        } catch (error) {
            console.log(error);
            setError('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Videos</h1>
            {videos.length === 0 ? (
                <div className='text-lg text-gray-500'>No videos available</div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} onDownload={handleDownload} />
                    ))}
                </div>
            )}

            <h1 className='text-2xl font-bold my-4'>images</h1>
            {images.length === 0 ? (
                <div className='text-lg text-gray-500'>No images available</div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {images.map((img) => (
                        <ImageCard key={img.public_id} {...img} />
                    ))}
                </div>
            )}

            {/* error handle */}
            {error && <p className='text-danger py-5'>{error}</p>}
        </div>
    );
};

export default HomePage;

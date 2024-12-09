'use client';

import dayjs from 'dayjs';
import { filesize } from 'filesize';
import { Download } from 'lucide-react';
import { getCldImageUrl } from 'next-cloudinary';
import React, { useCallback, useRef } from 'react';

const ImageCard: React.FC<CloudinaryUploadResult> = ({ ...rest }) => {
    const imageRef = useRef<HTMLImageElement>(null);

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: 'fill',
            gravity: 'auto',
            format: 'jpg',
            quality: 'auto',
        });
    }, []);

    const formatSize = useCallback((size: number) => {
        return filesize(size);
    }, []);

    const handleDownload = () => {
        if (!imageRef.current) return;

        // download image on current page
        fetch(imageRef.current.src)
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `image.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            });
    };

    return (
        <div className='card bg-neutral-800 shadow-xl hover:shadow-2xl transition-all duration-300'>
            <figure>
                <img src={getThumbnailUrl(rest.public_id)} alt={rest.asset_id} ref={imageRef} />
            </figure>
            <div className='card-body p-4'>
                <p className='text-sm text-base-content opacity-70 mb-4'>
                    Uploaded {dayjs(rest.createdAt).fromNow()}
                </p>
                <div className='flex justify-between items-center mt-4'>
                    <div className='text-sm font-semibold'>
                        Image size:
                        <span className='text-accent'>{formatSize(Number(rest.bytes))}</span>
                    </div>
                    <button className='btn btn-primary btn-sm' onClick={handleDownload}>
                        <Download size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;

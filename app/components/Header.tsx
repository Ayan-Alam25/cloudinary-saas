import Link from 'next/link';
import React from 'react';

const Header = () => {
    return (
        <>
            <div className='flex items-center capitalize justify-evenly sticky top-0 bg-gray-800 text-white z-10 text-base font-semibold py-5'>
                <Link href={'/home'}>home</Link>
                <Link href={'/video-upload'}>video upload</Link>
                <Link href={'/social-share'}>social share</Link>
            </div>
        </>
    );
};

export default Header;

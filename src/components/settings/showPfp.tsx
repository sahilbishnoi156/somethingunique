import { UserType } from '@/types/feed.types';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { customFetch } from '@/lib/custom-fetch';
import Loader from '../loader';

export default function ShowProfilePicture({
    user,
}: {
    user?: UserType;
}) {
    const [selectedImage, setSelectedImage] = useState<File | null>(
        null
    );
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files
            ? event.target.files[0]
            : null;
        if (file) {
            const maxFileSize = 5 * 1024 * 1024; // 5MB limit
            const allowedFileTypes = ['image/jpeg', 'image/png'];

            // Check if the file type is allowed
            if (!allowedFileTypes.includes(file.type)) {
                toast.error('Only JPEG and PNG images are allowed!');
                return;
            }

            // Check if the file size is within the limit
            if (file.size > maxFileSize) {
                toast.error(
                    'The file is too large. Maximum size is 5MB.'
                );
                return;
            }

            setSelectedImage(file);
        }
    };

    const router = useRouter();

    const handleImageUpload = async () => {
        if (!selectedImage || isUploading) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('upload_preset', 'gmgscbus');

        try {
            const ImageResponse = await fetch(
                'https://api.cloudinary.com/v1_1/dlhxapeva/image/upload',
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const imageJsonData = await ImageResponse.json();
            console.log(imageJsonData);

            const response = await customFetch(
                '/user/update-profile-picture',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        avatar: imageJsonData.url,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data?.data ||
                        data?.message ||
                        'Failed to update profile picture'
                );
            } else {
                router.push('/profile');
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('An unknown error occurred');
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <div className="relative h-40 aspect-square rounded-full border-4 border-white overflow-hidden group">
                <Image
                    src={
                        selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : user?.avatar ??
                              'https://cdn.pixabay.com/photo/2020/11/22/22/17/male-5768177_1280.png'
                    }
                    className="h-full w-full"
                    alt="Profile Picture"
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-5">
                <p className="text-gray-600">
                    Got new haircut?? Wanna show everyone how amazing
                    you are. Let&apos;s goooo
                </p>
                {selectedImage ? (
                    <Button
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="py-6 px-8 bg-green-700 hover:bg-green-900 duration-150 text-white"
                    >
                        {isUploading ? <Loader /> : 'Upload'}
                    </Button>
                ) : (
                    <>
                        <input
                            type="file"
                            id="file-input"
                            className="hidden"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <label
                            htmlFor="file-input"
                            className="cursor-pointer"
                        >
                            <Button
                                className="py-6 px-8"
                                onClick={() => {
                                    fileInputRef.current?.click();
                                }}
                            >
                                Upgrade
                            </Button>
                        </label>
                    </>
                )}
            </div>
        </div>
    );
}

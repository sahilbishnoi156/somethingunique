'use client';
import { AttachmentType } from '@/types/feed.types';
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function MainCarousel({
    attachments,
    c_index,
}: {
    attachments: AttachmentType[];
    c_index?: number;
}) {
    const [currentIndex, setCurrentIndex] = useState(c_index || 0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide
            ? attachments.length - 1
            : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === attachments.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };
    return (
        <div className="max-w-full md:h-[80vh] h-[35vh] w-full relative group flex flex-col items-center justify-center">
            {attachments[currentIndex].type === 'image' ? (
                <div className="relative max-w-full max-h-full">
                    <Image
                        src={
                            attachments[currentIndex].url ||
                            '/placeholder.svg'
                        }
                        alt={attachments[currentIndex].url}
                        layout="intrinsic"
                        height={500}
                        width={500}
                        objectFit="contain"
                        className="rounded-lg"
                    />
                </div>
            ) : (
                <div className="relative max-w-full max-h-full">
                    <video
                        src={
                            attachments[currentIndex].url ||
                            '/placeholder.svg'
                        }
                        controls
                        className="rounded-lg h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Left Arrow */}
            <div
                className="hidden items-center justify-center group-hover:flex absolute left-5 top-[50%] -translate-y-1/2 text-2xl text-white cursor-pointer rounded-full"
                onClick={prevSlide}
            >
                <ChevronLeft size={40} />
            </div>
            {/* Right Arrow */}
            <div
                className="hidden items-center justify-center group-hover:flex absolute right-5 top-[50%] -translate-y-1/2 text-2xl text-white cursor-pointer rounded-full"
                onClick={nextSlide}
            >
                <ChevronRight size={40} />
            </div>

            <div className="flex top-4 justify-center py-2">
                {attachments.map((attachment, attachmentIndex) => (
                    <div
                        key={attachmentIndex}
                        onClick={() => goToSlide(attachmentIndex)}
                        className="text-2xl cursor-pointer "
                    >
                        <Dot
                            size={40}
                            className={
                                attachmentIndex === currentIndex
                                    ? 'text-green-600'
                                    : 'text-primary'
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

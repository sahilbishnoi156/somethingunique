import { PostType } from '@/types/feed.types';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import moment from 'moment';

export default function PostItem({ post }: { post: PostType }) {
    const [expandedImage, setExpandedImage] = useState<string | null>(
        null
    );

    const renderAttachments = () => {
        const attachments = post.attachments || [];
        const count = attachments.length;

        const isSingleImage = count === 1;
        const gridStyle = isSingleImage
            ? 'grid-cols-2'
            : 'grid-cols-2 md:grid-cols-4';

        return (
            <div className={`grid ${gridStyle} gap-2 mt-4`}>
                {attachments.slice(0, 4).map((attachment, index) => (
                    <div
                        key={index}
                        className="relative aspect-square cursor-pointer overflow-hidden rounded-lg hover:opacity-90"
                        onClick={() =>
                            setExpandedImage(attachment.url)
                        }
                    >
                        <Image
                            src={attachment.url || '/placeholder.svg'}
                            alt={`Attachment ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                        />
                        {index === 3 && count > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">
                                    +{count - 4}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };
    const renderCaption = () => {
        // Regex for mentions (@username) and hashtags (#hashtag)
        const mentionRegex = /@\w+/g;
        const hashtagRegex = /#\w+/g;

        // Split caption into parts based on mentions and hashtags
        const parts = post.caption.split(/(@\w+|#\w+)/g);

        return parts.map((part, index) => {
            if (mentionRegex.test(part)) {
                // Render mentions in blue
                return (
                    <span
                        key={index}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        {part}
                    </span>
                );
            } else if (hashtagRegex.test(part)) {
                // Render hashtags in blue
                return (
                    <span
                        key={index}
                        className="text-blue-500 cursor-pointer"
                    >
                        {part}
                    </span>
                );
            } else {
                // Render plain text
                return <span key={index}>{part}</span>;
            }
        });
    };

    return (
        <div className="flex gap-4 py-1 hover:bg-secondary/30 duration-300">
            <div className={`flex rounded-xl w-full p-6 gap-4`}>
                <div className="flex flex-col items-center justify-between">
                    <Image
                        className="rounded-full h-12 w-12 object-cover"
                        height={48}
                        width={48}
                        src={
                            post.user_id.avatar ||
                            'https://cdn.pixabay.com/photo/2023/05/23/18/12/hummingbird-8013214_1280.jpg'
                        }
                        alt={post.user_id.username}
                    />
                    <div className="space-y-2 mt-2">
                        <ChevronsUp className="cursor-pointer" />
                        <ChevronsDown className="cursor-pointer" />
                    </div>
                </div>
                <div className="w-full">
                    <div className="">
                        <div className="text-lg font-semibold">
                            {post.user_id.username}
                        </div>
                        <div className="text-sm text-gray-500 relative bottom-2">
                            {moment(post.createdAt).fromNow()}
                        </div>
                    </div>
                    <div className="mt-2 text-gray-100 whitespace-pre-line">
                        {renderCaption()}
                    </div>
                    {renderAttachments()}
                </div>
            </div>

            {expandedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="max-w-5xl max-h-[90vh] relative">
                        <Image
                            src={expandedImage}
                            alt="Expanded image"
                            layout="intrinsic"
                            width={1200}
                            height={900}
                            objectFit="contain"
                            className="rounded-lg"
                        />
                        <button
                            className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full focus:outline-none hover:bg-gray-600"
                            onClick={() => setExpandedImage(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

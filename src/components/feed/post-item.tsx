import { PostType, VoteType } from '@/types/feed.types';
import {
    ClipboardCheck,
    Frown,
    MicVocal,
    Send,
    Smile,
    Trash,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { customFetch } from '@/lib/custom-fetch';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { showComments } from '@/app/store/view-slice';
import Link from 'next/link';
import { Button } from '../ui/button';
import Loader from '../loader';
import MainCarousel from '../Carousel';
import { usePathname } from 'next/navigation';
import { UserToolTip } from '../show-user-tooltip';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from '../ui/tooltip';

export default function PostItem({
    post,
    userId,
}: {
    post: PostType;
    userId: string;
}) {
    const [expandedAttachmentIndex, setExpandedAttachmentIndex] =
        useState<number>();
    const [userVote, setUserVote] = useState<
        null | 'upvote' | 'downvote'
    >(null);
    const [upvotesCount, setUpvotesCount] = useState<number>(
        post.upvotesCount || 0
    );
    const [downvotesCount, setDownvotesCount] = useState<number>(
        post.downvotesCount || 0
    );
    const [urlCopied, setUrlCopied] = useState(false);

    const isMyPost = post.user_id._id === userId;

    // Function to render image attachments
    const renderAttachments = () => {
        const attachments = post.attachments || [];
        const count = attachments.length;
        const isSingleImage = count === 1;
        const gridStyle = isSingleImage
            ? 'grid-cols-2'
            : 'grid-cols-2 md:grid-cols-4';

        return (
            <div className={`grid ${gridStyle} gap-2 mt-4`}>
                {attachments.slice(0, 4).map((attachment, index) =>
                    attachment.type === 'image' ? (
                        <div
                            key={index}
                            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg hover:opacity-90"
                            onClick={() =>
                                setExpandedAttachmentIndex(index)
                            }
                        >
                            <Image
                                src={
                                    attachment.url ||
                                    '/placeholder.svg'
                                }
                                alt={`Attachment ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />

                            {index === 3 && count > 4 && (
                                <div
                                    onClick={() => {
                                        setExpandedAttachmentIndex(3);
                                    }}
                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                >
                                    <span className="text-white text-2xl font-bold">
                                        +{count - 4}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            key={index}
                            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg hover:opacity-90"
                            onClick={() =>
                                setExpandedAttachmentIndex(index)
                            }
                        >
                            <video
                                src={
                                    attachment.url ||
                                    '/placeholder.svg'
                                }
                                controls
                                className="rounded-lg h-full w-full object-cover"
                            />
                            {index === 3 && count > 4 && (
                                <div
                                    onClick={() => {
                                        setExpandedAttachmentIndex(3);
                                    }}
                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                >
                                    <span className="text-white text-2xl font-bold">
                                        +{count - 4}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>
        );
    };
    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeletePost = async () => {
        if (isDeleting) return;
        try {
            setIsDeleting(true);
            const response = await customFetch(
                `/feed/delete-post?postId=` + post._id,
                {
                    method: 'DELETE',
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data?.message || 'Failed to delete post'
                );
            }
            // Reload page to reflect changes
            window.location.reload();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };
    // Function to render captions with mentions and hashtags
    const renderCaption = () => {
        // Update regex to capture everything after @ until a space or end of string
        const mentionRegex = /@(\S+?)(?=\s|$)/g;
        const hashtagRegex = /#(\S+?)(?=\s|$)/g;

        // Split caption into parts matching mentions and hashtags
        const parts = post.caption
            .trim()
            .split(/(@\S+?(\s|$)|#\S+?(\s|$))/g);

        return parts.map((part, index) => {
            if (mentionRegex.test(part)) {
                // Extract mention text without the "@" for the profile link
                const mention = part
                    .match(mentionRegex)?.[0]
                    .slice(1); // Remove "@"
                return (
                    <Link href={'/profile/' + mention} key={index}>
                        <span className="text-blue-500 cursor-pointer hover:underline">
                            {part}
                        </span>
                    </Link>
                );
            } else if (hashtagRegex.test(part)) {
                return (
                    <span
                        key={index}
                        className="text-blue-500 cursor-pointer"
                    >
                        {part}
                    </span>
                );
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    const handleSubmitVote = async (voteType: VoteType) => {
        // Save previous state for rollback
        const previousVote = userVote;
        const previousUpvotes = upvotesCount;
        const previousDownvotes = downvotesCount;

        // Optimistic UI update
        if (voteType === userVote) {
            // Remove the vote if the user clicks the same button again
            setUserVote(null);
            setUpvotesCount(
                voteType === 'upvote'
                    ? upvotesCount - 1
                    : upvotesCount
            );
            setDownvotesCount(
                voteType === 'downvote'
                    ? downvotesCount - 1
                    : downvotesCount
            );
        } else {
            // Toggle or apply the vote
            setUserVote(voteType);
            setUpvotesCount(
                voteType === 'upvote'
                    ? upvotesCount +
                          1 +
                          (userVote === 'downvote' ? 1 : 0)
                    : upvotesCount - (userVote === 'upvote' ? 1 : 0)
            );
            setDownvotesCount(
                voteType === 'downvote'
                    ? downvotesCount +
                          1 +
                          (userVote === 'upvote' ? 1 : 0)
                    : downvotesCount -
                          (userVote === 'downvote' ? 1 : 0)
            );
        }

        try {
            const response = await customFetch(`/feed/vote-post`, {
                method: 'PATCH',
                body: JSON.stringify({ voteType, postId: post._id }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to vote');
            }

            // Update counts from server (optional if optimistic counts match backend)
            setUpvotesCount(data.data.upvotesCount);
            setDownvotesCount(data.data.downvotesCount);
        } catch (error) {
            console.error('Vote submission failed:', error);

            // Rollback to previous state
            setUserVote(previousVote);
            setUpvotesCount(previousUpvotes);
            setDownvotesCount(previousDownvotes);
        }
    };

    useEffect(() => {
        // Set initial vote state based on props if needed
        if (post.userVote === 'upvote') {
            setUserVote('upvote');
        } else if (post.userVote === 'downvote') {
            setUserVote('downvote');
        }
    }, [post]);

    const { postId } = useSelector((state: RootState) => state.view);
    const dispatch = useDispatch();
    const pathname = usePathname();

    return (
        <div
            className={`group my-1 dark:hover:bg-secondary/40   ${
                pathname.includes('profile') ||
                pathname.includes('clubs')
                    ? 'hover:bg-primary/10 bg-secondary dark:bg-secondary/20'
                    : 'hover:bg-secondary'
            } rounded-lg duration-300 w-full relative`}
        >
            {isDeleting && (
                <div className="absolute h-full w-full bg-black/80 flex items-center flex-col gap-5 justify-center z-50">
                    <Loader />
                    <span className="animate-pulse text-lg">
                        Deleting...
                    </span>
                </div>
            )}
            <div
                className={`flex rounded-xl w-full sm:flex-row flex-col sm:p-6 p-2 gap-2`}
            >
                <div className="hidden sm:flex flex-col items-center justify-between gap-4">
                    <div className="h-12 aspect-square relative border-2 rounded-full border-violet-600">
                        <Image
                            className="rounded-full"
                            layout="fill"
                            objectFit="cover"
                            src={
                                post.user_id.avatar ||
                                'https://cdn.pixabay.com/photo/2023/05/23/18/12/hummingbird-8013214_1280.jpg'
                            }
                            alt={
                                post.user_id.username ||
                                "User's avatar"
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <div
                            className={`flex flex-col items-center gap-2 p-1.5 rounded-full ${
                                userVote === 'upvote'
                                    ? 'bg-gradient-to-b from-green-500 to-green-900'
                                    : userVote === 'downvote'
                                    ? 'bg-gradient-to-b from-red-900 to-red-500'
                                    : 'dark:bg-secondary/60 bg-secondary'
                            }`}
                        >
                            <Smile
                                className={`cursor-pointer ${
                                    userVote === 'downvote'
                                        ? 'text-neutral-500'
                                        : !userVote &&
                                          'hover:text-green-600'
                                }  `}
                                size={25}
                                onClick={() =>
                                    handleSubmitVote('upvote')
                                }
                            />
                            <span>
                                {upvotesCount - downvotesCount}
                            </span>
                            <Frown
                                className={`cursor-pointer   ${
                                    userVote && userVote === 'upvote'
                                        ? 'text-neutral-500'
                                        : !userVote &&
                                          'hover:text-red-600'
                                } `}
                                size={25}
                                onClick={() =>
                                    handleSubmitVote('downvote')
                                }
                            />
                        </div>
                        {post.attachments.length > 0 && (
                            <>
                                <div
                                    className={
                                        'dark:bg-secondary/60 bg-secondary hover:bg-primary/10 dark:hover:bg-secondaryy p-2.5 rounded-full cursor-pointer'
                                    }
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            window.location.href
                                        );
                                        setUrlCopied(true);
                                    }}
                                >
                                    {urlCopied ? (
                                        <>
                                            <ClipboardCheck
                                                size={20}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                        </>
                                    )}
                                </div>

                                <div
                                    className={`p-2.5 rounded-full cursor-pointer ${
                                        postId === post._id
                                            ? 'bg-primary text-secondary'
                                            : 'dark:bg-secondary/60 bg-secondary hover:bg-primary/10 dark:hover:bg-secondary'
                                    }`}
                                    onClick={() =>
                                        dispatch(
                                            showComments(post._id)
                                        )
                                    }
                                >
                                    <MicVocal size={20} />
                                </div>

                                {isMyPost && (
                                    <div
                                        className={`p-2.5 rounded-full cursor-pointer bg-destructive hover:bg-destructive/60 text-primary`}
                                        onClick={() => {
                                            const confirmDelete =
                                                window.confirm(
                                                    'Are you sure you want to delete this post?'
                                                );
                                            if (confirmDelete)
                                                handleDeletePost();
                                        }}
                                    >
                                        <Trash size={20} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="w-full">
                    <div className="w-full">
                        <div className="flex items-center gap-3">
                            <div className="block sm:hidden h-12 aspect-square relative border-2 rounded-full border-violet-600">
                                <Image
                                    className="rounded-full"
                                    layout="fill"
                                    objectFit="cover"
                                    src={
                                        post.user_id.avatar ||
                                        'https://cdn.pixabay.com/photo/2023/05/23/18/12/hummingbird-8013214_1280.jpg'
                                    }
                                    alt={
                                        post.user_id.username ||
                                        "User's avatar"
                                    }
                                />
                            </div>
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Link
                                            href={
                                                '/profile/' +
                                                post.user_id.username
                                            }
                                            className="flex items-start flex-col"
                                        >
                                            <div className="text-lg font-semibold">
                                                {
                                                    post.user_id
                                                        .username
                                                }
                                            </div>
                                            <div className="text-sm text-gray-500 relative bottom-2">
                                                {moment(
                                                    post.createdAt
                                                ).fromNow()}
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <UserToolTip
                                            user={post.user_id}
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="mt-2 dark:text-gray-100 text-neutral-700 whitespace-pre-line">
                            {renderCaption()}
                        </div>
                        {renderAttachments()}
                    </div>
                    {(post.attachments.length <= 0 ||
                        window.innerWidth < 640) && (
                        <div className=" flex w-full sm:gap-5 gap-2 sm:mt-10 mt-2">
                            <div
                                className={`sm:hidden flex sm:flex-col flex-row items-center gap-2 p-1.5  rounded-full ${
                                    userVote === 'upvote'
                                        ? 'sm:bg-gradient-to-b bg-gradient-to-r from-green-500 to-green-900'
                                        : userVote === 'downvote'
                                        ? 'sm:bg-gradient-to-b bg-gradient-to-r from-red-900 to-red-500'
                                        : 'dark:bg-secondary/60 bg-secondary'
                                }`}
                            >
                                <Smile
                                    className={`cursor-pointer ${
                                        userVote === 'downvote'
                                            ? 'text-neutral-500'
                                            : !userVote &&
                                              'hover:text-green-600'
                                    }  `}
                                    size={25}
                                    onClick={() =>
                                        handleSubmitVote('upvote')
                                    }
                                />
                                <span>
                                    {upvotesCount - downvotesCount}
                                </span>
                                <Frown
                                    className={`cursor-pointer   ${
                                        userVote &&
                                        userVote === 'upvote'
                                            ? 'text-neutral-500'
                                            : !userVote &&
                                              'hover:text-red-600'
                                    } `}
                                    size={25}
                                    onClick={() =>
                                        handleSubmitVote('downvote')
                                    }
                                />
                            </div>
                            <div
                                className={
                                    'dark:bg-secondary/60 bg-secondary hover:bg-primary/10 dark:hover:bg-secondary p-2 px-3 rounded-full cursor-pointer w-fit flex items-center gap-2'
                                }
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        window.location.href
                                    );
                                    setUrlCopied(true);
                                }}
                            >
                                {urlCopied ? (
                                    <>
                                        <ClipboardCheck size={20} />
                                        <span className="sm:block hidden">
                                            Copied
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        <span className="sm:block hidden">
                                            Share
                                        </span>
                                    </>
                                )}
                            </div>

                            <div
                                className={` w-fit flex items-center gap-2 p-2 px-3 rounded-full cursor-pointer ${
                                    postId === post._id
                                        ? 'bg-primary text-secondary'
                                        : 'dark:bg-secondary/60 bg-secondary hover:bg-primary/10 dark:hover:bg-secondary text-primary'
                                }`}
                                onClick={() =>
                                    dispatch(showComments(post._id))
                                }
                            >
                                <MicVocal size={20} />
                                <span className="sm:block hidden">
                                    Yap Yap
                                </span>
                            </div>

                            {isMyPost && (
                                <div
                                    className={`p-2 px-3 rounded-full cursor-pointer bg-destructive/80 hover:bg-destructive text-white w-fit flex items-center gap-2`}
                                    onClick={() => {
                                        const confirmDelete =
                                            window.confirm(
                                                'Are you sure you want to delete this post?'
                                            );
                                        if (confirmDelete)
                                            handleDeletePost();
                                    }}
                                >
                                    <Trash size={20} />
                                    <span className="sm:block hidden">
                                        Delete
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {expandedAttachmentIndex !== undefined && (
                <div className="fixed inset-0 p-4 h-screen w-screen bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <MainCarousel
                        attachments={post.attachments}
                        c_index={expandedAttachmentIndex}
                    />
                    <Button
                        size={'icon'}
                        className="absolute top-4 right-4"
                        onClick={() =>
                            setExpandedAttachmentIndex(undefined)
                        }
                    >
                        ✕
                    </Button>
                </div>
            )}
        </div>
    );
}

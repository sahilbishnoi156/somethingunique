'use client';

import { resetView } from '@/app/store/view-slice';
import { customFetch } from '@/lib/custom-fetch';
import { parseJwt } from '@/lib/jwt';
import { CommentType } from '@/types/feed.types';
import { Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import moment from 'moment';
import Link from 'next/link';

const Comments = ({ postId }: { postId: string | null }) => {
    const dispatch = useDispatch();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState('');

    const token = localStorage.getItem('authToken');
    if (!token) {
        redirect('/login');
    }
    const user = parseJwt(token).user;

    useEffect(() => {
        if (!postId) {
            dispatch(resetView());
            return;
        }

        const fetchComments = async () => {
            try {
                const response = await customFetch(
                    `/comments/get-comments-for-post?postId=${postId}`,
                    { method: 'GET' }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(
                        data?.data ||
                            data?.message ||
                            'Failed to fetch comments'
                    );
                }
                setComments(data.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
                toast.error(
                    (error as Error).message ||
                        'Failed to fetch comments'
                );
            }
        };

        fetchComments();
    }, [postId, dispatch]);

    const handleNewComment = useCallback(async () => {
        try {
            const response = await customFetch('/comments/add', {
                method: 'POST',
                body: JSON.stringify({
                    post_id: postId,
                    user_id: user.id,
                    content: newComment,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setComments((prev) => [data.data, ...prev]);
                setNewComment('');
            } else {
                throw new Error(
                    data?.data ||
                        data?.message ||
                        'Failed to add comment'
                );
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error(
                (error as Error).message || 'Failed to add comment'
            );
        }
    }, [postId, user.id, newComment]);

    const handleDeleteComment = useCallback(
        async (commentId: string) => {
            try {
                const response = await customFetch(
                    `/comments/delete`,
                    {
                        method: 'DELETE',
                        body: JSON.stringify({ commentId }),
                    }
                );
                if (response.ok) {
                    setComments((prev) =>
                        prev.filter(
                            (comment) => comment._id !== commentId
                        )
                    );
                    toast.success('Comment deleted successfully');
                } else {
                    const data = await response.json();
                    throw new Error(
                        data?.data ||
                            data?.message ||
                            'Failed to delete comment'
                    );
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                toast.error(
                    (error as Error).message ||
                        'Failed to delete comment'
                );
            }
        },
        []
    );

    const renderComments = useCallback(
        (comments: CommentType[]) => {
            return comments.map((comment) => (
                <Card key={comment._id} className="mb-4">
                    <Link
                        href={
                            '/profile/' + comment?.user_id?.username
                        }
                    >
                        <CardHeader className="flex flex-row items-center gap-3 p-4">
                            <Avatar>
                                <AvatarImage
                                    src={
                                        comment.user_id.avatar ||
                                        `/placeholder.svg?height=40&width=40`
                                    }
                                    className="object-cover rounded-full"
                                    alt={comment.user_id.username}
                                />
                                <AvatarFallback>
                                    {comment.user_id.username
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="font-medium">
                                    {comment.user_id.username}
                                </CardTitle>
                                <div>
                                    <p className="text-xs text-gray-500 relative bottom-1">
                                        {moment(
                                            comment.createdAt
                                        ).fromNow()}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                    </Link>
                    <CardContent className="p-4 pt-0">
                        <span>{comment.content}</span>
                    </CardContent>
                    <CardFooter className="flex justify-end p-4">
                        {user.id === comment.user_id._id && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-red-600 duration-150"
                                onClick={() =>
                                    handleDeleteComment(comment._id)
                                }
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ));
        },
        [handleDeleteComment, user.id]
    );

    if (!postId) {
        return null;
    }

    return (
        <div className="space-y-4 p-4">
            <h3 className="text-2xl font-bold">Yap Yap 🗨️</h3>
            <Card>
                <CardContent className="p-4">
                    <Input
                        value={newComment}
                        onChange={(e) =>
                            setNewComment(e.target.value)
                        }
                        placeholder="What's the buzz? 🐝"
                        className="mb-2"
                        maxLength={300}
                        minLength={3}
                    />
                    <Button
                        onClick={handleNewComment}
                        className="self-end"
                        disabled={
                            !newComment ||
                            newComment.length < 3 ||
                            newComment.length > 300 ||
                            newComment.trim().length === 0
                        }
                    >
                        Shout It Out 🎤
                    </Button>
                </CardContent>
            </Card>
            <div>{renderComments(comments)}</div>
        </div>
    );
};

export default Comments;

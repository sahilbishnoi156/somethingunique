import { PostCategory } from './post-category.types';

export type PostType = {
    _id: string;
    caption: string;
    category: PostCategory;
    user_id: UserType;
    upvotesCount: number;
    downvotesCount: number;
    userVote: VoteType | null;
    college_id: CollageType;
    is_approved: boolean;
    attachments: AttachmentType[];
    createdAt: string;
    updatedAt: string;
};

export type AttachmentType = {
    url: string;
    type: 'image' | 'video';
    _id?: string;
};
export type UserType = {
    _id: string;
    username: string;
    email: string;
    bio?: string;
    college_id: string | CollageType;
    createdAt: string;
    avatar: string;
    posts?: PostType[];
    title?: string;
};

export type CollageType = {
    _id?: string;
    name: string;
    key: string;
    createdAt: string;
};

export type CommentType = {
    _id: string;
    content: string;
    user_id: UserType;
    post_id: string;
    parent_comment_id: string | null;
    createdAt: string;
    replies?: CommentType[];
    replyCount?: number;
    repliedToUsername?: null | string;
};

export type VoteType = 'upvote' | 'downvote';

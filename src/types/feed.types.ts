import { PostCategory } from './post-category.types';

export type PostType = {
    _id: string;
    caption: string;
    category: PostCategory;
    user_id: UserType;
    upvotesCount: number;
    downvotesCount: number;
    userVote: VoteType | null;
    college_id: CollegeType;
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
    college_id: string | CollegeType;
    createdAt: string;
    avatar: string;
    posts?: PostType[];
    role: 'student' | 'college_admin' | 'super_admin';
    title?: string;
};

export type CollegeType = {
    _id?: string;
    name: string;
    key: string;
    createdAt: string;
};
export type ClubType = {
    _id?: string;
    name: string;
    description: string;
    college_id: CollegeType | string;
    admin: UserType | string;
    status: 'review' | 'active' | 'inactive';
    createdAt?: string;
    actionAuthorized: boolean | null;
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

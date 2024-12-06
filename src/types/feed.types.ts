import { PostCategory } from './post-category.types';

export type PostType = {
    _id: string;
    caption: string;
    category: PostCategory;
    user_id: UserType;
    college_id: CollageType;
    is_approved: boolean;
    attachments: [
        {
            url: string;
            type: string;
        }
    ];
    createdAt: string;
    updatedAt: string;
};

export type UserType = {
    _id: string;
    username: string;
    email: string;
    college_id: string | CollageType;
    createdAt: string;
    avatar: string;
};

export type CollageType = {
    _id?: string;
    name: string;
    key: string;
    createdAt: string;
};

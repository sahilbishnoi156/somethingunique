import { UserType } from '@/types/feed.types';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const UserToolTip = ({ user }: { user: UserType }) => {
    return (
        <div className="max-w-[300px] cursor-pointer">
            <div className="justify-between">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage
                            src={
                                user?.avatar ||
                                `/placeholder.svg?height=40&width=40`
                            }
                            className="object-cover"
                            alt={user.username}
                        />
                        <AvatarFallback>
                            {user?.username
                                ?.slice(0, 2)
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                        <h5 className="text-lg tracking-tight text-default-500">
                            @{user?.username}
                        </h5>
                        <h5 className="relative bottom-1.5">
                            since{' '}
                            {new Date(
                                user?.createdAt
                            ).toLocaleDateString()}
                        </h5>
                    </div>
                </div>
            </div>
            <div>
                <p className="pl-px whitespace-pre-line">
                    {user?.bio?.slice(0, 50)}
                </p>
            </div>
        </div>
    );
};

'use client';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { Plus, Sunset } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    toggleCreatePost,
    toggleEventPostBar,
} from '@/app/store/view-slice';
import { RootState } from '@/app/store/store';
import { usePathname } from 'next/navigation';

export const CreatePostButton = () => {
    const pathname = usePathname();
    const { viewType, isEventPost } = useSelector(
        (state: RootState) => state.view
    );
    const regex = /^\/clubs\/[^/]+$/;
    const dispatch = useDispatch();
    if (regex.test(pathname)) {
        return (
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={
                                !isEventPost ? 'secondary' : 'default'
                            }
                            size={'lg'}
                            className="h-12 rounded-xl sm:hidden block"
                            onClick={() =>
                                dispatch(toggleEventPostBar())
                            }
                        >
                            <div className="flex gap-2 items-center">
                                <Sunset />
                                <div className="sm:hidden block">
                                    Create Event
                                </div>
                            </div>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Create Event</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={
                            viewType !== 'createPost'
                                ? 'secondary'
                                : 'default'
                        }
                        size={'lg'}
                        className="h-12 rounded-xl"
                        onClick={() => dispatch(toggleCreatePost())}
                    >
                        <Plus />
                        <div className="sm:hidden block">
                            Create Post
                        </div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Create Post</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

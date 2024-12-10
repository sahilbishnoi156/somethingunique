import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCreatePost } from '@/app/store/view-slice';
import { RootState } from '@/app/store/store';

export const CreatePostButton = () => {
    const { viewType } = useSelector(
        (state: RootState) => state.view
    );
    const dispatch = useDispatch();
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

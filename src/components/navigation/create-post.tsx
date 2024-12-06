import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export const CreatePost = () => {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="secondary"
                        className="h-12 w-12 rounded-xl"
                    >
                        <Plus />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Create Post</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

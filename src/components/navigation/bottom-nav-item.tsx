import { BottomNavigationLink } from '@/types/navigation-links.types';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';

interface BottomNavigationItemProps {
    item: BottomNavigationLink;
}
export const BottomNavigationItem: React.FC<
    BottomNavigationItemProps
> = ({ item }) => {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-12 w-12 rounded-xl "
                    >
                        <item.icon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{item.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

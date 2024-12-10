import { BottomNavigationLink } from '@/types/navigation-links.types';
import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { useSearchParams } from 'next/navigation';

interface BottomNavigationItemProps {
    item: BottomNavigationLink;
    isSmall?: boolean;
}
export const BottomNavigationItem: React.FC<
    BottomNavigationItemProps
> = ({ item, isSmall = false }) => {
    const params = useSearchParams();
    const feedType = params.get('type');

    const isActive = feedType === item.category;
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={isActive ? 'default' : 'secondary'}
                        size={'lg'}
                        className="h-12 w-full rounded-xl duration-300 transition-all"
                    >
                        <item.icon />
                        {(isActive || isSmall) && (
                            <div>{item.name}</div>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{item.name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

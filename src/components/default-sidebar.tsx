import React from 'react';
import { Button } from './ui/button';
import { CLUB_COLORS, CLUBS } from '@/constants/clubs';
import { Badge } from './ui/badge';
import { getRandomElement } from '@/lib/random-item';

export default function DefaultSidebar() {
    return (
        <div className="p-6">
            <h2 className="font-semibold text-xl">Filters</h2>

            <div className="space-y-3 flex flex-col mt-5 ">
                <Button
                    variant={'secondary'}
                    size={'lg'}
                    className="text-lg"
                >
                    Trending{' '}
                </Button>
                <Button
                    variant={'secondary'}
                    size={'lg'}
                    className="text-lg"
                >
                    Latest{' '}
                </Button>
            </div>

            <h2 className="font-semibold text-xl mt-10">Clubs</h2>
            <div className="flex flex-wrap gap-4 mt-4">
                {CLUBS.map((club) => {
                    const randomColor = getRandomElement(CLUB_COLORS);
                    return (
                        <Badge
                            key={club}
                            style={{ backgroundColor: randomColor }}
                            className="text-sm font-medium py-1"
                        >
                            {club}
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}

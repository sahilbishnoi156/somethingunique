import { BottomNavigationLink } from '@/types/navigation-links.types';
import {
    Glasses,
    PartyPopper,
    Settings,
    UserRound,
    UsersRound,
} from 'lucide-react';

export const BOTTOM_NAV_LINKS: BottomNavigationLink[] = [
    {
        name: 'Forum',
        href: '/app/feed?type=forum',
        category: 'forum',
        icon: UsersRound,
    },
    {
        name: 'Lost & Found',
        href: '/app/feed?type=lostAndFound',
        category: 'lostAndFound',
        icon: Glasses,
    },
    {
        name: 'Confession',
        href: '/app/feed?type=confession',
        category: 'confession',
        icon: PartyPopper,
    },
    {
        name: 'Profile',
        href: '/profile',
        icon: UserRound,
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
    },
];

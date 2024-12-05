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
        icon: UsersRound,
    },
    {
        name: 'Lost & Found',
        href: '/app/feed?type=lostandfound',
        icon: Glasses,
    },
    {
        name: 'Confession',
        href: '/app/feed?type=confession',
        icon: PartyPopper,
    },
    {
        name: 'Profile',
        href: '/app/profile',
        icon: UserRound,
    },
    {
        name: 'Settings',
        href: '/app/settings',
        icon: Settings,
    },
];

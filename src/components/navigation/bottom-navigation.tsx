import { BOTTOM_NAV_LINKS } from '@/constants/links';
import { BottomNavigationLink } from '@/types/navigation-links.types';
import { BottomNavigationItem } from './bottom-nav-item';
import Link from 'next/link';
import { CreatePost } from './create-post';

export default function BottomNavigation() {
    return (
        <div className="flex items-center justify-start px-3 gap-3">
            {BOTTOM_NAV_LINKS.map((link: BottomNavigationLink) => (
                <Link key={link.name} href={link.href}>
                    <BottomNavigationItem item={link} />
                </Link>
            ))}
            <CreatePost />
        </div>
    );
}

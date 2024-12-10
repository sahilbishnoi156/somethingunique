import { BOTTOM_NAV_LINKS } from '@/constants/links';
import { BottomNavigationLink } from '@/types/navigation-links.types';
import { BottomNavigationItem } from './bottom-nav-item';
import Link from 'next/link';
import { CreatePostButton } from './create-post-button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronsUp } from 'lucide-react';

export default function BottomNavigation() {
    return (
        <>
            <div className="hidden sm:flex items-center justify-start p-3 px-10 gap-3">
                {BOTTOM_NAV_LINKS.map(
                    (link: BottomNavigationLink) => (
                        <Link key={link.name} href={link.href}>
                            <BottomNavigationItem item={link} />
                        </Link>
                    )
                )}
                <CreatePostButton />
            </div>
            <div className="sm:hidden flex items-center justify-start gap-3 ">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size={'icon'}
                            className="p-6"
                        >
                            <ChevronsUp size={30} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 min-h-56 flex flex-col gap-2 bg-transparent border-none px-6">
                        {BOTTOM_NAV_LINKS.map(
                            (link: BottomNavigationLink) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                >
                                    <BottomNavigationItem
                                        item={link}
                                        isSmall
                                    />
                                </Link>
                            )
                        )}
                        <CreatePostButton />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}

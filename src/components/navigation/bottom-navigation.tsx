'use client';
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
import { ChevronsUp, Search } from 'lucide-react';
import { JwtPayload } from '@/types/auth.types';
import { AdminButton } from './admin-button';
import { showSearch } from '@/app/store/view-slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

export default function BottomNavigation({
    payload,
}: {
    payload?: JwtPayload | null;
}) {
    const dispatch = useDispatch();
    const { viewType } = useSelector(
        (state: RootState) => state.view
    );
    console.log(payload)
    return (
        <>
            <div className="hidden lg:flex items-center justify-start p-3 px-10 gap-3">
                {BOTTOM_NAV_LINKS.map(
                    (link: BottomNavigationLink) => (
                        <Link key={link.name} href={link.href}>
                            <BottomNavigationItem item={link} />
                        </Link>
                    )
                )}
                <CreatePostButton />
                <AdminButton role={payload?.user?.role} />
            </div>
            <div className="lg:hidden block">
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
                    <DropdownMenuContent className=" flex flex-col gap-2 p-0 border-none mx-6 rounded-xl">
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
                        <Button
                            variant={
                                viewType !== 'showSearch'
                                    ? 'secondary'
                                    : 'default'
                            }
                            size={'lg'}
                            className="h-12 rounded-xl w-full"
                            onClick={() => dispatch(showSearch())}
                        >
                            <Search />
                            <div className="sm:hidden block">
                                Search
                            </div>
                        </Button>
                        <AdminButton role={payload?.user?.role} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}

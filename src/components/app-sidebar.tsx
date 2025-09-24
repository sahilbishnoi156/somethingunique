'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserType } from '@/types/feed.types';
import { customFetch } from '@/lib/custom-fetch';
import Loader from './loader';
import Link from 'next/link';

export function AppSidebar({
    navMains,
    ...props
}: React.ComponentProps<typeof Sidebar> & {
    navMains: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    const [user, setUser] = React.useState<UserType>();
    const [isFetching, setIsFetching] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await customFetch('/user/get-user', {
                    method: 'GET',
                });
                const data = await response.json();
                console.log(data)
                if (!response.ok) {
                    throw new Error(data?.data.message);
                }
                setUser(data.data.data);
                setIsFetching(false);
            } catch (error) {
                console.error(error);
                setIsFetching(false);
            }
        };
        fetchData();
    }, []);

    const { open } = useSidebar();

    return (
        <>
            {isFetching ? (
                <div className="fixed bg-black z-50 inset-0 h-screen w-screen flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <Sidebar collapsible="icon" {...props}>
                    <SidebarHeader>
                        <div className="flex items-center justify-center gap-3 pt-3">
                            <Link href={'/app'}>
                                <Loader isLogo />
                            </Link>
                            {open && <p>Admin&apos;s Villa</p>}
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <NavMain items={navMains} />
                    </SidebarContent>
                    <SidebarFooter>
                        <NavUser user={user} />
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>
            )}
        </>
    );
}

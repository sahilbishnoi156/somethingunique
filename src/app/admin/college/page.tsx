'use client';
import { AppSidebar } from '@/components/app-sidebar';
import DataTable from '@/components/data-table';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { customFetch } from '@/lib/custom-fetch';
import { UserType } from '@/types/feed.types';
import { ClipboardList, SquareTerminal, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const tabTypes = ['students', 'clubs'];
export default function Page() {
    const params = useSearchParams();
    const tab = params.get('tab');
    const [data, setData] = React.useState(null);
    const [isDataFetching, setIsDataFetching] = React.useState(false);
    const [refetch, setRefetch] = React.useState(true);

    React.useEffect(() => {
        if (tabTypes.includes(tab as string)) {
            const fetchData = async () => {
                setIsDataFetching(true);
                try {
                    const response = await customFetch(
                        '/dashboard/collegeadmin?tab=' + tab,
                        {
                            method: 'GET',
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        console.log(data);
                        throw new Error(data?.data || data?.message);
                    }
                    setData(data.data);
                    setIsDataFetching(false);
                } catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        if (
                            error?.message === 'Authorization denied'
                        ) {
                            redirect('/app');
                        }
                        toast.error(error?.message);
                    }

                    setIsDataFetching(false);
                }
            };
            fetchData();
        } else if (tab !== null) {
            redirect('/admin');
        }
    }, [tab, refetch]);
    const renderStudents = () => {
        if (!data) return null;
        const {
            data: users,
            totalStudents,
        }: {
            data: UserType[];
            totalStudents: number;
        } = data;
        return (
            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Students
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalStudents}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DataTable
                    data={users}
                    tab={tab}
                    setRefetch={setRefetch}
                />
            </div>
        );
    };
    const renderClubs = () => {
        if (!data) return null;
        const {
            total,
            inactiveClubs,
            activeClubs,
            data: clubs,
        } = data;
        return (
            <div className="flex flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Clubs
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Clubs
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeClubs}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Inactive or Under Review Clubs
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {inactiveClubs}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DataTable
                    setRefetch={setRefetch}
                    data={clubs}
                    tab={tab}
                />
            </div>
        );
    };
    const renderContent = () => {
        switch (tab) {
            case 'students':
                return renderStudents();
            case 'clubs':
                return renderClubs();
            default:
                return (
                    <div className="flex items-center justify-center flex-col w-full h-full">
                        <h1 className="text-2xl font-bold">
                            Welcome to College Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Select a section from the sidebar
                        </p>
                    </div>
                );
        }
    };
    const renderSkeleton = () => {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
                    <div className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
                    <div className="aspect-video rounded-xl bg-muted/50 animate-pulse" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min animate-pulse" />
            </div>
        );
    };
    return (
        <SidebarProvider>
            <AppSidebar
                navMains={[
                    {
                        title: 'DashBoard',
                        url: '/admin/college',
                        icon: SquareTerminal,
                        isActive: true,
                        items: tabTypes.map((tab) => {
                            return {
                                title:
                                    tab.charAt(0).toUpperCase() +
                                    tab.slice(1),
                                url: `/admin/college?tab=${tab}`,
                            };
                        }),
                    },
                ]}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <Link href="/admin/college">
                                        College Admin Dashboard
                                    </Link>
                                </BreadcrumbItem>
                                {tab && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>
                                                {tab}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                {isDataFetching ? renderSkeleton() : renderContent()}
            </SidebarInset>
        </SidebarProvider>
    );
}

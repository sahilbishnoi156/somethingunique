import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserType, CollegeType, ClubType } from '@/types/feed.types';
import { ClubItem } from './dashboard/club-item';
import { CollegeItem } from './dashboard/college-item';
import { UserItem } from './dashboard/user-item';

export default function DataTable({
    data,
    tab,
    setRefetch,
}: {
    data: UserType[] | CollegeType[] | ClubType[];
    tab: string | null;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const renderTableHeader = () => {
        switch (tab) {
            case 'admins':
            case 'students':
                return (
                    <TableRow className="rounded-xl border-t">
                        <TableHead className="w-[100px]">
                            Sr No.
                        </TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                );
            case 'colleges':
                return (
                    <TableRow className="rounded-xl border-t">
                        <TableHead className="w-[100px]">
                            Sr No.
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                );
            case 'clubs':
                return (
                    <TableRow className="rounded-xl border-t">
                        <TableHead className="w-[100px]">
                            Sr No.
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                );
            default:
                return null;
        }
    };

    const renderTableBody = () => {
        return data.map((item, index) => {
            switch (tab) {
                case 'admins':
                case 'students':
                    return (
                        <UserItem
                            user={item as UserType}
                            serialNumber={index + 1}
                            key={item._id}
                            setRefetch={setRefetch}
                        />
                    );
                case 'colleges':
                    return (
                        <CollegeItem
                            college={item as CollegeType}
                            serialNumber={index + 1}
                            key={item._id}
                            setRefetch={setRefetch}
                        />
                    );
                case 'clubs':
                    return (
                        <ClubItem
                            club={item as ClubType}
                            serialNumber={index + 1}
                            key={item._id}
                            setRefetch={setRefetch}
                        />
                    );
                default:
                    return null;
            }
        });
    };

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
                No data available
            </div>
        );
    }

    return (
        <Table className="border rounded-xl">
            <TableHeader>{renderTableHeader()}</TableHeader>
            <TableBody>{renderTableBody()}</TableBody>
        </Table>
    );
}

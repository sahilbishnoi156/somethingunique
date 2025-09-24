import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { UserType } from '@/types/feed.types';
import { TableCell, TableRow } from '@/components/ui/table';
import { customFetch } from '@/lib/custom-fetch';
import { toast } from 'sonner';
import CopyButton from '../CopyButton';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../ui/tooltip';
import { UserToolTip } from '../show-user-tooltip';
import Link from 'next/link';

interface UserItemProps {
    user: UserType;
    serialNumber: number;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UserItem({
    user,
    serialNumber,
    setRefetch,
}: UserItemProps) {
    const handleDelete = async (userId?: string) => {
        if (!userId) return;
        if (!confirm('Are you sure you want to delete this user?'))
            return;
        if (user.role === 'super_admin') return;
        try {
            const response = await customFetch(
                `/dashboard/remove-college-admin?id=${userId}`,
                {
                    method: 'DELETE',
                }
            );
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.data || data?.message);
            }
            setRefetch((prev) => !prev);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) toast.error(error.message);
        }
    };
    return (
        <TableRow>
            <TableCell>{serialNumber}</TableCell>
            <TableCell className="flex gap-1">
                <CopyButton item={user._id || ''} />
            </TableCell>
            <TableCell>
                <Tooltip>
                    <TooltipTrigger>
                        <Link
                            href={`/profile/${user.username}`}
                            className="hover:underline"
                        >
                            {user.username}
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <UserToolTip user={user} />
                    </TooltipContent>
                </Tooltip>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
                <Badge
                    variant={
                        user.role === 'super_admin'
                            ? 'default'
                            : 'secondary'
                    }
                >
                    {user.role}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                {user.role !== 'super_admin' ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user._id)}
                        aria-label="Delete user"
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon">
                        N/A
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}

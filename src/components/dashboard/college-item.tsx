import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { CollegeType } from '@/types/feed.types';
import { TableCell, TableRow } from '@/components/ui/table';
import { customFetch } from '@/lib/custom-fetch';
import { toast } from 'sonner';
import CopyButton from '../CopyButton';

interface CollegeItemProps {
    college: CollegeType;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    serialNumber: number;
}

export function CollegeItem({
    college,
    setRefetch,
    serialNumber,
}: CollegeItemProps) {
    const handleDelete = async (collegeId?: string) => {
        if (!confirm('Are you sure you want to delete this college?'))
            return;

        try {
            const response = await customFetch(
                `/dashboard/remove-college?id=${collegeId}`,
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
                <CopyButton item={college._id || ''} />
            </TableCell>
            <TableCell>{college.name}</TableCell>
            <TableCell>{college.state}</TableCell>
            <TableCell>{college.country}</TableCell>
            <TableCell>
                {new Date(college.createdAt).toLocaleDateString() ||
                    'N/A'}
            </TableCell>
            <TableCell className="text-right">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(college?._id)}
                    aria-label="Delete college"
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </TableCell>
        </TableRow>
    );
}

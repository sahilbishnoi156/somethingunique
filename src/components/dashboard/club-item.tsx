import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ClubType, CollegeType, UserType } from '@/types/feed.types';
import { TableCell, TableRow } from '@/components/ui/table';
import { customFetch } from '@/lib/custom-fetch';
import { toast } from 'sonner';
import { ApproveClub } from './approve-club';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ClubItemProps {
    club: ClubType;
    serialNumber: number;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ClubItem({
    club,
    serialNumber,
    setRefetch,
}: ClubItemProps) {
    const [openFullDescription, setOpenFullDescription] =
        useState(false);

    const handleDelete = async (clubId?: string) => {
        if (!confirm('Are you sure you want to delete this club?'))
            return;
        try {
            const response = await customFetch(
                `/dashboard/remove-club?id=${clubId}`,
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

    const truncatedDescription = club?.description?.slice(0, 20);
    const isDescriptionLong = club?.description?.length > 20;

    return (
        <TableRow>
            <TableCell>{serialNumber}</TableCell>
            <TableCell>{club.name}</TableCell>
            <TableCell>
                {truncatedDescription}
                {isDescriptionLong && (
                    <span
                        className="text-sm text-gray-500 cursor-pointer"
                        onClick={() => setOpenFullDescription(true)}
                    >
                        ...more
                    </span>
                )}
            </TableCell>
            <TableCell>
                {typeof club.college_id === 'string'
                    ? club.college_id
                    : (club.college_id as CollegeType)?.name}
            </TableCell>
            <TableCell>
                {typeof club.admin === 'string'
                    ? club.admin
                    : (club.admin as UserType)?.username}
            </TableCell>
            <TableCell className="text-right">
                {club?.actionAuthorized ? (
                    <>
                        {club.status === 'review' && (
                            <ApproveClub
                                setRefetch={setRefetch}
                                club={club}
                            />
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(club?._id)}
                            aria-label="Delete club"
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled
                        aria-label="Action not authorized"
                    >
                        N/A
                    </Button>
                )}
            </TableCell>
            {/* Full Description Modal */}
            <Dialog
                open={openFullDescription}
                onOpenChange={setOpenFullDescription}
            >
                <></>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Full Description</DialogTitle>
                    </DialogHeader>
                    <p>{club.description}</p>
                    <DialogFooter>
                        <Button
                            onClick={() =>
                                setOpenFullDescription(false)
                            }
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TableRow>
    );
}

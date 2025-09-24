import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { customFetch } from '@/lib/custom-fetch';
import { X } from 'lucide-react';
import { ClubType } from '@/types/feed.types';

export function DisApproveClub({
    setRefetch,
    club,
}: {
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    club: ClubType;
}) {
    const [open, setOpen] = useState(false);
    const [isDisApproving, setIsDisApproving] = React.useState(false);
    const onSubmit = async () => {
        setIsDisApproving(true);
        try {
            const response = await customFetch(
                `/dashboard/remove-club?id=${club._id}`,
                {
                    method: 'DELETE',
                }
            );
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.message || data?.data?.message);
            }
            setRefetch((prev) => !prev);
            setOpen(false);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) toast.error(error.message);
        } finally {
            setIsDisApproving(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                    <X className="h-4 w-4 text-red-500" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Disapproving Club</DialogTitle>
                    <DialogDescription>
                        I here by accept that i have reviewed the club{' '}
                        <span className="text-white font-semibold">
                            &quot;{club?.name}&quot;
                        </span>{' '}
                        and it is not authentic therefore i&apos;m
                        disapproving. If any issues found i will be
                        responsible for it.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="default"
                        onClick={onSubmit}
                        disabled={isDisApproving}
                        className="w-full"
                    >
                        {isDisApproving
                            ? 'Disapproving...'
                            : 'Disapprove'}
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => setOpen(false)}
                        className="w-full"
                        disabled={isDisApproving}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

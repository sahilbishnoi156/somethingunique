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
import { Check } from 'lucide-react';
import { ClubType } from '@/types/feed.types';

export function ApproveClub({
    setRefetch,
    club,
}: {
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
    club: ClubType;
}) {
    const [open, setOpen] = useState(false);
    const [isApproving, setIsApproving] = React.useState(false);
    const onSubmit = async () => {
        setIsApproving(true);
        try {
            const response = await customFetch(
                '/dashboard/approve-club',
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        clubId: club._id,
                    }),
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
            setIsApproving(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'icon'} variant={'ghost'}>
                    <Check className="h-4 w-4 text-green-500" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approving Club</DialogTitle>
                    <DialogDescription>
                        I here by accept that i have reviewed the club{' '}
                        <span className="text-white font-semibold">
                            &quot;{club?.name}&quot;
                        </span>{' '}
                        and i am approving it. If any issues found i
                        will be responsible for it.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="default"
                        onClick={onSubmit}
                        disabled={isApproving}
                        className="w-full"
                    >
                        {isApproving ? 'Approving...' : 'Approve'}
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => setOpen(false)}
                        className="w-full"
                        disabled={isApproving}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

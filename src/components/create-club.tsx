import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { customFetch } from '@/lib/custom-fetch';
import { CollegeType } from '@/types/feed.types';
import { toast } from 'sonner';

const clubSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters'),
    college_id: z.string().min(1, 'Please select a college'),
});

type ClubFormValues = z.infer<typeof clubSchema>;

export function CreateClubDialog({
    college,
}: {
    college: CollegeType;
}) {
    const [open, setOpen] = React.useState(false);
    const form = useForm<ClubFormValues>({
        resolver: zodResolver(clubSchema),
        defaultValues: {
            name: '',
            description: '',
            college_id: college?._id || '',
        },
    });

    async function onSubmit(values: ClubFormValues) {
        try {
            const response = await customFetch('/auth/add-club', {
                method: 'POST',
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.data || data?.message);
            }
            toast.success(
                "We have received your request. We'll review it and get back to you soon."
            );
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) toast.error(error.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Register</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Club</DialogTitle>
                    <DialogDescription>
                        Add a new club to the system. Fill in the
                        details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter club name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter club description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>College</FormLabel>
                            <FormControl>
                                <Input
                                    defaultValue={
                                        college?.name || 'Loading...'
                                    }
                                    className={`${
                                        !college && 'animate-bounce'
                                    }`}
                                    disabled
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={college === undefined}
                            >
                                Create Club
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

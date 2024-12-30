import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { customFetch } from '@/lib/custom-fetch';

const collegeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z
        .string()
        .min(2, 'Country must be at least 2 characters'),
});

type CollegeFormValues = z.infer<typeof collegeSchema>;

export function CreateCollegeDialog({
    setRefetch,
}: {
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [open, setOpen] = React.useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const form = useForm<CollegeFormValues>({
        resolver: zodResolver(collegeSchema),
        defaultValues: {
            name: '',
            city: '',
            state: '',
            country: '',
        },
    });

    const onSubmit = async (values: CollegeFormValues) => {
        setIsSaving(true);
        try {
            const response = await customFetch(
                '/dashboard/add-college',
                {
                    method: 'POST',
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data?.data || data?.message);
            }
            setRefetch((prev) => !prev);
            setOpen(false);
            form.reset();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) toast.error(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size={'lg'}
                    className="w-fit"
                >
                    Add College
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create College</DialogTitle>
                    <DialogDescription>
                        Add a new college to the system. Fill in the
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
                            disabled={isSaving}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter college name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            disabled={isSaving}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter city"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            disabled={isSaving}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter state"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            disabled={isSaving}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter country"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving
                                    ? 'Creating...'
                                    : 'Create College'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

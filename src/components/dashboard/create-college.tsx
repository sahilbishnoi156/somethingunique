import React, { useEffect, useState } from 'react';
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
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    country: z
        .string()
        .min(2, 'Country must be at least 2 characters'),
    key: z.string().min(2, 'Key must be at least 2 characters'),
});

type CollegeFormValues = z.infer<typeof collegeSchema>;

export function CreateCollegeDialog({
    setRefetch,
}: {
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [open, setOpen] = React.useState(false);
    const [generatedKey, setGeneratedKey] = useState<string | null>(
        null
    );
    const form = useForm<CollegeFormValues>({
        resolver: zodResolver(collegeSchema),
        defaultValues: {
            name: '',
            city: '',
            state: '',
            country: '',
            key: '',
        },
    });

    // Function to dynamically generate the key
    const generateKey = (
        name: string,
        city: string,
        state: string,
        country: string
    ) => {
        return `${name
            .toUpperCase()
            .replace(/\s+/g, '')
            .slice(0, 3)}-${city
            .toUpperCase()
            .slice(0, 2)
            .replace(/\s+/g, '')}-${state
            .toUpperCase()
            .slice(0, 2)
            .replace(/\s+/g, '')}-${country
            .toUpperCase()
            .slice(0, 2)
            .replace(/\s+/g, '')}`;
    };

    useEffect(() => {
        const { name, city, state, country } = form.getValues();
        // Only generate the key if all required fields have values
        if (name && city && state && country) {
            const key = generateKey(name, city, state, country);
            setGeneratedKey(key);
            form.setValue('key', key); // Update the form key value
        } else {
            setGeneratedKey(null); // Reset key if any field is missing
            form.setValue('key', ''); // Reset form key value
        }
    }, [form]);

    const onSubmit = async (values: CollegeFormValues) => {
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
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-fit">
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

                        <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Key</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Generated college key"
                                            {...field}
                                            disabled // Disable key field since it is generated automatically
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={!generatedKey}
                            >
                                Create College
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

import React from 'react';
import { Button } from '../ui/button';
import LogoutButton from '../auth/logout-button';
import { redirect, useRouter } from 'next/navigation';
import { parseJwt } from '@/lib/jwt';
import { customFetch } from '@/lib/custom-fetch';
import { toast } from 'sonner';

export default function AccountSetting() {
    React.useEffect(() => {
        const token = window?.localStorage.getItem('authToken');
        if (!token) {
            redirect('/register');
        } else {
            const data = parseJwt(token);
            setEmail(data.user.email || '');
        }
    }, []);

    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [deleteAccountConfirmed, setDeleteAccountConfirmed] =
        React.useState(false);

    const handleDeleteAccountConfirmation = () => {
        setDeleteAccountConfirmed(true);
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await customFetch('/auth/delete-user', {
                method: 'DELETE',
            });
            if (response.ok) {
                window?.localStorage.removeItem('authToken');
                toast.success('Bye bye! We will miss you.');
                router.push('/login');
            }

            const data = await response.json();
            throw new Error(
                data?.message ||
                    data?.data?.data ||
                    'Failed to delete account'
            );
        } catch (error) {
            console.error(error);
            if (error instanceof Error) toast.error(error.message);
        }
    };

    return (
        <div className="col-span-8 overflow-hidden rounded-xl sm:bg-secondary dark:sm:bg-secondary/30 sm:px-8 sm:shadow py-6">
            <h1 className="text-2xl font-semibold">
                Account Settings
            </h1>
            <hr className="mt-4 mb-8" />
            {/* Email Section */}
            <p className="py-2 text-xl font-semibold ">
                Email Address (Can&apos;t be changed)
            </p>
            <div className="relative mt-4">
                <input
                    type="email"
                    id="hs-floating-input-email-value"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2 bg-background"
                    placeholder="you@email.com"
                    value={email}
                    disabled
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label
                    htmlFor="hs-floating-input-email-value"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90  peer-focus:translate-x-0.5  peer-focus:-translate-y-1.5  peer-focus:text-gray-500 dark:peer-focus:text-neutral-500  peer-[:not(:placeholder-shown)]:scale-90  peer-[:not(:placeholder-shown)]:translate-x-0.5  peer-[:not(:placeholder-shown)]:-translate-y-1.5  peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral  "
                >
                    Email
                </label>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1">
                <p className="text-gray-600">
                    Not bad! At least it’s not{' '}
                    <em>supercoolguy2009@hotmail.com</em>, right?
                </p>
            </div>
            <hr className="mt-4 mb-8" />
            {/* Logout Section */}
            <p className="py-2 text-xl font-semibold">
                Logout Account
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1">
                <p className="my-2">
                    Need a break? Hit logout and take a breather.
                    We’ll miss you… probably.
                </p>
                <LogoutButton variant="destructive">
                    Logout
                </LogoutButton>
            </div>

            <hr className="mt-4 mb-8" />
            {/* Delete Account Section */}
            <p className="py-2 text-xl font-semibold">
                Delete Account
            </p>
            <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
                Warning: This is the point of no return!
            </p>
            <p className="mt-2">
                Are you sure about this? Once you delete your account,
                it’s gone. Like,
                <em>really</em> gone. Make sure you’ve backed up
                anything important. We’re talking no “Oops, I didn’t
                mean to” moments here.
            </p>
            {deleteAccountConfirmed ? (
                <Button
                    onClick={handleDeleteAccount}
                    variant="destructive"
                    className="mt-2"
                >
                    Confirm Deletion (No Turning Back)
                </Button>
            ) : (
                <button
                    onClick={handleDeleteAccountConfirmation}
                    className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2"
                >
                    Continue with deletion (gulp)
                </button>
            )}
        </div>
    );
}

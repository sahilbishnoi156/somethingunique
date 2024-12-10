import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { customFetch } from '@/lib/custom-fetch';
import { UserType } from '@/types/feed.types';
import Loader from '../loader';
import ShowProfilePicture from './showPfp';

export default function AccountSetting() {
    const [user, setUser] = React.useState<UserType>();
    const [isFetching, setIsFetching] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await customFetch('/user/get-user', {
                    method: 'GET',
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data?.data.message);
                }
                setUser(data.data);
                setIsFetching(false);
            } catch (error) {
                console.error(error);
                setIsFetching(false);
            }
        };
        fetchData();
    }, []);
    if (isFetching) {
        <div className="col-span-8 overflow-hidden rounded-xl sm:bg-secondary dark:sm:bg-secondary/30 sm:px-8 sm:shadow py-6">
            <h1 className="text-2xl font-semibold">Epic Profile!</h1>
            <hr className="mt-4 mb-8" />
            <div className="w-full items-center justify-center">
                <Loader />
            </div>
        </div>;
    }
    return (
        <div className="col-span-8 overflow-hidden rounded-xl sm:bg-secondary dark:sm:bg-secondary/30 sm:px-8 sm:shadow py-6">
            <h1 className="text-2xl font-semibold">Epic Profile!</h1>
            <hr className="mt-4 mb-8" />
            <ShowProfilePicture user={user} />

            <hr className="mt-4 mb-8" />
            {/* Email Section */}
            <p className="py-2 text-xl font-semibold ">
                Your Legendary Username
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 gap-5">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        id="hs-floating-input-email-value"
                        className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600 focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2 bg-background"
                        placeholder="your_epic_username"
                        defaultValue={user?.username}
                        disabled
                    />
                    <label
                        htmlFor="hs-floating-input-email-value"
                        className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:scale-90  peer-focus:translate-x-0.5  peer-focus:-translate-y-1.5  peer-focus:text-gray-500 dark:peer-focus:text-neutral-500  peer-[:not(:placeholder-shown)]:scale-90  peer-[:not(:placeholder-shown)]:translate-x-0.5  peer-[:not(:placeholder-shown)]:-translate-y-1.5  peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral  "
                    >
                        Username
                    </label>
                </div>

                <Link href={'/settings/updateusername'}>
                    <Button className="py-6">Try Mythical</Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1">
                <p className="text-gray-600">
                    Not bad! Could’ve been worse... like{' '}
                    <em>xxDragonSlayer99xx</em>, right?
                </p>
            </div>
        </div>
    );
}

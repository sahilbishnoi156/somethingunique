'use client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AccountSetting from '@/components/settings/account-setting';
import EditProfile from '@/components/settings/edit-profile';
import Themes from '@/components/settings/themes'; // New component
import { useState } from 'react';
import BackButton from '@/components/back-button';

const SETTINGS_COMPONENTS = {
    account: AccountSetting,
    profile: EditProfile,
    themes: Themes,
};

export default function SettingsPage() {
    const [selectedComponentKey, setSelectedComponentKey] =
        useState<keyof typeof SETTINGS_COMPONENTS>('account');

    const SelectedComponent =
        SETTINGS_COMPONENTS[selectedComponentKey];

    return (
        <div className="flex flex-col min-h-screen  px-4 sm:px-8">
            <div className="flex gap-5 items-center w-full border-b ">
                <BackButton variant="secondary" />
                <h1 className="py-6 text-4xl font-semibold">
                    Settings
                </h1>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-10 gap-6 pt-6">
                {/* Sidebar Navigation for Large Screens */}
                <div className="hidden sm:block col-span-2">
                    <ul className="space-y-4">
                        {Object.keys(SETTINGS_COMPONENTS).map(
                            (key) => (
                                <li
                                    key={key}
                                    className={`cursor-pointer px-4 py-2 text-lg rounded-md transition ${
                                        selectedComponentKey === key
                                            ? 'bg-primary text-secondary'
                                            : 'bg-secondary text-primary hover:bg-foreground/20'
                                    }`}
                                    onClick={() =>
                                        setSelectedComponentKey(
                                            key as keyof typeof SETTINGS_COMPONENTS
                                        )
                                    }
                                >
                                    {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
                                </li>
                            )
                        )}
                    </ul>
                </div>

                {/* Select Dropdown for Small Screens */}
                <div className="sm:hidden col-span-full">
                    <Select
                        value={selectedComponentKey}
                        onValueChange={(value) =>
                            setSelectedComponentKey(
                                value as keyof typeof SETTINGS_COMPONENTS
                            )
                        }
                    >
                        <SelectTrigger className="w-full bg-gray-100 text-gray-800 border border-gray-300">
                            <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(SETTINGS_COMPONENTS).map(
                                (key) => (
                                    <SelectItem key={key} value={key}>
                                        {key.charAt(0).toUpperCase() +
                                            key.slice(1)}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Main Content */}
                <div className="col-span-8 sm:col-span-8">
                    <SelectedComponent />
                </div>
            </div>
        </div>
    );
}

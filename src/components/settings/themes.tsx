import React from 'react';
import { ModeToggle } from '../toggle-theme';
import { Button } from '../ui/button';

export default function EditProfile() {
    return (
        <div className="col-span-8 overflow-hidden rounded-xl sm:bg-secondary dark:sm:bg-secondary/30 sm:px-8 sm:shadow py-6">
            <h1 className="text-2xl font-semibold">🎨 Themes</h1>
            <hr className="mt-4 mb-8" />

            {/* Toggle Mode Section */}
            <p className="py-2 text-xl font-semibold">
                🌗 Toggle Mode
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-600">
                    Flip the switch between light mode (happy vibes)
                    and dark mode (mysterious coolness).
                </p>
                <ModeToggle />
            </div>
            <hr className="mt-4 mb-8" />

            {/* Themes Section */}
            <p className="py-2 text-xl font-semibold">🎭 Themes</p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-gray-600">
                    Psst... Custom themes are in the works! Soon,
                    you&apos;ll be able to pick a theme that matches
                    your style.
                </p>
                <Button disabled>Coming Soon 🚀</Button>
            </div>
        </div>
    );
}

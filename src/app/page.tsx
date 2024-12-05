import { ModeToggle } from '@/components/toggle-theme';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function page() {
    return (
        <div>
            <ModeToggle />
            <Button>Button</Button>
        </div>
    );
}

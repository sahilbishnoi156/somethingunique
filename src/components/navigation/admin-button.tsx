import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const AdminButton = ({ role }: { role?: string }) => {
    if (role === 'super_admin' || role === 'college_admin') {
        return (
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={'/admin'}>
                            <Button
                                variant="secondary"
                                size={'lg'}
                                className="h-12 rounded-xl w-full"
                            >
                                <ShieldCheck />
                                <div className="sm:hidden block">
                                    Admin
                                </div>
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Admin DashBoard</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    } else {
        return null;
    }
};

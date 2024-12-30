'use client';
import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './ui/popover';
import { Check, CopyIcon } from 'lucide-react';

export default function CopyButton({ item }: { item: string }) {
    const [isCopied, setIsCopied] = React.useState(false);

    return (
        <Popover>
            <PopoverTrigger
                onClick={() => {
                    navigator.clipboard.writeText(item);
                    setIsCopied(true);
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 2000);
                }}
                className="flex items-center justify-center rounded-lg border p-2 transition-all hover:bg-slate-600 hover:text-white"
            >
                {isCopied ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <CopyIcon className="h-4 w-4" />
                )}
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <p className="p-2 text-xs">ID Copied</p>
            </PopoverContent>
        </Popover>
    );
}

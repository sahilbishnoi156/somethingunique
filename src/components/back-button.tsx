'use client';
import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { MoveLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackButton({
    className,
    variant = 'default',
}: {
    className?: string;
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
        | null
        | undefined;
}) {
    const router = useRouter();
    return (
        <Button
            variant={variant || 'ghost'}
            className={cn('', className)}
            onClick={() => router.back()}
        >
            <MoveLeft size={15} />
            <span>Back</span>
        </Button>
    );
}

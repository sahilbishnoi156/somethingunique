'use client';
import { redirect } from 'next/navigation';

export default function Page() {
    redirect('/app/feed?type=forum');
}

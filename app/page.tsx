'use client';

import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default function Page() {
    const router = useRouter();

    const handleStart = () => {
        router.push('/dashboard');
    };

    return <LandingPage onStart={handleStart} />;
}

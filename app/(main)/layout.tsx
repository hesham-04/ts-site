'use client';

import {useConvexAuth} from "convex/react";
import {Spinner} from "@/components/spinner";
import {redirect} from "next/navigation";

const MainLaout = (
    { children } : { children: React.ReactNode; }
) => {
    const { isAuthenticated, isLoading } = useConvexAuth()

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size='md'/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return  redirect('/');
    }

    return (
        <div className="h-full flex dark:bg-[1F1F1F]">
            <main className='h-full flex-1 overflow-y-auto'>
                {children}
            </main>
        </div>
    );
}

export default MainLaout;
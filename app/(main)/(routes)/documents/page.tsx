'use client';

import Image from 'next/image'
import {useUser} from '@clerk/clerk-react'
import {Button} from '@/components/ui/button';
import {PlusCircleIcon} from "lucide-react";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api"

import {toast} from "sonner"

const DocumentsPage = () => {
    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({ title: 'Untitled Document' });

        toast.promise(promise, {
            loading: 'Creating document...',
            success: 'Document created!',
            error: 'Failed to create document.'
        })
    }
    return (
        <div className='h-full flex flex-col items-center justify-center space-y-4'>
            <Image src='/enter-light.png' height={300} width={300} alt='enter' priority quality={80} className='dark:hidden ' />
            <Image src='/enter-light.png' height={300} width={300} alt='enter' priority quality={80} className='hidden dark:block' />
            <h2 className='text-lg font-medium'>
                Welcome to {user?.firstName}&apos;s Trojan!
            </h2>

            <Button variant='default' className='ml-4' onClick={onCreate}>
                <PlusCircleIcon className='h-4 w-4 mr-2' />
                Create a note
            </Button>

        </div>
        );
}

export default DocumentsPage;
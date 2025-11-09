'use client';

import {TrashIcon, ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, PlusIcon} from "lucide-react";
import {Id} from "@/convex/_generated/dataModel";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api"
import {useRouter} from "next/navigation";
import {useUser} from "@clerk/clerk-react";
import {toast} from "sonner";
import React from "react";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem} from "@/components/ui/dropdown-menu";

interface ItemProps {
    id?: Id<'documents'>;
    docmuentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    onExpand?: () => void;
    level?: number;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}

export const Item = ({id, active, docmuentIcon, isSearch, level=0, onExpand, expanded, label, onClick, icon:Icon}:ItemProps) => {
    const ChevronIcon = expanded ? ChevronDown :ChevronRight
    const create = useMutation(api.documents.create);
    const {user} = useUser();
    const router = useRouter();

    const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onExpand?.();
    }

    const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (!id) return;
        const promise = create({title: 'Untitled', parentDocumentId: id}).then((documentId) => {
            if (!expanded) {
                onExpand?.();
            }
            // router.push(`/documents/${documentId}`);
        })
        toast.promise(promise, {
            loading: 'Creating document...',
            success: 'Document created',
            error: 'Failed to create document',
        });
    }
    return (
        <div onClick={onClick} role='button' style={{paddingLeft: level ? `${(level * 12) + 12}px` : '12px'}} className={cn('group min-h-[27px] text-sm py-1  pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium', active && 'bg-primary/5 text-primary')}>
            {!!id && (
                <div role='button' className='h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1' onClick={handleExpand}>
                    <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50'/>
                </div>
            )}
            {docmuentIcon? (
                <div className='shrink-0 mr-2 text-[18px]'>
                    {docmuentIcon}
                </div>
            ) : (
                <Icon className='shrink-0 h-[18px] mr-2 text-muted-foreground'/>
            )}
            <span className='truncate '>
                 {label}
            </span>
            {isSearch && (
                <kbd className='ml-auto pointer-events-none  inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground'>
                    <span className='text-xs'>
                        ⌘ + P
                    </span>
                </kbd>
            )}
            {!!id && (
                <div className='ml-auto flex items-center gap-x-2'>
                    {/*The dropdown menu*/}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <div role='button' className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'>
                                <MoreHorizontal className='h-4 w-4 text-muted-foreground'/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-60' align='start' side='right' forceMount>
                            <DropdownMenuItem onClick={() => {}}>
                                <TrashIcon className='h-4 w-4 mr-2 text-red-500'/> Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className='text-xs text-muted-foreground p-2'>
                                Last edited by {user?.firstName} { user?.emailAddresses[0]?.emailAddress}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/*The add child plus + button*/}
                    <div className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600' role='button' onClick={onCreate}>
                        <PlusIcon className='h-4 w-4 text-muted-foreground '/>
                    </div>
                </div>
            )}

        </div>
    )
}

Item.Skeleton = function ItemSkeleton({level}:{level?:number}) {
    return(
        <div style={{paddingLeft: level ? `${(level * 12) +25}px`: '12px' }} className='flex gap-x-2 py-[3px]'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-[30%]' />
        </div>
    )
}
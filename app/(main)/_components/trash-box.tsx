'use client';

import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api"
import {Id} from "@/convex/_generated/dataModel";

import {useState} from 'react';
import React from "react";
import {toast} from "sonner";
import {Spinner} from "@/components/spinner";
import {Input} from "@/components/ui/input";
import {Search, Trash, Undo} from "lucide-react";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getArchivedDocuments);
    const restore = useMutation(api.documents.restoreArchivedDocument);
    const remove = useMutation(api.documents.deleteDocument);

    const [search, setSearch] = useState("");
    const filteredDocuments = documents?.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase()) // 4:14 in video
    ) || [];

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    const onRestore= (e: React.MouseEvent<HTMLDivElement, MouseEvent>, documentId: Id<'documents'> ) => {
        e.stopPropagation();
        const promise = restore({documentId});
        toast.promise(promise, {
            loading: "Restoring document...",
            success: "Document restored!",
            error: "Failed to restore document."
        })
    }

    const onDelete = (documentId: Id<'documents'> ) => {
        const promise = remove({documentId});
        toast.promise(promise, {
            loading: "Deleting document...",
            success: "Document deleted!",
            error: "Failed to delete document."
        })

        if (params.documentId === documentId.toString()) {
            router.push(`/documents`);
        }

    }

    if (!documents) {
        return (
            <div className='h-full flex items-center justify-center p-6 m-4'>
                <Spinner size='lg' />
                <p>Loading Documents...</p>
            </div>
        );
    }

    return (
        <div className='text-sm'>
            <div className='flex items-center gap-x-1 p-2 '>
                <Search className='h-4 w-4 me-1'/>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} className='h-7 px-2 focus-visible:ring-transparent bg-secondary' placeholder='Filter by page title...' />
            </div>
            <div className='mt-2 px-1 pb-3 max-h-80 overflow-y-auto'>
                <p className='hidden last:block text-xs text-center text-muted-foreground'>No documents found</p>
                {filteredDocuments?.map((document) => (
                    <div key={document._id} role="button" onClick={() => onClick(document._id)} className="group flex w-full items-center justify-between rounded-sm text-sm gap-x-1">
                        <div className="flex-1 truncate pl-2 py-2 rounded-sm group-hover:bg-primary/5">
                            {document.title || "Untitled Document"}
                        </div>
                        <div className="flex items-center">
                            <div onClick={(e) => onRestore(e, document._id)} role="button" className="p-2 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-700">
                                <Undo className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <div onClick={(e) => {e.stopPropagation(); onDelete(document._id);}} role="button" className="p-2 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-700">
                                <Trash className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}
'use client';

import {ChevronsLeft, MenuIcon, PlusCircle, Search, Settings} from "lucide-react";
import React, {ElementRef, useEffect, useRef, useState} from "react";
import {useMediaQuery} from "usehooks-ts";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {UserItem} from './user-item';
import {Item} from "./item";
import {DocumentList} from "./documents-list";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api"
import {toast} from "sonner";




export const Navigation = () => {
    const pathname = usePathname();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const create = useMutation(api.documents.create);

    const isResizingRef = useRef(false);
    const sidebarRef = useRef< ElementRef<'aside'>>(null);
    const navbarRef = useRef<ElementRef<'div'>>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            restWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;

        if (newWidth < 250) newWidth = 250;
        if (newWidth > 600) newWidth = 600;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const restWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? `100%` : `240px`;
            navbarRef.current.style.setProperty("width", isMobile ? `0px` : `100% - 240px`);
            navbarRef.current.style.setProperty("left", isMobile ? `100px` : `240px`);
            setTimeout(() => setIsResetting(false), 300);

        }
    }

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = `0px`;
            navbarRef.current.style.setProperty("width", `100%`);
            navbarRef.current.style.setProperty("left", `0px`);
            setTimeout(() => setIsResetting(false), 300);

        }
    }

    const handleCreate  = () => {
        const promise = create ({ title: 'Untitled Document' });
        toast.promise(promise, {
            loading: 'Creating document...',
            success: 'Document created!',
            error: 'Failed to create document.'
        })
    }

return (
    <>
        <aside ref={sidebarRef} className={cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999] pointer-events-auto", isResetting && "transition-all duration-300 ease-in-out", isMobile && "w-0 pointer-events-none")}>
            <div onClick={collapse} role="button" className={cn("absolute top-2" +
                " right-2 h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 opacity-0 group-hover/sidebar:opacity-100 transition", isMobile && "opacity-100")}>
                  <ChevronsLeft className="h-6 w-6" /> {isMobile}
            </div>

            <div>
                <UserItem />
                <Item onClick={handleCreate} label='New page'  icon={PlusCircle}/>
                <Item label='Search' icon={Search} isSearch onClick={() => {}} />
                <Item label='Settings' icon={Settings}  onClick={() => {}} />
            </div>

            <div className="mt-4">
                <DocumentList />
            </div>
            <div onMouseDown={handleMouseDown} onClick={restWidth} className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
        </aside>

    <div ref={navbarRef} className={cn("absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]", isResetting && "transition-all duration-300 ease-in-out", isMobile && "left-0 w-full")}>
        <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && <MenuIcon onClick={restWidth} role='button' className='h-6 2-6 text-muted-foreground' />}
        </nav>
    </div>
    </>

  );
};
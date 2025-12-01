"use client";

import { useEffect, useState } from "react";
import { File } from 'lucide-react';
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useSearch  } from "@/hooks/use-search";


import {
    CommandDialog,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup
} from "@/components/ui/command";

export const SearchCommand = () => {
    const {user} = useUser();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const documents = useQuery();
}
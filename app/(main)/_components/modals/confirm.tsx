'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface ConfirmModalProps {
    childern?: React.ReactNode;
    onConfirm: () => void;
}

export const ConfirmModal = ({childern, onConfirm}: ConfirmModalProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
                {childern}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Please confirm if you want to proceed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.stopPropagation(); onConfirm(); }}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className={`relative w-full ${maxWidth} transform overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-2xl transition-all flex flex-col max-h-[90vh]`}>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-border-dark px-6 py-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    <div className="text-slate-600 dark:text-slate-300 [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-slate-900 [&>h4]:dark:text-white [&>h4]:mb-3 [&>h4]:mt-6 [&>h4:first-child]:mt-0 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>li]:mb-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

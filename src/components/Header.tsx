import React from 'react';

interface HeaderProps {
    title: string;
    children?: React.ReactNode;
}

export default function Header({ title, children }: HeaderProps) {
    return (
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-8 py-4 md:py-0 md:h-16 border-b border-card-dark bg-background-dark/95 backdrop-blur z-20 sticky top-0">
            <div className="flex items-center gap-4">
                <h2 className="text-white text-lg font-bold tracking-tight">{title}</h2>
            </div>
            {children && (
                <div className="w-full md:w-auto">
                    {children}
                </div>
            )}
        </header>
    );
}

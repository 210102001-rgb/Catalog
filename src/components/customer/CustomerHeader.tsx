import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface CustomerHeaderProps {
    title: string;
    showSearch?: boolean;
    onSearch?: (query: string) => void;
    onCartClick?: () => void;
    onNotifClick?: () => void;
    onLogoutClick?: () => void;
}

export default function CustomerHeader({
    title,
    showSearch = false,
    onSearch,
    onCartClick,
    onNotifClick,
    onLogoutClick
}: CustomerHeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-background-dark/95 backdrop-blur-xl z-30 sticky top-0">
            <div className="flex items-center gap-4">
                <h1 className="text-white text-lg font-black tracking-tight">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
                {showSearch && (
                    <div className="hidden md:flex relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5a718a] text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Cari..."
                            className="bg-[#111a22] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary transition-all w-48 lg:w-64"
                            onChange={(e) => onSearch?.(e.target.value)}
                        />
                    </div>
                )}

                <div className="flex items-center gap-1 md:gap-2 pr-2 md:border-r border-white/5">
                    <button
                        onClick={onCartClick}
                        className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-[#92adc9] hover:text-white hover:bg-primary/20 transition-all relative border border-white/5 md:border-transparent"
                    >
                        <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                        <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-background-dark font-black">2</span>
                    </button>
                    <button
                        onClick={onNotifClick}
                        className="size-10 flex items-center justify-center rounded-xl bg-white/5 text-[#92adc9] hover:text-white hover:bg-orange-500/20 transition-all border border-white/5 md:border-transparent relative"
                    >
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-background-dark"></span>
                    </button>
                </div>

                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 pl-2 group"
                    >
                        <div className="flex flex-col items-end hidden lg:flex">
                            <p className="text-white text-sm font-bold leading-none">Customer User</p>
                        </div>
                        <div className="size-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 p-0.5 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
                            <div className="w-full h-full rounded-[10px] bg-[#111a22] flex items-center justify-center text-white font-black text-xs">CU</div>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-3 w-64 bg-[#1a2633] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="px-4 py-3 border-b border-white/5 mb-2">
                                <p className="text-white font-bold mb-0.5">Customer User</p>
                                <p className="text-[#92adc9] text-xs">customer@email.com</p>
                            </div>
                            <Link href="/customer/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#92adc9] hover:text-white hover:bg-white/5 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span> Profil Saya
                            </Link>
                            <Link href="/customer/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#92adc9] hover:text-white hover:bg-white/5 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">settings</span> Pengaturan
                            </Link>
                            <div className="h-px bg-white/5 my-2 mx-4"></div>
                            <button
                                onClick={() => {
                                    setIsProfileOpen(false);
                                    onLogoutClick?.();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span> Keluar Akun
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

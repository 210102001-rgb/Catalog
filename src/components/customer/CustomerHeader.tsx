import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

interface CustomerHeaderProps {
  title: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onNotifClick?: () => void;
  onLogoutClick?: () => void;
}

export default function CustomerHeader({ title, showSearch = false, onSearch, onCartClick, onNotifClick, onLogoutClick }: CustomerHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

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
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-[#324d67] bg-background-dark/95 backdrop-blur-xl z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <h1 className="text-white text-base font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="hidden md:flex relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Cari..."
              className="bg-[#111a22] border border-[#324d67] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all w-48 lg:w-64 placeholder-gray-500"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}

        <div className="flex items-center gap-1 md:gap-2 pr-2 md:border-r border-[#324d67]">
          <button onClick={onCartClick} className="size-9 flex items-center justify-center rounded-lg bg-[#1a2633] text-gray-400 hover:text-white border border-[#324d67] relative transition-all">
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span className="absolute -top-1.5 -right-1.5 size-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">2</span>
          </button>
          <button onClick={onNotifClick} className="size-9 flex items-center justify-center rounded-lg bg-[#1a2633] text-gray-400 hover:text-white border border-[#324d67] relative transition-all">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2 right-2.5 size-2 bg-red-500 rounded-full border border-[#1a2633]"></span>
          </button>
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 pl-2 group">
            <div className="flex flex-col items-end hidden lg:flex">
              <p className="text-white text-sm font-bold leading-none">{loading ? "Loading..." : user ? user.name : "Customer User"}</p>
            </div>
            <div className="size-9 rounded-lg border border-[#324d67] p-0.5 group-hover:border-primary transition-all">
              <div className="w-full h-full rounded-[6px] bg-[#111a22] flex items-center justify-center text-gray-300 font-bold text-xs">
                {loading ? "CU" : user ? user.name.charAt(0).toUpperCase() + (user.name.split(" ").length > 1 ? user.name.split(" ").pop()?.charAt(0).toUpperCase() : "") : "CU"}
              </div>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-[#1a2633] border border-[#324d67] rounded-xl shadow-xl py-1 z-50">
              <div className="px-4 py-3 border-b border-[#324d67] mb-1">
                <p className="text-white font-bold mb-0.5 text-sm">{loading ? "Loading..." : user ? user.name : "Customer User"}</p>
                <p className="text-gray-500 text-xs">{loading ? "Loading..." : user ? user.email : "customer@email.com"}</p>
              </div>
              <Link href="/customer/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#233648] transition-colors">
                <span className="material-symbols-outlined text-[18px]">person</span> Profil Saya
              </Link>
              <Link href="/customer/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#233648] transition-colors">
                <span className="material-symbols-outlined text-[18px]">settings</span> Pengaturan
              </Link>
              <div className="h-px bg-[#324d67] my-1 mx-4"></div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogoutClick?.();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Keluar Akun
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

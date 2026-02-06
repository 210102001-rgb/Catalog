import React, { useState } from "react";
import Sidebar from "../Sidebar";
import LogoutModal from "./modals/LogoutModal";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: string;
}

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, loading } = useAuth();

  const navSections = [
    {
      items: [
        { href: "/admin/dashboard", icon: "grid_view", label: "Dashboard", active: activePage === "dashboard" },
        { href: "/admin/products", icon: "inventory_2", label: "Kelola Produk", active: activePage === "products" },
        { href: "/admin/orders", icon: "shopping_cart", label: "Kelola Pesanan", active: activePage === "orders" },
        { href: "/admin/chat", icon: "chat_bubble", label: "Chat & Penawaran", badge: 5, active: activePage === "chat" },
        { href: "/admin/customers", icon: "group", label: "Data Customer", active: activePage === "customers" },
        { href: "/admin/reports", icon: "analytics", label: "Laporan & Rekap", active: activePage === "reports" },
      ],
    },
    {
      title: "System",
      items: [
        { href: "/admin/settings", icon: "settings", label: "Pengaturan", active: activePage === "settings" },
        {
          href: "#",
          icon: "logout",
          label: "Keluar",
          active: false,
          onClick: () => setIsLogoutModalOpen(true),
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar title="ReklameKu" subtitle={loading ? "Loading..." : user?.role === "admin" ? "Admin Console" : "Console"} sections={navSections} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-900">
        {/* Mobile Header Bar - Sticky & Compact */}
        <div className="md:hidden sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="text-gray-300 hover:text-white hover:bg-gray-800 p-1.5 rounded-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <span className="text-white font-semibold text-lg tracking-tight">ReklameKu</span>
          </div>
          {/* Optional: Add user avatar or simple action here if needed */}
        </div>

        {/* Main Content Area - Wrapper */}
        <div className="flex-1 flex flex-col relative min-w-0 min-h-0">
          {children}
        </div>
      </div>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </div>
  );
}

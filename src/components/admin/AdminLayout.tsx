import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import LogoutModal from './modals/LogoutModal';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: string;
}

export default function AdminLayout({ children, activePage }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const navSections = [
        {
            items: [
                { href: '/admin/dashboard', icon: 'grid_view', label: 'Dashboard', active: activePage === 'dashboard' },
                { href: '/admin/products', icon: 'inventory_2', label: 'Kelola Produk', active: activePage === 'products' },
                { href: '/admin/orders', icon: 'shopping_cart', label: 'Kelola Pesanan', active: activePage === 'orders' },
                { href: '/admin/chat', icon: 'chat_bubble', label: 'Chat & Penawaran', badge: 5, active: activePage === 'chat' },
                { href: '/admin/customers', icon: 'group', label: 'Data Customer', active: activePage === 'customers' },
                { href: '/admin/reports', icon: 'analytics', label: 'Laporan & Rekap', active: activePage === 'reports' },
            ],
        },
        {
            title: 'System',
            items: [
                { href: '/admin/settings', icon: 'settings', label: 'Pengaturan', active: activePage === 'settings' },
                {
                    href: '#',
                    icon: 'logout',
                    label: 'Keluar',
                    active: false,
                    onClick: () => setIsLogoutModalOpen(true)
                },
            ],
        },
    ];

    return (
        <div className="flex h-screen w-full relative">
            <Sidebar
                title="ReklameKu"
                subtitle="Admin Console"
                sections={navSections}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header Bar - Only visible on mobile */}
                <div className="md:hidden bg-[#111a22] border-b border-[#233648] p-4 flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="text-white font-bold text-lg">ReklameKu</span>
                </div>

                {/* Main Content Area */}
                {children}
            </div>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
            />
        </div>
    );
}

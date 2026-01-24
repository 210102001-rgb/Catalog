import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import CustomerHeader from './CustomerHeader';
import CartModal from './modals/CartModal';
import NotificationModal from './modals/NotificationModal';
import LogoutModal from './modals/LogoutModal';

interface CustomerLayoutProps {
    children: React.ReactNode;
    activePage: string;
    title?: string;
    showSearch?: boolean;
    onSearch?: (query: string) => void;
}

export default function CustomerLayout({
    children,
    activePage,
    title = '',
    showSearch = false,
    onSearch
}: CustomerLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    // Mock cart data
    const cartItems = [
        { id: 1, name: 'Bundaran HI', location: 'Jakarta Pusat', price: 'Rp 125.000.000', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80' },
        { id: 2, name: 'Sudirman CBD', location: 'Jakarta Selatan', price: 'Rp 30.000.000', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=200&q=80' }
    ];

    const navSections = [
        {
            items: [
                { href: '/customer/dashboard', icon: 'dashboard', label: 'Dashboard Saya', active: activePage === 'dashboard' },
                { href: '/customer/katalog', icon: 'storefront', label: 'Katalog Produk', active: activePage === 'katalog' },
                { href: '/customer/standard-order', icon: 'shopping_cart', label: 'Pemesanan Standar', active: activePage === 'standard-order' },
                { href: '/customer/chat', icon: 'chat', label: 'Chat dengan Admin', badge: 2, badgeColor: 'bg-red-500', active: activePage === 'chat' },
                { href: '/customer/orders', icon: 'shopping_bag', label: 'Pesanan Saya', badge: 3, active: activePage === 'orders' },
                {
                    href: '/customer/notifications',
                    icon: 'notifications',
                    label: 'Notifikasi',
                    active: activePage === 'notifications'
                },
            ],
        },
        {
            title: 'Akun',
            items: [
                { href: '/customer/profile', icon: 'person', label: 'Profil Saya', active: activePage === 'profile' },
                { href: '/customer/settings', icon: 'settings', label: 'Pengaturan', active: activePage === 'settings' },
                {
                    href: '#',
                    icon: 'logout',
                    label: 'Keluar',
                    active: false,
                    onClick: () => setIsLogoutOpen(true)
                },
            ],
        },
    ];

    return (
        <div className="flex h-screen w-full bg-background-dark overflow-hidden font-sans">
            {/* Sidebar with Mobile Support */}
            <Sidebar
                title="ReklameKu"
                subtitle="Portal Pelanggan"
                sections={navSections}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Sidebar Toggle Button */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden absolute top-3 left-4 z-40 size-10 flex items-center justify-center text-white bg-white/5 rounded-xl border border-white/5 backdrop-blur-md shadow-lg active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined">menu_open</span>
                    </button>
                )}

                <CustomerHeader
                    title={title}
                    showSearch={showSearch}
                    onSearch={onSearch}
                    onCartClick={() => setIsCartOpen(true)}
                    onNotifClick={() => setIsNotifOpen(true)}
                    onLogoutClick={() => setIsLogoutOpen(true)}
                />

                <div className="flex-1 min-w-0 overflow-y-auto relative">
                    {children}
                </div>
            </div>

            {/* Global Customer Modals */}
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
            />
            <NotificationModal
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
            />
            <LogoutModal
                isOpen={isLogoutOpen}
                onClose={() => setIsLogoutOpen(false)}
            />
        </div>
    );
}

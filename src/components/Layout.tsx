import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fix for hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Only render on client-side to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  const navItems = [
    { href: '/produk', label: 'Kelola Produk', icon: 'inventory_2' },
    { href: '/manage', label: 'Kelola Pesanan', icon: 'receipt_long' },
    { href: '/managechat', label: 'Chat & Penawaran', icon: 'chat' },
    { href: '/managecustomerdata', label: 'Data Customer', icon: 'people' },
    { href: '/admin-reports', label: 'Laporan & Rekap', icon: 'bar_chart' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-background-dark text-gray-900 dark:text-white">
      {/* Mobile header */}
      <header className="md:hidden bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {isOpen ? 'close' : 'menu'}
              </span>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">campaign</span>
              </div>
              <h1 className="text-lg font-bold">ReklameKu</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700">
          <nav className="p-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  router.pathname === item.href
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight">ReklameKu</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Console</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                router.pathname === item.href
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">person</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@reklameku.com</p>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                more_vert
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function CustomerLogin() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'admin' | 'customer'>('customer');

    const handleTabChange = (tab: 'admin' | 'customer') => {
        if (tab === 'admin') {
            router.push('/auth/admin-login');
        } else {
            setActiveTab('customer');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate to customer dashboard
        router.push('/customer/dashboard');
    };

    return (
        <>
            <Head>
                <title>Customer Login - ReklameKu</title>
            </Head>
            <div className="flex min-h-screen flex-1">
                {/* Left Side: Visual Hero */}
                <div className="relative hidden w-0 flex-1 lg:block">
                    <img
                        alt="Papan reklame digital modern di pusat kota"
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-0 left-0 p-12 text-white">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined text-3xl">campaign</span>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">ReklameKu</h2>
                        </div>
                        <p className="max-w-lg text-lg text-slate-200">
                            Temukan lokasi strategis untuk bisnis Anda.
                            Jelajahi ribuan titik reklame, bandingkan harga, dan sewa dengan mudah untuk jangkauan luas.
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-background-light dark:bg-background-dark">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        {/* Brand Header for Mobile */}
                        <div className="mb-10 lg:hidden">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                                    <span className="material-symbols-outlined text-2xl">campaign</span>
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">ReklameKu</span>
                            </div>
                        </div>

                        {/* User Type Selection */}
                        <div className="mb-8">
                            <div className="flex rounded-lg bg-slate-100 dark:bg-surface-dark p-1">
                                <button
                                    onClick={() => handleTabChange('admin')}
                                    className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-all ${activeTab === 'admin'
                                        ? 'bg-white dark:bg-background-dark text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    Admin
                                </button>
                                <button
                                    onClick={() => handleTabChange('customer')}
                                    className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-all ${activeTab === 'customer'
                                        ? 'bg-white dark:bg-background-dark text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    Customer
                                </button>
                            </div>
                        </div>

                        {/* Page Heading */}
                        <div className="flex flex-col gap-2 mb-10">
                            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                                Login Customer
                            </h1>
                            <p className="text-slate-500 dark:text-[#92adc9] text-base font-normal leading-normal">
                                {activeTab === 'admin'
                                    ? 'Masuk untuk mengelola produk, pesanan, dan toko.'
                                    : 'Masuk untuk mulai mencari dan menyewa reklame.'}
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="mt-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        autoComplete="email"
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal transition-all"
                                        id="email"
                                        name="email"
                                        placeholder="customer@email.com"
                                        required
                                        type="email"
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <label
                                            className="text-slate-900 dark:text-white text-sm font-medium leading-normal pb-2"
                                            htmlFor="password"
                                        >
                                            Password
                                        </label>
                                        <Link href="#" className="text-sm font-medium text-primary hover:text-blue-400">
                                            Lupa password?
                                        </Link>
                                    </div>
                                    <div className="flex w-full flex-1 items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary/50">
                                        <input
                                            autoComplete="current-password"
                                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-[#92adc9] p-[15px] border-r-0 text-base font-normal leading-normal transition-colors"
                                            id="password"
                                            name="password"
                                            placeholder="********"
                                            required
                                            type={showPassword ? 'text' : 'password'}
                                        />
                                        <div
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="flex cursor-pointer items-center justify-center border border-slate-300 dark:border-border-dark bg-white dark:bg-surface-dark pr-[15px] rounded-r-lg border-l-0 text-slate-400 dark:text-[#92adc9] group-focus-within:border-primary transition-colors hover:text-slate-600 dark:hover:text-white"
                                        >
                                            <span className="material-symbols-outlined">
                                                {showPassword ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between">
                                    <label className="flex gap-x-3 items-center cursor-pointer group">
                                        <input
                                            className="h-5 w-5 rounded border-slate-300 dark:border-border-dark border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-offset-0 focus:ring-primary focus:outline-none transition-colors"
                                            type="checkbox"
                                        />
                                        <span className="text-slate-700 dark:text-white text-sm font-normal leading-normal group-hover:text-primary transition-colors">
                                            Ingat saya
                                        </span>
                                    </label>
                                </div>

                                {/* Login Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <span className="truncate">Masuk</span>
                                    </button>
                                </div>

                                {/* Register Link */}
                                <div className="text-center mt-4">
                                    <p className="text-sm text-slate-500 dark:text-[#92adc9]">
                                        Belum punya akun?{' '}
                                        <Link href="/auth/customer-register" className="text-primary hover:underline font-medium">
                                            Daftar sekarang
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-6">
                            <p className="text-center text-xs text-slate-400 dark:text-slate-600">
                                ReklameKu v1.0 | Dilindungi SSL
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

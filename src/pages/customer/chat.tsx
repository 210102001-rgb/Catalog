import React, { useState } from 'react';
import Head from 'next/head';
import CustomerLayout from '../../components/customer/CustomerLayout';

export default function CustomerChat() {
    const [message, setMessage] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const messages: any[] = [
        {
            id: 'sys',
            type: 'system',
            content: 'Chat dimulai pada 25 Oktober 2024'
        },
        {
            id: 1,
            sender: 'admin',
            name: 'Admin Support',
            time: '09:00',
            content: 'Halo! Selamat datang di ReklameKu. Saya siap membantu Anda dengan pertanyaan seputar pemesanan papan reklame. Ada yang bisa saya bantu?',
        },
        {
            id: 2,
            sender: 'customer',
            name: 'Anda',
            time: '09:15',
            content: 'Halo, saya tertarik dengan billboard digital di area Sudirman. Bisa minta informasi harga dan ketersediaan untuk bulan depan?',
        },
        {
            id: 3,
            sender: 'admin',
            name: 'Admin Support',
            time: '09:18',
            content: 'Tentu! Untuk area Sudirman kami memiliki beberapa pilihan billboard digital yang tersedia. Apakah Anda ingin daftar lokasinya?',
        },
        {
            id: 4,
            sender: 'customer',
            name: 'Anda',
            time: '09:25',
            content: 'Wah menarik! Bisa minta penawaran untuk 3 bulan sekaligus? Dan apakah ada diskon untuk customer baru?',
        }
    ];

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert(`File "${file.name}" terpilih! (Mock upload)`);
        }
    };

    return (
        <>
            <Head>
                <title>Chat dengan Admin - ReklameKu</title>
            </Head>
            <CustomerLayout activePage="chat" title="Live Support Chat">
                <main className="flex-1 flex flex-col relative bg-background-dark max-w-5xl mx-auto w-full">
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {/* Messages Area focused on beauty and spacing */}
                    <div className="flex-1 p-6 flex flex-col gap-8 pb-32">
                        {messages.map((msg, index) => {
                            if (msg.type === 'system') {
                                return (
                                    <div key={msg.id} className="flex justify-center my-6">
                                        <div className="bg-card-dark/60 backdrop-blur-md border border-white/5 px-6 py-2 rounded-full flex items-center gap-3">
                                            <span className="material-symbols-outlined text-text-secondary text-sm">event_note</span>
                                            <span className="text-xs text-text-secondary font-bold tracking-wide">
                                                {msg.content}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }

                            const isAdmin = msg.sender === 'admin';

                            return (
                                <div key={msg.id} className={`flex gap-4 max-w-[85%] ${!isAdmin ? 'ml-auto flex-row-reverse' : 'animate-in slide-in-from-left duration-500'}`}>
                                    <div className={`size-10 rounded-2xl flex items-center justify-center text-xs font-black text-white shrink-0 mt-1 shadow-xl ${isAdmin ? 'bg-gradient-to-tr from-purple-600 to-primary' : 'bg-gradient-to-tr from-primary to-blue-400'}`}>
                                        {isAdmin ? 'AD' : 'JD'}
                                    </div>
                                    <div className={`flex flex-col gap-2 ${!isAdmin ? 'items-end' : ''}`}>
                                        <div className={`flex items-baseline gap-3 ${!isAdmin ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-sm font-black text-white/90">{msg.name}</span>
                                            <span className="text-[10px] font-bold text-[#5a718a] uppercase tracking-tighter">{msg.time}</span>
                                        </div>
                                        <div className={`relative px-5 py-4 rounded-3xl shadow-2xl ${isAdmin ? 'bg-[#1a2633] rounded-tl-none border border-white/5 text-white' : 'bg-primary rounded-tr-none text-white font-medium'}`}>
                                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                            {/* Status check for customer */}
                                            {!isAdmin && (
                                                <div className="flex justify-end mt-1">
                                                    <span className="material-symbols-outlined text-[14px] text-white/60">done_all</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Admin Typing Indicator */}
                        <div className="flex gap-4 max-w-sm">
                            <div className="size-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-primary flex items-center justify-center text-xs font-black text-white shrink-0 mt-1 shadow-xl">AD</div>
                            <div className="flex flex-col gap-2">
                                <div className="bg-[#1a2633] text-white px-5 py-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2 shadow-xl">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="sticky bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent z-40">
                        <div className="max-w-4xl mx-auto flex items-end gap-3 bg-[#0f1720]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-3 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.5)] focus-within:border-primary/50 transition-all">
                            <button
                                onClick={handleAttachClick}
                                className="size-12 shrink-0 flex items-center justify-center text-[#92adc9] hover:text-white transition-all rounded-2xl hover:bg-white/5 border border-white/5 active:scale-95 group"
                            >
                                <span className="material-symbols-outlined text-[24px] group-hover:rotate-45 transition-transform">attach_file</span>
                            </button>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 bg-transparent border-none text-white placeholder-[#5a718a] focus:ring-0 resize-none py-3 max-h-40 text-sm md:text-base leading-relaxed scrollbar-hide"
                                placeholder="Ketik pesan untuk support..."
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                            ></textarea>
                            <button
                                onClick={(e) => handleSend(e as any)}
                                className="size-12 shrink-0 flex items-center justify-center bg-primary hover:bg-blue-600 text-white rounded-2xl transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[24px]">send</span>
                            </button>
                        </div>
                    </div>
                </main>
            </CustomerLayout>
        </>
    );
}

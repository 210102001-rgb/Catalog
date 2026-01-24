import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/Header';

// Mock Data
const MOCK_CHATS = [
    {
        id: 1,
        name: 'Mike Ross',
        initial: 'MR',
        status: 'online',
        lastMessage: 'Halo, apakah billboard di Sudirman tersedia minggu depan?',
        time: '2m lalu',
        unread: 2,
        color: 'from-blue-500 to-purple-500',
        labels: [{ text: 'Urgent', color: 'bg-red-500/10 text-red-500 border-red-500/20' }]
    },
    {
        id: 2,
        name: 'Sarah Connor',
        initial: 'SC',
        status: 'offline',
        lastMessage: 'Saya perlu update kreatif untuk kampanye weekend.',
        time: '1j lalu',
        unread: 0,
        color: 'from-pink-500 to-red-500',
        labels: [{ text: 'Negosiasi', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' }]
    },
    {
        id: 3,
        name: 'David Kim',
        initial: 'DK',
        status: 'online',
        lastMessage: 'Tolong kirim invoice bulan lalu.',
        time: '3j lalu',
        unread: 0,
        color: 'from-green-500 to-teal-500',
        labels: []
    }
];

const MOCK_MESSAGES = [
    { id: 1, text: 'Halo, saya tertarik dengan billboard di Sudirman.', time: '10:30', isMe: false },
    { id: 2, text: 'Apakah tersedia untuk minggu depan?', time: '10:31', isMe: false },
    { id: 3, text: 'Halo Pak Mike, izinkan saya cek ketersediaannya sebentar.', time: '10:35', isMe: true },
    { id: 4, text: 'Baik ditunggu infonya mas.', time: '10:36', isMe: false },
    { id: 5, text: 'Untuk slot minggu depan masih tersedia di tanggal 25-30.', time: '10:40', isMe: true },
];

export default function AdminChat() {
    const [selectedChat, setSelectedChat] = useState<any>(null); // Start with null for list view on mobile
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelectChat = (chat: any) => {
        setSelectedChat(chat);
    };

    const handleBackToMenu = () => {
        setSelectedChat(null);
    };

    const filteredChats = MOCK_CHATS.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Chat & Penawaran - ReklameKu</title>
            </Head>
            <AdminLayout activePage="chat">
                <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
                    <Header title="Chat & Penawaran">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-[#92adc9] hidden md:inline">5 Pesan Belum Dibaca</span>
                        </div>
                    </Header>

                    <div className="flex-1 flex overflow-hidden relative">
                        {/* Chat List - Hidden on mobile if chat selected */}
                        <aside className={`
                            w-full md:w-96 bg-card-dark border-r border-white/5 flex flex-col z-10
                            ${selectedChat ? 'hidden md:flex' : 'flex'}
                        `}>
                            <div className="p-4 border-b border-white/5">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                                    <input
                                        className="w-full bg-background-dark border-none text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary placeholder-text-secondary"
                                        placeholder="Cari customer..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {filteredChats.map((chat) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => handleSelectChat(chat)}
                                        className={`p-4 cursor-pointer transition-colors border-l-4 ${selectedChat?.id === chat.id
                                            ? 'bg-white/10 border-primary'
                                            : 'hover:bg-white/5 border-transparent'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`size-12 rounded-full bg-gradient-to-tr ${chat.color} flex items-center justify-center text-white font-bold shrink-0`}>
                                                {chat.initial}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-white font-semibold text-sm truncate">{chat.name}</p>
                                                    <p className="text-[#92adc9] text-xs shrink-0">{chat.time}</p>
                                                </div>
                                                <p className="text-[#92adc9] text-sm truncate mb-1.5">{chat.lastMessage}</p>
                                                <div className="flex gap-2">
                                                    {chat.labels.map((label, idx) => (
                                                        <span key={idx} className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${label.color}`}>
                                                            {label.text}
                                                        </span>
                                                    ))}
                                                    {chat.unread > 0 && (
                                                        <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                                            {chat.unread}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Chat Details - Absolute on mobile to overlay list */}
                        {selectedChat ? (
                            <div className="flex-1 flex flex-col md:static absolute inset-0 bg-background-dark z-20">
                                <div className="p-4 md:p-6 border-b border-white/5 bg-card-dark flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Back Button for Mobile */}
                                        <button
                                            onClick={handleBackToMenu}
                                            className="md:hidden p-2 -ml-2 text-white hover:bg-white/10 rounded-full"
                                        >
                                            <span className="material-symbols-outlined">arrow_back</span>
                                        </button>

                                        <div className={`size-10 rounded-full bg-gradient-to-tr ${selectedChat.color} flex items-center justify-center text-white font-bold`}>
                                            {selectedChat.initial}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{selectedChat.name}</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`size-2 rounded-full ${selectedChat.status === 'online' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                                                <p className="text-[#92adc9] text-xs capitalize">{selectedChat.status}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 hidden md:flex">
                                        <button className="px-3 py-1.5 md:px-4 md:py-2 bg-background-dark text-white rounded-lg hover:bg-surface-hover transition-colors text-sm">
                                            Archive
                                        </button>
                                        <button className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                            Selesai
                                        </button>
                                    </div>
                                    {/* Mobile Menu Icon */}
                                    <button className="md:hidden text-white p-2">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-black/20">
                                    {MOCK_MESSAGES.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 md:p-4 text-sm ${msg.isMe
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-card-dark text-white rounded-bl-none border border-white/5'
                                                }`}>
                                                <p className="mb-1 leading-relaxed">{msg.text}</p>
                                                <p className={`text-[10px] text-right ${msg.isMe ? 'text-blue-100' : 'text-[#92adc9]'}`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 border-t border-white/5 bg-card-dark">
                                    <form onSubmit={(e) => { e.preventDefault(); setMessage(''); }} className="flex gap-2 md:gap-3 items-center">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    alert(`File selected: ${e.target.files[0].name}`); // Mock handling
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                            className="h-10 w-10 md:h-12 md:w-12 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl hover:bg-white/10 flex items-center justify-center shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-[20px] md:text-[24px]">attach_file</span>
                                        </button>
                                        <input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="flex-1 bg-background-dark border border-white/5 text-white rounded-xl px-4 py-2 md:py-3 focus:ring-2 focus:ring-primary placeholder-text-secondary text-sm"
                                            placeholder="Ketik pesan..."
                                            type="text"
                                        />
                                        <button type="submit" className="h-10 w-10 md:h-12 md:w-12 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[20px] md:text-[24px]">send</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 text-[#92adc9]">
                                <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-[48px] opacity-50">chat</span>
                                </div>
                                <h3 className="text-white text-lg font-bold mb-2">Belum ada chat dipilih</h3>
                                <p className="text-sm max-w-xs">Pilih salah satu percakapan dari daftar di sebelah kiri untuk melihat detail chat dan penawaran.</p>
                            </div>
                        )}
                    </div>
                </main>
            </AdminLayout>
        </>
    );
}

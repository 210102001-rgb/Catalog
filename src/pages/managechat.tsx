import { useState } from 'react';
import Head from 'next/head';

type Chat = {
  id: string;
  customer: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'offline';
};

export default function ManageChat() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      customer: 'John Doe',
      lastMessage: 'Berapa harga untuk baliho ukuran 3x6m?',
      time: '10:30',
      unread: 2,
      status: 'online'
    },
    // Add more sample chats as needed
  ]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Head>
        <title>Chat & Penawaran - ReklameKu</title>
      </Head>

      {/* Chat list */}
      <div className="w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">Percakapan</h1>
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Cari percakapan..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <span className="material-symbols-outlined">search</span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                activeChat === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        {chat.customer.charAt(0)}
                      </span>
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        chat.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{chat.customer}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                  {chat.unread > 0 && (
                    <span className="mt-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col hidden md:flex">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    {chats.find(c => c.id === activeChat)?.customer.charAt(0) || 'J'}
                  </span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-500" />
              </div>
              <div>
                <h2 className="font-medium text-gray-900 dark:text-white">
                  {chats.find(c => c.id === activeChat)?.customer || 'John Doe'}
                </h2>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {/* Chat messages would go here */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 my-4">
                Mulai percakapan dengan pelanggan Anda
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input
                  type="text"
                  placeholder="Ketik pesan..."
                  className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <span className="material-symbols-outlined text-5xl mb-2">forum</span>
              <p>Pilih percakapan untuk memulai chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

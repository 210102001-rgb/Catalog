import React, { useState, useEffect } from "react";
import Head from "next/head";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { useAuth } from "../../hooks/useAuth";
import { showInfoAlert, showErrorAlert } from "../../utils/swalConfig";

interface ChatMessage {
  id: number;
  sender: "admin" | "customer";
  name: string;
  time: string;
  content: string;
  read?: boolean;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
}

export default function CustomerChat() {
  const { user, loading: authLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchAdminUser();
      fetchMessages();
    }
  }, [user]);

  const fetchAdminUser = async () => {
    try {
      const response = await fetch("/api/customer/chat/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAdminUser(data);
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  const fetchMessages = async () => {
    if (!adminUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/customer/chat/messages?adminId=${adminUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Transform API response to match component expectations
        const transformedMessages = data.messages.map((chat: any) => ({
          id: chat.id,
          sender: chat.sender_id === user?.id ? "customer" : "admin",
          name: chat.sender_id === user?.id ? "Anda" : chat.sender.name,
          time: new Date(chat.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          content: chat.message,
          read: chat.read,
        }));

        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Fallback to mock data if API fails
      setMessages([
        {
          id: 1,
          sender: "admin",
          name: "Admin Support",
          time: "09:00",
          content: "Halo! Selamat datang di ReklameKu. Saya siap membantu Anda dengan pertanyaan seputar pemesanan papan reklame. Ada yang bisa saya bantu?",
        },
        {
          id: 2,
          sender: "customer",
          name: "Anda",
          time: "09:15",
          content: "Halo, saya tertarik dengan billboard digital di area Sudirman. Bisa minta informasi harga dan ketersediaan untuk bulan depan?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending || !adminUser) return;

    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          receiver_id: adminUser.id,
          message: message.trim(),
          type: "TEXT",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Add message to local state
        const newMessage: ChatMessage = {
          id: Date.now(),
          sender: "customer",
          name: "Anda",
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          content: message.trim(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");

        // Refresh messages to get updated read status
        setTimeout(() => fetchMessages(), 1000);
      } else {
        const errorData = await response.json();
        await showErrorAlert("Error", errorData.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      await showErrorAlert("Error", "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await showInfoAlert("File Terpilih!", `File "${file.name}" terpilih! (Mock upload)`);
    }
  };

  if (authLoading) {
    return (
      <CustomerLayout activePage="chat" title="Live Support Chat">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (!user) {
    return (
      <CustomerLayout activePage="chat" title="Live Support Chat">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Chat dengan Admin - ReklameKu</title>
      </Head>
      <CustomerLayout activePage="chat" title="Live Support Chat">
        <main className="flex flex-col flex-1 bg-background-dark relative min-h-0 overflow-y-auto">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} aria-label="Upload file" />

          {/* Messages Area */}
          <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const isAdmin = msg.sender === "admin";

                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${!isAdmin ? "ml-auto flex-row-reverse" : "animate-in slide-in-from-left duration-300"}`}>
                    <div
                      className={`size-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1 border ${
                        isAdmin ? "bg-purple-600 border-purple-500" : "bg-primary border-blue-500"
                      }`}
                    >
                      {isAdmin ? "AD" : "JD"}
                    </div>
                    <div className={`flex flex-col gap-1 ${!isAdmin ? "items-end" : ""}`}>
                      <div className={`flex items-baseline gap-2 ${!isAdmin ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs font-bold text-gray-300">{msg.name}</span>
                        <span className="text-[10px] text-gray-500">{msg.time}</span>
                      </div>
                      <div className={`relative px-4 py-3 rounded-lg shadow-sm ${isAdmin ? "bg-[#1a2633] rounded-tl-none border border-[#324d67] text-white" : "bg-primary rounded-tr-none text-white font-medium"}`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                        {/* Status check for customer */}
                        {!isAdmin && (
                          <div className="flex justify-end mt-1">
                            <span className="material-symbols-outlined text-[14px] text-white/70">{msg.read ? "done_all" : "done"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-3">chat</span>
                <h3 className="text-white text-base font-bold mb-1">Belum ada pesan</h3>
                <p className="text-xs text-center max-w-xs">Kirim pesan untuk memulai percakapan dengan tim support kami.</p>
              </div>
            )}

            {/* Admin Typing Indicator */}
            {messages.length > 0 && messages[messages.length - 1]?.sender === "customer" && (
              <div className="flex gap-3 max-w-sm">
                <div className="size-8 rounded-lg bg-purple-600 border border-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">AD</div>
                <div className="flex flex-col gap-1">
                  <div className="bg-[#1a2633] text-white px-4 py-3 rounded-lg rounded-tl-none border border-[#324d67] flex items-center gap-1.5 shadow-sm">
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="sticky bottom-0 left-0 right-0 p-4 md:p-6 bg-[#0f1013] border-t border-[#324d67] z-40">
            <div className="max-w-5xl mx-auto flex items-end gap-3 bg-[#111a22] rounded-lg border border-[#324d67] p-2 shadow-lg focus-within:border-primary/50 transition-all">
              <button
                onClick={handleAttachClick}
                className="size-10 shrink-0 flex items-center justify-center text-gray-400 hover:text-white transition-all rounded-md hover:bg-[#1a2633] active:scale-95 group"
                disabled={sending}
              >
                <span className="material-symbols-outlined text-[20px] group-hover:rotate-45 transition-transform">attach_file</span>
              </button>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 resize-none py-2.5 max-h-32 text-sm leading-relaxed scrollbar-hide"
                placeholder="Ketik pesan untuk support..."
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                }}
                disabled={sending}
              ></textarea>
              <button
                onClick={(e) => handleSend(e as any)}
                className="size-10 shrink-0 flex items-center justify-center bg-primary hover:bg-blue-600 text-white rounded-md transition-all shadow-sm active:scale-95 disabled:opacity-50"
                disabled={sending || !message.trim()}
              >
                {sending ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <span className="material-symbols-outlined text-[20px]">send</span>}
              </button>
            </div>
          </div>
        </main>
      </CustomerLayout>
    </>
  );
}

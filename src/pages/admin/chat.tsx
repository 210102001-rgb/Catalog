import React, { useState, useEffect } from "react";
import Head from "next/head";
import AdminLayout from "../../components/admin/AdminLayout";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";
import { showInfoAlert, showSuccessAlert, showErrorAlert } from "../../utils/swalConfig";

interface ChatCustomer {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
}

interface ChatMessage {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  sender: string;
  receiver: string;
  read: boolean; // Add read status
}

export default function AdminChat() {
  const { user, loading: authLoading } = useAuth();
  const [customers, setCustomers] = useState<ChatCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ChatCustomer | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCustomer && user) {
      console.log("Selected customer changed:", selectedCustomer);
      fetchMessages(selectedCustomer.id);
    }
  }, [selectedCustomer, user]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/chat/customers?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (customerId: number) => {
    try {
      console.log("Fetching messages for customer:", customerId);
      const response = await fetch(`/api/admin/chat/customers/${customerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Messages data:", data);
        // API returns an array of messages directly, not an object with messages property
        setMessages(Array.isArray(data) ? data : []);
      } else {
        // Handle error response
        const errorData = await response.json().catch(() => ({}));
        console.error("Error fetching messages:", errorData.error || "Unknown error");
        setMessages([]); // Set empty array on error
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]); // Set empty array on network error
    }
  };

  const handleSelectChat = (customer: ChatCustomer) => {
    setSelectedCustomer(customer);
  };

  const handleBackToMenu = () => {
    setSelectedCustomer(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedCustomer || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/admin/chat/customers/${selectedCustomer.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Add message to local state (result is already in the correct format)
        setMessages((prev) => [...prev, result]);
        setMessage("");

        // Refresh customer list to update unread counts
        await fetchCustomers();
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

  const filteredChats = customers.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalUnread = customers.reduce((sum, customer) => sum + customer.unread, 0);

  if (authLoading) {
    return (
      <AdminLayout activePage="chat">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout activePage="chat">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Silakan login terlebih dahulu</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Chat & Penawaran - ReklameKu</title>
      </Head>
      <AdminLayout activePage="chat">
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-dark">
          <Header title="Chat & Penawaran">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#92adc9] hidden md:inline">{totalUnread > 0 ? `${totalUnread} Pesan Belum Dibaca` : "Tidak ada pesan baru"}</span>
            </div>
          </Header>

          <div className="flex-1 flex overflow-hidden relative">
            {/* Chat List - Hidden on mobile if chat selected */}
            <aside
              className={`
                w-full md:w-96 bg-card-dark border-r border-white/5 flex flex-col z-10
                ${selectedCustomer ? "hidden md:flex" : "flex"}
              `}
            >
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                  <input
                    id="search-customer-input"
                    className="w-full bg-background-dark border-none text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-primary placeholder-text-secondary"
                    placeholder="Cari customer..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Cari customer"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredChats.length > 0 ? (
                  filteredChats.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleSelectChat(customer)}
                      className={`p-4 cursor-pointer transition-colors border-l-4 ${selectedCustomer?.id === customer.id ? "bg-white/10 border-primary" : "hover:bg-white/5 border-transparent"}`}
                    >
                      <div className="flex gap-3">
                        <div className={`size-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0`}>{customer.name.charAt(0).toUpperCase()}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-white font-semibold text-sm truncate">{customer.name}</p>
                            <p className="text-[#92adc9] text-xs shrink-0">
                              {new Date(customer.lastMessageTime).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <p className="text-[#92adc9] text-sm truncate mb-1.5">{customer.lastMessage}</p>
                          <div className="flex gap-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                                customer.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                              }`}
                            >
                              {customer.status === "ACTIVE" ? "Aktif" : "Non-Aktif"}
                            </span>
                            {customer.unread > 0 && <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">{customer.unread}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-[#92adc9]">
                    <span className="material-symbols-outlined text-2xl mb-2">search_off</span>
                    <p className="text-sm">Tidak ada customer ditemukan</p>
                  </div>
                )}
              </div>
            </aside>

            {/* Chat Details */}
            {selectedCustomer ? (
              <div className="flex-1 flex flex-col md:static absolute inset-0 bg-background-dark z-20">
                <div className="p-4 md:p-6 border-b border-white/5 bg-card-dark flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Back Button for Mobile */}
                    <button onClick={handleBackToMenu} className="md:hidden p-2 -ml-2 text-white hover:bg-white/10 rounded-full">
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>

                    <div className={`size-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold`}>{selectedCustomer.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="text-white font-semibold">{selectedCustomer.name}</p>
                      <div className="flex items-center gap-1.5">
                        <div className={`size-2 rounded-full ${selectedCustomer.online ? "bg-emerald-500" : "bg-slate-500"}`}></div>
                        <p className="text-[#92adc9] text-xs capitalize">{selectedCustomer.online ? "Online" : "Offline"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 hidden md:flex">
                    <button className="px-3 py-1.5 md:px-4 md:py-2 bg-background-dark text-white rounded-lg hover:bg-surface-hover transition-colors text-sm">Archive</button>
                    <button className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">Selesai</button>
                  </div>
                  {/* Mobile Menu Icon */}
                  <button className="md:hidden text-white p-2">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-black/20">
                  {messages && messages.length > 0 ? (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 md:p-4 text-sm ${msg.isMe ? "bg-primary text-white rounded-br-none" : "bg-card-dark text-white rounded-bl-none border border-white/5"}`}>
                          <p className="mb-1 leading-relaxed">{msg.text}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className={`text-[10px] ${msg.isMe ? "text-blue-100" : "text-[#92adc9]"}`}>{msg.time}</p>
                            {!msg.isMe && <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${msg.read ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{msg.read ? "Dibaca" : "Belum dibaca"}</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-[#92adc9]">
                      <span className="material-symbols-outlined text-4xl mb-4">chat</span>
                      <p className="text-lg font-medium mb-2">Belum ada pesan</p>
                      <p className="text-sm text-center max-w-xs">Kirim pesan pertama untuk memulai percakapan dengan {selectedCustomer?.name || "customer"}</p>
                    </div>
                  )}

                  {/* Typing indicator would go here if implemented */}
                </div>

                <div className="p-4 border-t border-white/5 bg-card-dark">
                  <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3 items-center">
                    <button
                      type="button"
                      className="h-10 w-10 md:h-12 md:w-12 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-xl hover:bg-white/10 flex items-center justify-center shrink-0"
                      onClick={async () => {
                        await showInfoAlert("Info", "Fitur upload file akan diimplementasi");
                      }}
                    >
                      <span className="material-symbols-outlined text-[20px] md:text-[24px]">attach_file</span>
                    </button>
                    <input
                      id="chat-message-input"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 bg-background-dark border border-white/5 text-white rounded-xl px-4 py-2 md:py-3 focus:ring-2 focus:ring-primary placeholder-text-secondary text-sm"
                      placeholder="Ketik pesan..."
                      type="text"
                      aria-label="Ketik pesan chat"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      className="h-10 w-10 md:h-12 md:w-12 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0 disabled:opacity-50"
                      disabled={sending || !message.trim()}
                    >
                      {sending ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <span className="material-symbols-outlined text-[20px] md:text-[24px]">send</span>}
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

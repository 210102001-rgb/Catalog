import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchNotifications = async () => {
        try {
          const response = await fetch("/api/notifications");
          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications || []);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notifikasi">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className={`p-4 rounded-lg border ${notif.read ? "bg-slate-800 border-slate-200 dark:border-slate-700" : "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20"}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm font-semibold ${notif.read ? "text-white" : "text-primary"}`}>{notif.title}</h4>
                <span className="text-xs text-slate-500">{formatTimeAgo(notif.created_at)}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{notif.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>Tidak ada notifikasi</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "baru saja";
  if (diffMinutes < 60) return `${diffMinutes}m lalu`;
  if (diffHours < 24) return `${diffHours}j lalu`;
  return `${diffDays} hari lalu`;
}

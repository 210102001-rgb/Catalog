import React from 'react';
import Modal from '../../ui/Modal';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
    const notifications = [
        { id: 1, title: 'Pesanan Baru', message: 'Klien Nike Indonesia membuat pesanan baru #ORD-7742', time: '5m lalu', read: false },
        { id: 2, title: 'Pembayaran Diterima', message: 'Pembayaran sebesar Rp 12.500.000 telah diterima', time: '1j lalu', read: false },
        { id: 3, title: 'Pesan Baru', message: 'Mike Ross mengirim pesan baru di chat', time: '2j lalu', read: true },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Notifikasi"
        >
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`p-4 rounded-lg border ${notif.read ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-semibold ${notif.read ? 'text-slate-900 dark:text-white' : 'text-primary'}`}>
                                {notif.title}
                            </h4>
                            <span className="text-xs text-slate-500">{notif.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {notif.message}
                        </p>
                    </div>
                ))}
            </div>
        </Modal>
    );
}

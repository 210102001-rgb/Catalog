import React from 'react';
import Modal from '../../ui/Modal';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'order' | 'promo' | 'system';
}

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
    const notifications: Notification[] = [
        {
            id: 1,
            title: 'Pembayaran Berhasil',
            message: 'Pembayaran untuk pesanan #ORD-2024-001 telah dikonfirmasi.',
            time: '10m lalu',
            read: false,
            type: 'order'
        },
        {
            id: 2,
            title: 'Promo Terbatas!',
            message: 'Dapatkan diskon 20% untuk lokasi Bundaran HI khusus bulan ini.',
            time: '2j lalu',
            read: false,
            type: 'promo'
        },
        {
            id: 3,
            title: 'Status Pesanan Update',
            message: 'Pesanan #ORD-2024-002 kini berstatus "Terjadwal".',
            time: '5j lalu',
            read: true,
            type: 'order'
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Notifikasi"
        >
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${notif.read
                                ? 'bg-white/5 border-white/5 hover:bg-white/10'
                                : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <span className={`size-2 rounded-full ${notif.read ? 'bg-transparent' : 'bg-primary'}`}></span>
                                <h4 className={`text-sm font-semibold ${notif.read ? 'text-white' : 'text-primary'}`}>
                                    {notif.title}
                                </h4>
                            </div>
                            <span className="text-[10px] text-[#92adc9] uppercase font-bold tracking-wider">{notif.time}</span>
                        </div>
                        <p className="text-xs text-[#92adc9] leading-relaxed ml-4">
                            {notif.message}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-4">
                <button className="text-xs text-[#92adc9] hover:text-white transition-colors">
                    Tandai semua dibaca
                </button>
            </div>
        </Modal>
    );
}

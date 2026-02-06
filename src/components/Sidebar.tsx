import React from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: number | string;
  badgeColor?: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  title: string;
  subtitle: string;
  sections: NavSection[];
  isOpen: boolean; // New Prop
  onClose: () => void; // New Prop
}

export default function Sidebar({ title, subtitle, sections, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={onClose} />}

      {/* Sidebar Container */}
      <aside
        className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 bg-[#111a22] border-r border-[#324d67] flex flex-col flex-shrink-0 h-full
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
      >
        {/* Logo & Close Button */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-full size-10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold leading-normal tracking-tight">{title}</h1>
              <p className="text-[#92adc9] text-xs font-normal">{subtitle}</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden size-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10" aria-label="Tutup menu navigasi">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className={section.title ? "mt-4 pt-4 border-t border-[#233648]" : ""}>
              {section.title && <p className="px-3 text-xs font-semibold text-[#92adc9] uppercase tracking-wider mb-2">{section.title}</p>}
              {section.items.map((item, itemIdx) => {
                const content = (
                  <>
                    <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {item.icon}
                    </span>
                    <p className={`text-sm ${item.active ? "font-semibold" : "font-medium"}`}>{item.label}</p>
                    {item.badge && <span className={`ml-auto ${item.badgeColor || "bg-primary"} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>{item.badge}</span>}
                  </>
                );

                const className = `flex items-center gap-3 px-3 py-3 rounded-lg transition-all w-full text-left ${item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-[#92adc9] hover:bg-[#233648] hover:text-white hover:translate-x-1"}`;

                if (item.onClick) {
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => {
                        item.onClick?.();
                        // Optional: close sidebar on mobile when action clicked
                        // onClose();
                      }}
                      className={className}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={className}
                    onClick={onClose} // Close sidebar on mobile nav
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

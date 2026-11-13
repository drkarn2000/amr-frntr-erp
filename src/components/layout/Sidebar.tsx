'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  FolderKanban,
  FileSpreadsheet,
  FileText,
  PoundSterling,
  Boxes,
  Truck,
  Clock,
  Mail,
  Image as ImageIcon,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  UserCheck,
  Settings,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const pathname = usePathname();

  const navGroups = [
    {
      label: 'WORKSPACE',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
        { label: 'Clients', href: '/clients', icon: Users2 },
        { label: 'Projects', href: '/projects', icon: FolderKanban },
      ],
    },
    {
      label: 'PROJECT OPERATIONS',
      items: [
        { label: 'Quotations & Add-ons', href: '/quotations', icon: FileSpreadsheet },
        { label: 'Documents & Drawings', href: '/documents', icon: FileText },
        { label: 'Payments & Cash Flow', href: '/payments', icon: PoundSterling },
        { label: 'Products & Procurement', href: '/procurement', icon: Boxes },
        { label: 'Vendors & Suppliers', href: '/vendors', icon: Truck },
        { label: 'Milestones & Tasks', href: '/milestones', icon: Clock },
      ],
    },
    {
      label: 'COMMUNICATION & QUALITY',
      items: [
        { label: 'Email & Communication', href: '/communications', icon: Mail },
        { label: 'Project Gallery', href: '/gallery', icon: ImageIcon },
        { label: 'Defects & Snagging', href: '/defects', icon: AlertTriangle },
        { label: 'Maintenance & Warranty', href: '/maintenance', icon: ShieldCheck },
      ],
    },
    {
      label: 'INSIGHTS & ADMIN',
      items: [
        { label: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
        { label: 'Users & Permissions', href: '/users', icon: UserCheck },
        { label: 'Settings & Audit Log', href: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="relative flex flex-col h-full bg-[#111c30]/92 backdrop-blur-2xl text-[#dce5f2] border-r border-white/10 shadow-[8px_0_32px_rgba(15,23,42,0.28)] select-none overflow-hidden">
      {/* Ambient Sidebar Internal Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#4268e8]/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 -right-16 w-44 h-44 rounded-full bg-[#d5b27a]/15 blur-3xl"
      />

      {/* Brand Header */}
      <div className="relative z-10 px-5 py-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d5b27a] via-[#f1dfbd] to-[#c79d5b] flex items-center justify-center text-[#17243b] font-black text-sm tracking-tight shadow-[0_0_20px_rgba(213,178,122,0.45)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            AMR
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-widest leading-none group-hover:text-[#f1dfbd] transition-colors">
              AMR FRNTR
            </div>
            <div className="text-[9px] font-semibold tracking-wider text-[#9eafc5] mt-1 uppercase">
              Furniture Fit-Out ERP
            </div>
          </div>
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="relative z-10 flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-bold tracking-widest text-[#7b92b3] px-3 mb-2 uppercase">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#4268e8]/90 to-[#3556d4]/85 text-white font-bold shadow-[0_4px_20px_rgba(66,104,232,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] border border-white/20 translate-x-1'
                        : 'text-[#b9c7d9] hover:bg-white/10 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive
                            ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]'
                            : 'text-[#8194ad] group-hover:text-[#f1dfbd]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="relative z-10 p-3.5 m-3 rounded-2xl bg-white/8 backdrop-blur-md border border-white/15 text-xs text-[#b7c5d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16845f] shadow-[0_0_10px_#16845f] animate-pulse" />
          <span className="font-bold text-white text-[11px]">System Illuminated & Live</span>
        </div>
        <div className="text-[10px] text-[#8fa4c2] mt-1">
          UK & India Operations Hub v2.0
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

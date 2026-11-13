'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Bell,
  Plus,
  ShieldCheck,
  ChevronDown,
  Menu,
  CheckCircle,
  Lock,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuToggle }) => {
  const pathname = usePathname();
  const {
    currentRole,
    setCurrentRole,
    logout,
    permissions,
    setIsSearchModalOpen,
    setIsQuickActionOpen,
    setIsNotificationOpen,
    defects,
    payments,
    emails,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const segment = pathname.split('/')[1];
    const titles: Record<string, string> = {
      clients: 'Client Management',
      projects: 'Project Management',
      quotations: 'Quotations & Enhancements',
      documents: 'Documents & Drawings',
      payments: 'Payments & Finance',
      procurement: 'Products & Procurement',
      vendors: 'Vendors & Suppliers',
      milestones: 'Milestones & Tasks',
      communications: 'Communication Hub',
      gallery: 'Project Gallery',
      defects: 'Defects & Snagging',
      maintenance: 'Maintenance & Warranty',
      reports: 'Reports & Analytics',
      users: 'Users & Permissions',
      settings: 'Settings & Audit Log',
      login: 'Enterprise SSO & 2FA Portal',
    };
    return titles[segment] || 'AMR FRNTR ERP';
  };

  const availableRoles = [
    'Administrator / Director',
    'UK Project Manager / Sales',
    'India Project Coordinator',
    'Procurement / Sourcing',
    'Finance',
    'Workshop / Production',
    'Installer',
    'Management Read-only',
    'Client Portal (External)',
  ];

  const overdueCount = payments.filter((p) => p.status === 'Overdue').length;
  const unreadEmailCount = emails.filter((e) => e.unread || e.needsReply).length;
  const openDefects = defects.filter((d) => d.status !== 'Resolved' && d.status !== 'Closed').length;
  const totalAttention = overdueCount + unreadEmailCount + openDefects;

  const initials =
    currentRole
      .split(' ')
      .filter((w) => w.length > 2)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD';

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-xl border-b border-white/80 px-4 md:px-8 flex items-center justify-between shadow-[0_4px_24px_rgba(23,36,59,0.06)]">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-[#7b8798] hover:text-[#17243b] hover:bg-white/80 rounded-xl"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="text-[#4268e8] font-extrabold hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> AMR FRNTR
          </span>
          <span className="text-[#cbd5e1] hidden sm:inline">/</span>
          <h1 className="font-extrabold text-[#17243b] tracking-tight">{getPageTitle()}</h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Quick Action, Role Selector */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-1.5 md:py-2 text-xs text-[#64748b] bg-white/80 hover:bg-white border border-[#cbd5e1]/80 hover:border-[#4268e8]/50 rounded-xl shadow-2xs hover:shadow-[0_0_18px_rgba(66,104,232,0.16)] transition-all w-28 sm:w-48 md:w-60 cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#4268e8] shrink-0" />
          <span className="truncate">Search anything...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] font-bold text-[#4268e8] bg-[#edf1ff]/80 border border-[#cbd8ff] px-1.5 py-0.5 rounded-md">
            ⌘K
          </kbd>
        </button>

        {/* RBAC Privacy / Read-Only Indicator */}
        {!permissions.canViewCostsAndMargins && (
          <div
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#fff1f2]/85 text-[#c84c58] text-[11px] font-bold rounded-xl border border-[#fecdd3] shadow-[0_0_14px_rgba(200,76,88,0.2)]"
            title="Internal supplier costs & margins are hidden for this role (UAT #15)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Costs/Margins Hidden</span>
          </div>
        )}
        {permissions.isReadOnly && (
          <div
            className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#fffbeb]/85 text-[#b45309] text-[11px] font-bold rounded-xl border border-[#fde68a] shadow-[0_0_14px_rgba(245,158,11,0.2)]"
            title="Read-only role active"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Read-Only</span>
          </div>
        )}

        {/* Quick Action Button */}
        {permissions.canEdit && (
          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 md:py-2 bg-gradient-to-r from-[#4268e8]/85 to-[#3556d4]/85 text-white hover:from-[#4268e8] hover:to-[#2e4ec7] text-xs font-bold rounded-xl border border-white/25 shadow-[0_4px_16px_rgba(66,104,232,0.35)] hover:shadow-[0_6px_22px_rgba(66,104,232,0.55)] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Create</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2 rounded-xl bg-white/80 text-[#475569] hover:text-[#4268e8] hover:bg-white border border-[#cbd5e1]/80 hover:border-[#4268e8]/50 hover:shadow-[0_0_16px_rgba(66,104,232,0.18)] transition-all cursor-pointer"
          title="Attention items"
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          {totalAttention > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-[#c84c58] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_12px_#c84c58] animate-pulse">
              {totalAttention}
            </span>
          )}
        </button>

        {/* Role Switcher & Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 bg-white/80 hover:bg-white rounded-xl border border-[#cbd5e1]/80 hover:border-[#4268e8]/50 hover:shadow-[0_4px_18px_rgba(66,104,232,0.16)] transition-all text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4268e8] to-[#223653] text-white font-extrabold text-xs flex items-center justify-center shadow-[0_0_12px_rgba(66,104,232,0.4)]">
              {initials}
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-extrabold text-[#17243b] leading-tight truncate max-w-[140px]">
                {currentRole}
              </div>
              <div className="text-[10px] text-[#64748b]">
                {!permissions.canViewCostsAndMargins
                  ? 'Restricted Cost View'
                  : permissions.isReadOnly
                  ? 'Read-Only Access'
                  : 'Full Commercial View'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748b] hidden sm:block" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(23,36,59,0.22),0_0_25px_rgba(66,104,232,0.15)] border border-white py-2 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-[#e2e8f0]">
                <div className="font-extrabold text-[#17243b]">Switch Perspective / Role (9 Roles)</div>
                <div className="text-[10px] text-[#64748b] mt-0.5">
                  Live RBAC: hides internal costs/margins for Workshop, Installer & Client Portal
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {availableRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 hover:bg-[#edf1ff]/60 text-left transition-colors cursor-pointer ${
                      currentRole === role ? 'font-bold text-[#4268e8] bg-[#edf1ff]/80' : 'text-[#334155]'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <CheckCircle className="w-3.5 h-3.5 text-[#4268e8]" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-[#e2e8f0] pt-1 mt-1 px-2">
                <button
                  type="button"
                  onClick={() => {
                    setRoleDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#c84c58] hover:bg-[#fff1f2] font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#c84c58]" />
                  <span>Sign Out & Lock ERP Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import {
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Building2,
  Briefcase,
  Globe2,
  PackageCheck,
  PoundSterling,
  Hammer,
  Wrench,
  FileSearch,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

interface RoleProfile {
  role: string;
  shortLabel: string;
  userName: string;
  email: string;
  location: string;
  badgeColor: string;
  canViewMargins: boolean;
  canEdit: boolean;
  canApprove: boolean;
  description: string;
  icon: React.ReactNode;
}

const ROLE_PROFILES: RoleProfile[] = [
  {
    role: 'Administrator / Director',
    shortLabel: 'Director / Admin',
    userName: 'Richard Sterling',
    email: 'richard.sterling@amrfrntr.co.uk',
    location: 'Mayfair HQ, London',
    badgeColor: 'from-[#d5b27a] to-[#b8860b]',
    canViewMargins: true,
    canEdit: true,
    canApprove: true,
    description: 'Full Executive Control, Margin Visibility, PO & Drawing Sign-Off',
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    role: 'UK Project Manager / Sales',
    shortLabel: 'UK Project Manager',
    userName: 'Sarah Mitchell',
    email: 'sarah.mitchell@amrfrntr.co.uk',
    location: 'Soho Studio, London',
    badgeColor: 'from-[#4268e8] to-[#2563eb]',
    canViewMargins: true,
    canEdit: true,
    canApprove: true,
    description: 'Client Accounts, Quotations, Enhancements & UK Site Delivery',
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    role: 'India Project Coordinator',
    shortLabel: 'India Coordinator',
    userName: 'Arjun Mehta',
    email: 'arjun.mehta@amrfrntr.in',
    location: 'Mumbai Operations Hub',
    badgeColor: 'from-[#0ea5e9] to-[#0284c7]',
    canViewMargins: false,
    canEdit: true,
    canApprove: false,
    description: 'CAD Drawings, Milestones & Vendor Follow-up (Costs/Margins Masked 🔒)',
    icon: <Globe2 className="w-4 h-4" />,
  },
  {
    role: 'Procurement / Sourcing',
    shortLabel: 'Procurement Lead',
    userName: 'Priya Nair',
    email: 'priya.nair@amrfrntr.in',
    location: 'Delhi / Jodhpur Sourcing',
    badgeColor: 'from-[#10b981] to-[#059669]',
    canViewMargins: true,
    canEdit: true,
    canApprove: false,
    description: 'Vendor RFQs, Purchase Orders, 7/3/1-Day Chase & Landed Costs',
    icon: <PackageCheck className="w-4 h-4" />,
  },
  {
    role: 'Finance',
    shortLabel: 'Finance Controller',
    userName: 'David Kensington',
    email: 'david.kensington@amrfrntr.co.uk',
    location: 'London Finance Desk',
    badgeColor: 'from-[#8b5cf6] to-[#6d28d9]',
    canViewMargins: true,
    canEdit: true,
    canApprove: true,
    description: 'Client Payment Schedules, 50% Part-Pay & Supplier Remittances',
    icon: <PoundSterling className="w-4 h-4" />,
  },
  {
    role: 'Workshop / Production',
    shortLabel: 'Workshop / Factory',
    userName: 'Vikram Singh',
    email: 'vikram.singh@amrfrntr.in',
    location: 'Jaipur Bespoke Joinery',
    badgeColor: 'from-[#f59e0b] to-[#d97706]',
    canViewMargins: false,
    canEdit: true,
    canApprove: false,
    description: 'Joinery Production, Approved v3 Drawings & QC (Costs Masked 🔒)',
    icon: <Hammer className="w-4 h-4" />,
  },
  {
    role: 'Installer',
    shortLabel: 'UK Site Installer',
    userName: 'Mark Davies',
    email: 'mark.davies@amrfrntr.co.uk',
    location: 'UK Field Fit-Out Team',
    badgeColor: 'from-[#ec4899] to-[#db2777]',
    canViewMargins: false,
    canEdit: true,
    canApprove: false,
    description: 'On-Site Installation, Snagging & Completion Photos (Costs Masked 🔒)',
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    role: 'Management Read-only',
    shortLabel: 'Board Read-Only',
    userName: 'Lord Alistair Vance',
    email: 'board.observer@amrfrntr.co.uk',
    location: 'Non-Executive Board',
    badgeColor: 'from-[#64748b] to-[#475569]',
    canViewMargins: true,
    canEdit: false,
    canApprove: false,
    description: 'Executive Portfolio & Financial Oversight (Strict Read-Only Mode)',
    icon: <FileSearch className="w-4 h-4" />,
  },
  {
    role: 'Client Portal',
    shortLabel: 'Client Portal',
    userName: 'Olivia Hart (North & Co.)',
    email: 'olivia@northco.co.uk',
    location: 'External Client Access',
    badgeColor: 'from-[#14b8a6] to-[#0d9488]',
    canViewMargins: false,
    canEdit: false,
    canApprove: false,
    description: 'Client Drawing Sign-Off, Live Milestones & Invoices (Internal Masked 🔒)',
    icon: <UserCheck className="w-4 h-4" />,
  },
];

const SHOWCASE_BACKGROUNDS = [
  {
    title: 'The Alder Restaurant · Soho, London',
    subtitle: 'Bespoke fluted walnut booth joinery, aged brass lighting & Italian marble bar fit-out',
    projectCode: 'FFC-2026-001',
    value: '£95,000 Contract',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=85',
  },
  {
    title: 'Mayfair Executive Suites · London W1',
    subtitle: 'Acoustic architectural oak panelling, custom boardroom tables & luxury lounge furniture',
    projectCode: 'FFC-2026-003',
    value: '£186,900 Contract',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85',
  },
  {
    title: 'Riverside Boutique Hotel · Manchester',
    subtitle: 'Turnkey 42-suite hospitality furniture manufacture, headboard joinery & lobby fit-out',
    projectCode: 'FFC-2026-002',
    value: '£132,500 Contract',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { currentRole, isAuthenticated, login, showToast } = useApp();

  const initialProfile =
    ROLE_PROFILES.find((p) => p.role === currentRole) || ROLE_PROFILES[1];

  const [selectedProfile, setSelectedProfile] = useState<RoleProfile>(initialProfile);
  const [email, setEmail] = useState(initialProfile.email);
  const [password, setPassword] = useState('AMR-Enterprise-2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('849 201');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSelectRole = (profile: RoleProfile) => {
    setSelectedProfile(profile);
    setEmail(profile.email);
    setMfaCode(
      `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`
    );
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      login(selectedProfile.role);
      setIsAuthenticating(false);
      showToast(
        `Welcome ${selectedProfile.userName} · Signed in as ${selectedProfile.role}`,
        'success'
      );
      router.push('/');
    }, 300);
  };

  const activeBg = SHOWCASE_BACKGROUNDS[bgIndex];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#090f1d] select-none">
      {/* ================================================================= */}
      {/* FULL-SCREEN ARCHITECTURAL LUXURY FIT-OUT BACKGROUND IMAGE         */}
      {/* ================================================================= */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeBg.url}
          alt={activeBg.title}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out"
        />
        {/* Multi-layered luxury dark navy, gold & sapphire vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070d19]/92 via-[#0c1629]/82 to-[#091224]/88" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(66,104,232,0.28),transparent_50%),radial-gradient(circle_at_82%_20%,rgba(213,178,122,0.24),transparent_48%)]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-screen">
        {/* =============================================================== */}
        {/* LEFT COLUMN (7 COLS): LUXURY BRANDING & ROLE MATRIX SELECTOR    */}
        {/* =============================================================== */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 flex flex-col justify-between space-y-6 text-white"
        >
          {/* Brand Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d5b27a] via-[#c59b57] to-[#9a7332] text-[#0b1323] flex items-center justify-center font-black text-lg shadow-[0_0_30px_rgba(213,178,122,0.45)] border border-white/30">
                AF
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-wider text-white">
                    AMR FRNTR
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest rounded-full bg-[#d5b27a]/20 text-[#f1dfbd] border border-[#d5b27a]/40">
                    Enterprise ERP v4.2
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  UK & India Bespoke Furniture Manufacturing & Commercial Fit-Out Platform
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
              >
                <span>Return to Live ERP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/35 text-[11px] font-bold text-[#f1dfbd] flex items-center gap-1.5 backdrop-blur-md">
                <Lock className="w-3.5 h-3.5 text-[#d5b27a]" />
                <span>Authentication Required</span>
              </div>
            )}
          </div>

          {/* Hero Headline */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4268e8]/25 border border-[#6088ff]/40 text-[#bcd0ff] text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#d5b27a]" />
              <span>9-ROLE RBAC SECURITY · UK & INDIA OPERATIONS PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black tracking-tight leading-[1.12] text-white">
              Precision Control from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f1dfbd] via-[#d5b27a] to-[#93c5fd]">
                Bespoke Drawing
              </span>{' '}
              to Site Handover.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Select any operational role below to auto-fill credentials and preview real-time Role-Based Access Control (RBAC), automatic supplier cost/margin masking, and dedicated regional dashboards.
            </p>
          </div>

          {/* Interactive 9-Role Quick Selector Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#f1dfbd] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#d5b27a]" />
                Select Role Profile to Auto-Fill Credentials (9 ERP Roles):
              </span>
              <span className="text-[11px] text-slate-300">
                Active: <b className="text-[#f1dfbd]">{selectedProfile.shortLabel}</b>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {ROLE_PROFILES.map((prof) => {
                const isSelected = prof.role === selectedProfile.role;
                return (
                  <button
                    key={prof.role}
                    type="button"
                    onClick={() => handleSelectRole(prof)}
                    className={`group text-left p-3 rounded-2xl border backdrop-blur-xl transition-all duration-200 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#1e345c]/95 via-[#172847]/95 to-[#253f6e]/95 border-[#d5b27a] shadow-[0_10px_28px_rgba(213,178,122,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                        : 'bg-white/10 hover:bg-white/15 border-white/15 hover:border-white/35'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl bg-gradient-to-br ${prof.badgeColor} text-white flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        {prof.icon}
                      </div>
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          prof.canViewMargins
                            ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                            : 'bg-rose-500/20 text-rose-200 border-rose-400/30'
                        }`}
                      >
                        {prof.canViewMargins ? '£ Margins Visible' : '🔒 Costs Masked'}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="text-xs font-extrabold text-white truncate flex items-center justify-between">
                        <span>{prof.shortLabel}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d5b27a] shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-300 truncate mt-0.5">
                        {prof.userName} · {prof.location}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Architectural Showcase Switcher Bar */}
          <div className="p-3.5 rounded-2xl bg-[#0b1528]/80 backdrop-blur-xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-[#d5b27a]/20 text-[#f1dfbd] border border-[#d5b27a]/35">
                  {activeBg.projectCode}
                </span>
                <span className="text-xs font-bold text-white truncate">
                  {activeBg.title}
                </span>
                <span className="text-[11px] font-bold text-emerald-300 hidden sm:inline">
                  · {activeBg.value}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {activeBg.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {SHOWCASE_BACKGROUNDS.map((bg, idx) => (
                <button
                  key={bg.projectCode}
                  type="button"
                  onClick={() => setBgIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    bgIndex === idx
                      ? 'bg-[#d5b27a] text-[#0b1323] shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  Scene {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* =============================================================== */}
        {/* RIGHT COLUMN (5 COLS): PREMIUM GLASSMORPHIC LOGIN CARD          */}
        {/* =============================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="relative rounded-3xl bg-gradient-to-b from-[#13223d]/90 via-[#101d35]/92 to-[#0c172b]/95 backdrop-blur-2xl border border-white/20 shadow-[0_30px_70px_-12px_rgba(0,0,0,0.65),0_0_40px_rgba(66,104,232,0.22),inset_0_1px_0_rgba(255,255,255,0.25)] overflow-hidden p-6 sm:p-8 text-white">
            {/* Top Specular Gold-Sapphire Accent Line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#4268e8] via-[#d5b27a] to-[#10b981]" />

            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d5b27a] block">
                  SECURE WORKSTATION SIGN-IN
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Role-Based ERP Portal
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/35 flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                2FA + TLS 1.3
              </span>
            </div>

            {/* Selected Role Live Permission Strip */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1d3158]/90 via-[#192b4d]/90 to-[#1e335c]/90 border border-[#6088ff]/40 mb-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${selectedProfile.badgeColor} text-white flex items-center justify-center shrink-0 shadow-md`}
                  >
                    {selectedProfile.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white truncate">
                      {selectedProfile.role}
                    </div>
                    <div className="text-[11px] text-[#f1dfbd] font-semibold truncate">
                      {selectedProfile.userName} · {selectedProfile.location}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-2 leading-snug">
                {selectedProfile.description}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10 text-[10px] font-bold">
                <span
                  className={`px-2 py-0.5 rounded-md ${
                    selectedProfile.canViewMargins
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                      : 'bg-rose-500/25 text-rose-200 border border-rose-400/30'
                  }`}
                >
                  {selectedProfile.canViewMargins
                    ? '✓ Costs & Margins Unlocked'
                    : '🔒 Costs & Margins Hidden (UAT #15)'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  {selectedProfile.canEdit ? '✓ Create / Edit Enabled' : '👁 Read-Only Mode'}
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Role Dropdown Selector */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  1. Active ERP Role Profile
                </label>
                <select
                  value={selectedProfile.role}
                  onChange={(e) => {
                    const found = ROLE_PROFILES.find((r) => r.role === e.target.value);
                    if (found) handleSelectRole(found);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-[#0c1629]/90 border border-white/25 hover:border-[#d5b27a]/70 focus:border-[#d5b27a] rounded-xl text-white outline-none transition-all cursor-pointer"
                >
                  {ROLE_PROFILES.map((r) => (
                    <option key={r.role} value={r.role} className="bg-[#0f172a] text-white">
                      {r.role} — ({r.userName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Corporate Email Input */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                  2. Corporate Email / Workspace ID
                </label>
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-[#4268e8]/25 border border-[#4268e8]/40 flex items-center justify-center absolute left-2 top-1.5">
                    <Mail className="w-4 h-4 text-[#93c5fd]" />
                  </div>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@amrfrntr.co.uk"
                    className="w-full pl-12 pr-3.5 py-2.5 text-xs font-semibold bg-[#0c1629]/85 border border-white/20 focus:border-[#6088ff] rounded-xl text-white placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password + 2FA Code Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
                    3. Security Password
                  </label>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center absolute left-2 top-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#f1dfbd]" />
                    </div>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-9 py-2.5 text-xs font-semibold bg-[#0c1629]/85 border border-white/20 focus:border-[#6088ff] rounded-xl text-white outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-3 text-slate-400 hover:text-white cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                      4. 2FA Token Code
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setMfaCode(
                          `${Math.floor(100 + Math.random() * 900)} ${Math.floor(
                            100 + Math.random() * 900
                          )}`
                        )
                      }
                      className="text-[10px] font-bold text-[#d5b27a] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> New OTP
                    </button>
                  </div>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-[#d5b27a]/20 border border-[#d5b27a]/40 flex items-center justify-center absolute left-2 top-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#f1dfbd]" />
                    </div>
                    <input
                      required
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full pl-12 pr-3 py-2.5 text-xs font-mono font-black tracking-widest bg-[#0c1629]/85 border border-white/20 focus:border-[#d5b27a] rounded-xl text-[#f1dfbd] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Remember Device & SSO Info */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-[#4268e8] focus:ring-0"
                  />
                  <span>Trust workstation for 30 days</span>
                </label>
                <span className="text-[11px] text-[#93c5fd] font-semibold">
                  SSO Enabled
                </span>
              </div>

              {/* Primary Submit CTA */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="group relative w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#4268e8] via-[#5277f7] to-[#d5b27a] hover:from-[#3556d4] hover:via-[#4268e8] hover:to-[#c59b57] text-white font-black text-xs sm:text-sm tracking-wide shadow-[0_10px_30px_rgba(66,104,232,0.45)] hover:shadow-[0_14px_36px_rgba(213,178,122,0.45)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer overflow-hidden"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span>
                  {isAuthenticating
                    ? `Authenticating ${selectedProfile.shortLabel}...`
                    : `Sign In as ${selectedProfile.shortLabel}`}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Enterprise SSO Buttons */}
              <div className="pt-2 border-t border-white/15 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    login(selectedProfile.role);
                    showToast(
                      `Google Workspace SSO Verified · Logged in as ${selectedProfile.role}`,
                      'info'
                    );
                    router.push('/');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="w-4 h-4 rounded-full bg-white text-[#17243b] font-black text-[10px] flex items-center justify-center">
                    G
                  </span>
                  <span>Google SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    login(selectedProfile.role);
                    showToast(
                      `Microsoft Entra 365 SSO Verified · Logged in as ${selectedProfile.role}`,
                      'info'
                    );
                    router.push('/');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span className="w-4 h-4 rounded bg-[#00a4ef] text-white font-black text-[10px] flex items-center justify-center">
                    M
                  </span>
                  <span>Microsoft 365</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

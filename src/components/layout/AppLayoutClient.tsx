'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import LoginPage from '@/app/login/page';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { QuickActionModal } from '@/components/layout/QuickActionModal';
import { NotificationDrawer } from '@/components/layout/NotificationDrawer';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const AppLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 600, y: 300 });
  const pathname = usePathname();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mandatory Login Gate: Do not render Dashboard/ERP until user logs in
  if (!isAuthenticated || pathname === '/login') {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex bg-[#eef2f9] overflow-x-hidden">
      {/* ================================================================= */}
      {/* AMBIENT FLOATING LIGHTING ORBS & INTERACTIVE CURSOR SPOTLIGHT     */}
      {/* ================================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Top-left Sapphire Ambient Light */}
        <div className="absolute -top-28 left-1/4 w-[480px] h-[480px] rounded-full bg-[#4268e8]/14 blur-[110px] animate-ambient-slow" />
        {/* Top-right Champagne Gold Ambient Light */}
        <div className="absolute top-16 -right-20 w-[420px] h-[420px] rounded-full bg-[#d5b27a]/18 blur-[100px] animate-ambient-reverse" />
        {/* Bottom-center Emerald/Indigo Ambient Light */}
        <div className="absolute -bottom-32 left-1/2 w-[520px] h-[520px] rounded-full bg-[#16845f]/10 blur-[120px] animate-ambient-slow" />

        {/* Live Interactive Cursor Lighting Spotlight */}
        <div
          className="fixed inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(620px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(66, 104, 232, 0.085), rgba(213, 178, 122, 0.04) 40%, transparent 70%)`,
          }}
        />
      </div>

      {/* Sidebar navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        <Topbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto"
        >
          {children}
        </motion.main>
      </div>

      {/* Global Interactive Overlays */}
      <GlobalSearchModal />
      <QuickActionModal />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};

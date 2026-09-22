"use client";

import React, { useState } from "react";
import { ParentProvider } from "@/context/ParentContext";
import ParentSidebar from "@/components/parent/ParentSidebar";
import ParentHeader from "@/components/parent/ParentHeader";
import ParentSearchModal from "@/components/parent/ParentSearchModal";

export default function ParentRootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ParentProvider>
      <div className="flex h-screen w-full bg-[#F4F8FD] dark:bg-[#0B1020] text-[#172033] dark:text-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-[#0050CB]/20 selection:text-[#0050CB]">
        {/* Permanent Left Sidebar */}
        <ParentSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
          {/* Sticky Top Header */}
          <ParentHeader onOpenMobileMenu={() => setIsMobileOpen(true)} />

          {/* Page Scroll Body */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 lg:p-6 scroll-smooth">
            <div className="max-w-[1600px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>

        {/* Global ⌘K Command Palette */}
        <ParentSearchModal />
      </div>
    </ParentProvider>
  );
}

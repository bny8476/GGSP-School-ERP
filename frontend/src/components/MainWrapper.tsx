"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/portal") || pathname?.startsWith("/parent") || pathname === "/login";

  return (
    <main className={`flex-grow ${isAppRoute ? "" : "pt-20"}`}>
      {children}
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PortalRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/parent");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="w-10 h-10 rounded-full border-4 border-[#0050CB]/20 border-t-[#0050CB] animate-spin" />
      <p className="text-xs font-bold text-slate-500">Redirecting to GGPS Parent Portal...</p>
    </div>
  );
}

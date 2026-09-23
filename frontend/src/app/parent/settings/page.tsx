"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParentSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/parent/account");
  }, [router]);

  return null;
}

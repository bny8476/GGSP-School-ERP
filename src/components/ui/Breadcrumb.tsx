"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 ${className}`} aria-label="Breadcrumb">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-[#0757D5] dark:hover:text-[#2F80ED] transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 mx-1.5 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-bold text-[#07152F] dark:text-white truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-[#0757D5] dark:hover:text-[#2F80ED] transition-colors truncate max-w-[180px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

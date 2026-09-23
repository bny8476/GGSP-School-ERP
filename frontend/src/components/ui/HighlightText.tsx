'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HighlightTextProps {
  children: React.ReactNode;
  className?: string;
  highlightColor?: 'blue' | 'orange' | 'yellow' | 'gradient';
  trigger?: 'scroll' | 'hover';
  delay?: number;
}

export function HighlightText({
  children,
  className = '',
  highlightColor = 'blue',
  trigger = 'scroll',
  delay = 200,
}: HighlightTextProps) {
  const [isActive, setIsActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion || trigger === 'hover') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setIsActive(true), delay);
          if (ref.current) observer.unobserve(ref.current);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [delay, trigger]);

  const colorStyles: Record<string, string> = {
    blue: 'bg-gradient-to-r from-[#E5EEFF] to-[#CCE0FF] dark:from-[#0050CB]/35 dark:to-[#38BDF8]/25',
    orange: 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-[#FF690C]/30 dark:to-amber-500/25',
    yellow: 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-500/25 dark:to-amber-500/20',
    gradient: 'bg-gradient-to-r from-[#E5EEFF] via-orange-100 to-[#CCE0FF] dark:from-[#0050CB]/30 dark:via-[#FF690C]/20 dark:to-[#38BDF8]/25',
  };

  return (
    <span
      ref={ref}
      onMouseEnter={() => trigger === 'hover' && setIsActive(true)}
      onMouseLeave={() => trigger === 'hover' && setIsActive(false)}
      className={`relative inline-block z-10 font-inherit ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className={`absolute left-[-3px] right-[-3px] bottom-[8%] h-[42%] rounded-md z-0 origin-left transition-transform duration-700 ease-out will-change-transform ${colorStyles[highlightColor]}`}
        style={{
          transform: prefersReducedMotion || isActive ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
    </span>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  wordClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number; // base delay in ms
  stagger?: number; // delay between words in ms
  once?: boolean;
}

export function SplitText({
  children,
  className = '',
  wordClassName = '',
  as: Component = 'div',
  delay = 0,
  stagger = 60,
  once = true,
}: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    if (mediaQuery.matches) {
      setIsVisible(true);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) observer.unobserve(ref.current);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [once]);

  const Tag = Component as any;

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const words = children.split(' ');

  return (
    <Tag
      ref={ref}
      className={`inline-flex flex-wrap items-center ${className}`}
      aria-label={children}
    >
      {words.map((word, idx) => {
        const wordDelay = delay + idx * stagger;
        return (
          <span
            key={idx}
            className="inline-block overflow-hidden py-1 mr-[0.28em] last:mr-0 align-bottom"
          >
            <span
              className={`inline-block transition-all duration-600 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${wordClassName}`}
              style={{
                transform: isVisible ? 'translateY(0%)' : 'translateY(115%)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${wordDelay}ms`,
              }}
              aria-hidden="true"
            >
              {word}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

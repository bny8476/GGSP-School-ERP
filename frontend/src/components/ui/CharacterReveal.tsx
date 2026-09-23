'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CharacterRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
  delay?: number; // base delay in ms
  stagger?: number; // delay between characters in ms (default: 25ms)
  once?: boolean;
}

export function CharacterReveal({
  text,
  className = '',
  as: Component = 'span',
  delay = 0,
  stagger = 25,
  once = true,
}: CharacterRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
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
    };
  }, [once, prefersReducedMotion]);

  const Tag = Component as React.ElementType;

  // Reduced motion: instantaneous plain text
  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const chars = Array.from(text);

  return (
    <Tag
      ref={ref}
      className={`inline-block overflow-hidden ${className}`}
      aria-label={text}
    >
      {chars.map((char, index) => {
        const charDelay = delay + index * stagger;
        return (
          <span
            key={index}
            className="inline-block transition-all duration-500 ease-out will-change-transform"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? 'translateY(0) rotate(0deg) scale(1)'
                : 'translateY(18px) rotate(4deg) scale(0.95)',
              filter: isVisible ? 'blur(0px)' : 'blur(4px)',
              transitionDelay: `${charDelay}ms`,
            }}
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </Tag>
  );
}

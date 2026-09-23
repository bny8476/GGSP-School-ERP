'use client';

import React, { useEffect, useRef, useState } from 'react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  distance?: number; // in px, default 24
  duration?: number; // in ms, default 600
  delay?: number; // in ms, default 0
  className?: string;
  as?: 'div' | 'section' | 'article' | 'span' | 'p';
  once?: boolean;
}

export function ScrollReveal({
  children,
  direction = 'up',
  distance = 24,
  duration = 600,
  delay = 0,
  className = '',
  as: Component = 'div',
  once = true,
}: ScrollRevealProps) {
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
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [once, prefersReducedMotion]);

  const Tag = Component as React.ElementType;

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      case 'scale':
        return 'scale(0.94)';
      default:
        return 'none';
    }
  };

  return (
    <Tag
      ref={ref}
      className={`transition-all cubic-bezier(0.16, 1, 0.3, 1) will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

'use client';

import React, { useState } from 'react';

type HoverEffect = 'expand' | 'underline' | 'glow' | 'slideUp' | 'nudge';

interface TextHoverProps {
  children: React.ReactNode;
  effect?: HoverEffect;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'a';
  href?: string;
  onClick?: () => void;
}

export function TextHover({
  children,
  effect = 'underline',
  className = '',
  as: Component = 'span',
  href,
  onClick,
}: TextHoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Tag = Component as any;

  const getEffectClasses = () => {
    switch (effect) {
      case 'expand':
        return 'hover-expand-spacing inline-block';
      case 'glow':
        return 'hover-glow-text inline-block';
      case 'nudge':
        return 'inline-block transition-transform duration-200 ease-out hover:translate-x-1';
      case 'underline':
        return 'hover-underline-grow inline-block';
      case 'slideUp':
        return 'relative inline-block overflow-hidden';
      default:
        return '';
    }
  };

  // If slideUp effect is requested and children is a string, do the dual-layer roll
  if (effect === 'slideUp' && typeof children === 'string') {
    return (
      <Tag
        href={href}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative inline-block overflow-hidden align-top ${className}`}
      >
        <span
          className="block transition-transform duration-300 ease-out"
          style={{
            transform: isHovered ? 'translateY(-100%)' : 'translateY(0%)',
          }}
        >
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 block transition-transform duration-300 ease-out text-[#0050CB] dark:text-[#38BDF8]"
          style={{
            transform: isHovered ? 'translateY(0%)' : 'translateY(100%)',
          }}
        >
          {children}
        </span>
      </Tag>
    );
  }

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`${getEffectClasses()} ${className}`}
    >
      {children}
    </Tag>
  );
}

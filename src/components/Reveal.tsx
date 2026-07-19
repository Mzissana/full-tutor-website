import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
  once?: boolean;
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const Tag = as as 'div';

  return (
    <Tag
      className={`animate-fadeUp ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

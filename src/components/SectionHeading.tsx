import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowColor?: 'blush' | 'butter' | 'lavender' | 'sky' | 'mint' | 'peach';
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

const eyebrowStyles: Record<string, string> = {
  blush: 'bg-blush/20 text-navy',
  butter: 'bg-butter/25 text-navy',
  lavender: 'bg-lavender/25 text-navy',
  sky: 'bg-sky/25 text-navy',
  mint: 'bg-mint/25 text-navy',
  peach: 'bg-peach/25 text-navy',
};

export function SectionHeading({
  eyebrow,
  eyebrowColor = 'lavender',
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start';
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow && <span className={`eyebrow ${eyebrowStyles[eyebrowColor]}`}>{eyebrow}</span>}
      <h2 className="section-title text-balance">{title}</h2>
      {description && <p className="section-body text-pretty">{description}</p>}
    </Reveal>
  );
}

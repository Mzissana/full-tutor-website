import { useEffect, useState } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { Send } from 'lucide-react';
import { SITE } from '../config';
import { useRouter } from '../router';
import { trackMetrikaGoal } from '../analytics';

type Variant = 'butter' | 'navy' | 'blush' | 'ghost';

interface TelegramButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children?: ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  butter: 'btn-butter',
  navy: 'btn-navy',
  blush: 'btn-blush',
  ghost: 'btn-ghost',
};

export function TelegramButton({
  variant = 'blush',
  children = 'Написать в Telegram',
  className = '',
  onClick,
  ...rest
}: TelegramButtonProps) {
  const href = SITE.telegram;
  const isPlaceholder = href === 'TELEGRAM_LINK';
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    trackMetrikaGoal('telegram_click', { link_text: typeof children === 'string' ? children : 'Telegram' });
    (onClick as unknown as MouseEventHandler<HTMLAnchorElement> | undefined)?.(event);
  };

  if (isPlaceholder) {
    return (
      <button
        type="button"
        className={`${variantClasses[variant]} ${className}`}
        onClick={onClick}
        {...rest}
      >
        <Send className="h-5 w-5" />
        {children}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variantClasses[variant]} ${className}`}
      onClick={handleClick}
    >
      <Send className="h-5 w-5" />
      {children}
    </a>
  );
}

export function TelegramFab() {
  const [show, setShow] = useState(false);
  const { page } = useRouter();
  const href = SITE.telegram;
  const isPlaceholder = href === 'TELEGRAM_LINK';

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  const cls = `fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-blush text-navy shadow-float transition-all duration-300 hover:scale-105 md:hidden ${
    show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
  }`;

  if (isPlaceholder) {
    return (
      <button type="button" aria-label="Написать в Telegram" className={cls}>
        <Send className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-[48%] -translate-y-[43%]" />
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в Telegram"
      className={cls}
      onClick={() => trackMetrikaGoal('telegram_click', { placement: 'mobile_floating_button' })}
    >
      <Send className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-[48%] -translate-y-[43%]" />
    </a>
  );
}

interface VkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children?: ReactNode;
  className?: string;
}

export function VkButton({
  variant = 'blush',
  children = 'Написать во ВКонтакте',
  className = '',
  onClick,
  ...rest
}: VkButtonProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    trackMetrikaGoal('vk_click', { link_text: typeof children === 'string' ? children : 'VK' });
    onClick?.(event);
  };

  return (
    <a
      href={SITE.vk}
      target="_blank"
      rel="noopener noreferrer"
      className={`${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      <span className="font-display text-xs font-extrabold leading-none">VK</span>
      {children}
    </a>
  );
}

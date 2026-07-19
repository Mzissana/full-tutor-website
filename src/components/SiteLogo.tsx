type SiteLogoProps = {
  className?: string;
  variant?: 'light' | 'dark';
};

export function SiteLogo({ className = '', variant = 'light' }: SiteLogoProps) {
  return (
    <img
      src={`/images/mzissana-eng-mark-${variant}.webp?v=optimized-mark`}
      alt=""
      width="840"
      height="650"
      className={`block h-7 w-auto shrink-0 object-contain ${className}`}
    />
  );
}

type SiteLogoProps = {
  className?: string;
  variant?: 'light' | 'dark';
};

export function SiteLogo({ className = '', variant = 'light' }: SiteLogoProps) {
  return (
    <img
      src={`/images/mzissana-eng-mark-${variant}.png?v=yellow-mark`}
      alt=""
      className={`block h-7 w-auto shrink-0 object-contain ${className}`}
    />
  );
}

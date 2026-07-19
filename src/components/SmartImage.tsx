import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Image with graceful fallback to a neutral placeholder block if the
 * external photo fails to load.
 */
export function SmartImage({ src, alt, className = '', imgClassName = '', loading = 'lazy' }: SmartImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-wash-lavender ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-8 w-8 text-lavender/50" />
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onError={() => setError(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

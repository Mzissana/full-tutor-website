import { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

/**
 * Image with graceful fallback to a neutral placeholder block if the
 * external photo fails to load.
 */
export function SmartImage({ src, alt, className = '', imgClassName = '', loading = 'lazy', width = 1100, height = 825 }: SmartImageProps) {
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
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onError={() => setError(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

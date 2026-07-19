import { UserRound } from 'lucide-react';
import { SITE } from '../config';

interface TeacherPhotoProps {
  className?: string;
  src?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

/**
 * Renders the teacher's photo from a single placeholder.
 * Replace SITE.photo in src/config.ts with a real URL/path.
 */
export function TeacherPhoto({
  className = '',
  src = SITE.photo,
  loading = 'lazy',
  width = 853,
  height = 1280,
}: TeacherPhotoProps) {
  const isPlaceholder = src === 'PHOTO_PLACEHOLDER';

  if (isPlaceholder) {
    return (
      <div
        className={`relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-lavender/25 shadow-float ${className}`}
      >
        <div className="blob absolute -right-8 -top-6 h-32 w-32 bg-butter/40 opacity-70" />
        <div className="blob-2 absolute -bottom-8 -left-6 h-36 w-36 bg-blush/40 opacity-70" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/80 shadow-card backdrop-blur">
            <UserRound className="h-12 w-12 text-lavender" strokeWidth={1.4} />
          </div>
          <p className="max-w-[11rem] text-sm font-semibold text-navy/70">
            Здесь будет фотография преподавателя
          </p>
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-navy/60">
            PHOTO_PLACEHOLDER
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Мзиссана — преподаватель английского языка"
      width={width}
      height={height}
      className={`aspect-[4/5] w-full object-cover shadow-float ${className}`}
      loading={loading}
      decoding="async"
    />
  );
}

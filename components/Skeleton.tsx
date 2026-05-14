import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  circle = false,
  className = '',
}) => {
  return (
    <div
      className={`skeleton ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{
        width,
        height,
        backgroundSize: '200% 100%',
      }}
    />
  );
};

interface ImageSkeletonProps {
  className?: string;
}

export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gray-200 ${className}`}>
      <div className="skeleton absolute inset-0" style={{ backgroundSize: '200% 100%' }} />
    </div>
  );
};

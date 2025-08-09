'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export function Logo({ className = '', size = 'lg', centered = false }: LogoProps) {
  const textSizes = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl',
  };

  return (
    <Link 
      href="/" 
      className={`inline-block ${centered ? 'text-center w-full' : ''} ${className}`}
    >
      <h1 className={`${textSizes[size]} font-['Bebas_Neue'] tracking-wide`}>
        <span className="font-bold text-gray-800">STREAM</span>
        <span className="font-normal text-gray-600">RICH</span>
      </h1>
    </Link>
  );
}

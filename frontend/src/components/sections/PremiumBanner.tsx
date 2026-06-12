'use client';

import React from 'react';
import Link from 'next/link';
import { ScrollReveal } from '../ui';

interface PremiumBannerProps {
  id: string;
  tagline: string;
  title: string;
  description: string;
  image: string;
  isDarkTheme: boolean;
  bgGradient: string;
  linkAction: string;
  actionText: string;
  delay?: '0' | '100' | '200' | '300' | '400' | '500';
}

export const PremiumBanner: React.FC<PremiumBannerProps> = ({
  tagline,
  title,
  description,
  image,
  isDarkTheme,
  bgGradient,
  linkAction,
  actionText,
  delay = '0',
}) => {
  const isResponsive = bgGradient.includes('dark:');

  return (
    <div 
      className={`w-full bg-gradient-to-b ${bgGradient} pt-20 pb-0 px-6 flex flex-col items-center justify-between overflow-hidden relative min-h-[580px] md:min-h-[640px] border-y border-slate-200/40 dark:border-slate-900/60`}
    >
      {/* Centered text content */}
      <ScrollReveal 
        variant="fade-up" 
        delay={delay} 
        className="text-center z-10 max-w-2xl space-y-3 px-4"
      >
        <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${
          isDarkTheme 
            ? 'text-sky-400' 
            : isResponsive 
              ? 'text-primary dark:text-sky-400' 
              : 'text-primary'
        }`}>
          {tagline}
        </span>
        <h2 className={`text-4xl md:text-5xl font-semibold tracking-tight leading-tight ${
          isDarkTheme 
            ? 'text-white' 
            : isResponsive 
              ? 'text-[#1d1d1f] dark:text-[#f8fafc]' 
              : 'text-[#1d1d1f]'
        }`}>
          {title}
        </h2>
        <p className={`text-sm md:text-base font-normal leading-relaxed max-w-lg mx-auto ${
          isDarkTheme 
            ? 'text-slate-400' 
            : isResponsive 
              ? 'text-slate-500 dark:text-slate-400' 
              : 'text-slate-500'
        }`}>
          {description}
        </p>
        
        {/* Action buttons */}
        <div className="flex justify-center items-center pt-3">
          <Link href={linkAction}>
            <button className="bg-[#0071e3] text-white hover:bg-[#0077ed] text-sm font-normal px-6 py-2.5 rounded-full transition-all duration-200 cursor-pointer active:scale-95">
              {actionText}
            </button>
          </Link>
        </div>
      </ScrollReveal>

      {/* Centered prominent image below the content */}
      <ScrollReveal 
        variant="fade-up" 
        delay="200" 
        className="w-full max-w-4xl flex justify-center items-end mt-12 z-0 relative overflow-hidden"
      >
        <img 
          src={image} 
          alt={title}
          className="max-h-[320px] md:max-h-[380px] w-auto object-contain select-none pointer-events-none transform transition-transform duration-700 hover:scale-[1.02]"
        />
      </ScrollReveal>
    </div>
  );
};

export default PremiumBanner;

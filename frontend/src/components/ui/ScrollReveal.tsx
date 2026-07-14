'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up';
  duration?: '300' | '500' | '700' | '1000' | '1200';
  delay?: '0' | '100' | '200' | '300' | '400' | '500';
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  variant = 'fade-up',
  duration = '700',
  delay = '0',
  threshold = 0.1,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement && !once) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, once]);

  // CSS transitions states (initial vs visible)
  const variants = {
    'fade-in': {
      initial: 'opacity-0',
      visible: 'opacity-100',
    },
    'fade-up': {
      initial: 'opacity-0 translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-down': {
      initial: 'opacity-0 -translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    'fade-left': {
      initial: 'opacity-0 translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'fade-right': {
      initial: 'opacity-0 -translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    'scale-up': {
      initial: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
  };

  const durationClasses = {
    '300': 'duration-300',
    '500': 'duration-500',
    '700': 'duration-700',
    '1000': 'duration-1000',
    '1200': 'duration-1200',
  };

  const delayClasses = {
    '0': 'delay-0',
    '100': 'delay-100',
    '200': 'delay-200',
    '300': 'delay-300',
    '400': 'delay-400',
    '500': 'delay-500',
  };

  const transitionClass = `transition-all ease-out ${durationClasses[duration]} ${delayClasses[delay]}`;
  const animationStateClass = isVisible ? variants[variant].visible : variants[variant].initial;

  return (
    <div
      ref={elementRef}
      className={`${transitionClass} ${animationStateClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;

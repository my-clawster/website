import clsx from 'clsx';
import React, {type ElementType, type ReactNode, useEffect, useRef, useState} from 'react';

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({
  as: Component = 'div',
  children,
  className,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return undefined;
    }

    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {threshold: 0.18},
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={clsx('lr-reveal', className)}
      data-visible={visible}
      style={{['--lr-delay' as string]: `${delay}ms`}}>
      {children}
    </Component>
  );
}

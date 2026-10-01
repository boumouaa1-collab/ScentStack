import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in ms — pass index * 90 for a cascading grid effect. */
  delay?: number;
  className?: string;
  as?: 'div' | 'article' | 'li';
};

export default function Reveal({ children, delay = 0, className = '', as = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement> as never}
      className={`reveal-on-scroll ${inView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}

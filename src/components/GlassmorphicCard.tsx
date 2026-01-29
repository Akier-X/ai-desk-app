'use client';

import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-2xl border backdrop-blur-md transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-white/10 bg-white/5 hover:bg-white/8',
        interactive: 'border-white/20 bg-white/10 hover:bg-white/15 cursor-pointer',
        subtle: 'border-white/5 bg-white/[0.02]',
        elevated: 'border-white/20 bg-white/20 shadow-lg hover:shadow-xl',
      },
      padding: {
        sm: 'p-3',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

interface GlassmorphicCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

export function GlassmorphicCard({
  className,
  variant,
  padding,
  children,
  ...props
}: GlassmorphicCardProps) {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props}>
      {children}
    </div>
  );
}

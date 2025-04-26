import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
  withText?: boolean;
  className?: string;
}

const Logo = ({ 
  size = 'md', 
  variant = 'default',
  withText = true, 
  className 
}: LogoProps) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const variants = {
    default: 'text-primary bg-primary/10 dark:bg-primary/20',
    light: 'text-white bg-primary/80'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center justify-center rounded-lg',
          variants[variant],
          sizes[size]
        )}
      >
        <Sparkles className={cn(
          'stroke-current',
          size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
        )} />
      </motion.div>
      
      {withText && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            'font-semibold tracking-tight',
            textSizes[size],
            variant === 'default' ? 'text-gray-900 dark:text-white' : 'text-white'
          )}
        >
          JobAssistant<span className="text-primary font-bold">.ai</span>
        </motion.span>
      )}
    </div>
  );
};

export default Logo; 
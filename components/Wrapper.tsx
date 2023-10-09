import React from 'react';

import { cn } from '@/lib/utils';

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
};

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={cn('mx-auto w-full max-w-screen-xl px-2.5 md:px-20', className)}>
      {children}
    </div>
  )
};

export default Wrapper;
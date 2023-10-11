import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const AuthCallback = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  {/* Something to add here */}

  return (
    <div>AuthCallback</div>
  )
};

export default AuthCallback;
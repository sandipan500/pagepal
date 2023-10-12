import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '../_trpc/client';

const AuthCallback = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get('origin');

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(origin ? `/${origin}` : '/database')
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')
      }
    },
    retry: true,
    retryDelay: 500
  })

  return (
    <div>AuthCallback</div>
  )
};

export default AuthCallback;
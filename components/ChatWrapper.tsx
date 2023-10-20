'use client';

import React from 'react';

import Messages from './Messages';
import ChatInput from './ChatInput';
import { trpc } from '@/app/_trpc/client';
import { ChevronLeft, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

interface ChatWrapperProps {
  fileId: string;
};

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({
    fileId
  }, {
    refetchInterval: (data) =>
      data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500
  });

  if (isLoading) return (
    <div className='flex flex-col relative min-h-full bg-zinc-50 divide-y divide-zinc-200 gap-2 justify-between'>
      <div className='flex flex-1 flex-col mb-28 items-center justify-center'>
        <div className='flex flex-col gap-2 items-center'>
          <Loader2 className='w-8 h-8 text-violet-500 animate-spin' />
          <h3 className='text-xl font-semibold'>Loading...</h3>
          <p className='text-sm text-zinc-500'>
            We&apos;re preparing your PDF
          </p>
        </div>
      </div>

      <ChatInput isDisabled />
    </div>
  );

  if (data?.status === 'PROCESSING') return (
    <div className='flex flex-col relative min-h-full bg-zinc-50 divide-y divide-zinc-200 gap-2 justify-between'>
      <div className='flex flex-1 flex-col mb-28 items-center justify-center'>
        <div className='flex flex-col gap-2 items-center'>
          <Loader2 className='w-8 h-8 text-violet-500 animate-spin' />
          <h3 className='text-xl font-semibold'>
            Processing PDF...
          </h3>
          <p className='text-sm text-zinc-500'>
            This won&apos;t take long
          </p>
        </div>
      </div>

      <ChatInput isDisabled />
    </div>
  );

  if (data?.status === 'FAILED') return (
    <div className='flex flex-col relative min-h-full bg-zinc-50 divide-y divide-zinc-200 gap-2 justify-between'>
      <div className='flex flex-1 flex-col mb-28 items-center justify-center'>
        <div className='flex flex-col gap-2 items-center'>
          <XCircle className='w-8 h-8 text-red-500' />
          <h3 className='text-xl font-semibold'>
            Too many pages in PDF
          </h3>
          <p className='text-sm text-zinc-500'>
            Your <span className='font-medium'>Free</span>{' '}
            plan supports up to 5 pages per PDF
          </p>
          <Link className={buttonVariants({
            variant: 'secondary',
            className: 'mt-4'
          })} href='/dashboard'>
            <ChevronLeft className='w-3 h-3 mr-1.5' />Back
          </Link>
        </div>
      </div>

      <ChatInput isDisabled />
    </div>
  );

  return (
    <div className='flex flex-col relative min-h-full bg-zinc-50 divide-y divide-zinc-200 justify-between gap-2'>
      <div className='flex flex-col flex-1 mb-28 justify-between'>
        <Messages />
      </div>

      <ChatInput />
    </div>
  )
};

export default ChatWrapper;
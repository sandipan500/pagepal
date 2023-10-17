'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ghost, Loader2, MessageSquare, Plus, Trash } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import { format } from 'date-fns';

import UploadButton from './UploadButton';
import { trpc } from '@/app/_trpc/client';
import { Button } from './ui/button';

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<string | null>(null)

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate()
    },
    onMutate({id}) {
      setCurrentlyDeletingFile(id)
    },
    onSettled() {
      setCurrentlyDeletingFile(null)
    }
  });

  return (
    <main className='mx-auto max-w-7xl md:p-10'>
      <div className='flex flex-col items-start justify-between mt-8 gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl text-gray-900'>My Files</h1>

        <UploadButton />
      </div>

      {files && files?.length !== 0 ? (
        <ul className='mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3'>
          {files.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).map((file) => (
            <li
              key={file.id}
              className='col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg'
            >
              <Link
                href={`/dashboard/${file.id}`}
                className='flex flex-col gap-2'
              >
                <div className='flex w-full px-6 pt-6 items-center justify-between space-x-6'>
                  <div className='flex-shrink-0 rounded-full h-10 w-10 bg-gradient-to-r from-purple-500 to to-violet-500' />
                  <div className='flex-1 truncate'>
                    <div className='flex items-center space-x-3'>
                      <h3 className='truncate text-lg font-medium text-zinc-900'>
                        {file.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className='px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500'>
                <div className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  {format(new Date(file.createdAt),'MM yyyy')}
                </div>

                <div className='flex items-center gap-2'>
                  <MessageSquare className='h-4 w-4' />
                  Mocked
                </div>

                <Button
                  onClick={() => deleteFile({ id: file.id })}
                  size='sm'
                  className='w-full'
                  variant='destructive'
                >
                  {currentlyDeletingFile === file.id ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Trash className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <Skeleton className='my-2' height={100} count={3} />
      ) : (
        <div className='flex flex-col mt-16 gap-2 items-center'>
          <Ghost className='w-8 h-8 text-zinc-800' />
          <h3 className='font-semibold text-xl'>
            Pretty empty around here
          </h3>
          <p>Let&apos;s upload your first PDF</p>
        </div>
      )}
    </main>
  )
};

export default Dashboard;
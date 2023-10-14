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
        <ul>
          {files.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).map((file) => (
            <li
              key={file.id}
              className=''
            >
              <Link
                href={`/dashboard/${file.id}`}
                className=''
              >
                <div className=''>
                  <div className='' />
                  <div className=''>
                    <div className=''>
                      <h3 className=''>
                        {file.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className=''>
                <div className=''>
                  <Plus className='' />
                  {format(new Date(file.createdAt),'MM yyyy')}
                </div>

                <div className=''>
                  <MessageSquare className='' />
                  Mocked
                </div>

                <Button
                  onClick={() => deleteFile({ id: file.id })}
                  size='sm'
                  className=''
                  variant='destructive'
                >
                  {currentlyDeletingFile === file.id ? (
                    <Loader2 className='' />
                  ) : (
                    <Trash className='' />
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
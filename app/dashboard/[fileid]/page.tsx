import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';

import { db } from '@/db';

interface PageProps {
  params: {
    fileid: string;
  };
};

const Page = async ({params}: PageProps) => {
  const {fileid} = params;

  const {getUser} = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect (`/auth-callback?origin=dashboard/${fileid}`);

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id
    }
  });

  if(!file) notFound();

  return (
    <div className='flex flex-col flex-1 justify-between h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'></div>
    </div>
  )
};

export default Page;
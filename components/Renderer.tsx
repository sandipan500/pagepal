import React from 'react';

const Renderer = () => {
  return (
    <div className='flex flex-col w-full bg-white rounded-md shadow items-center'>
      <div className='flex w-full h-14 border-b border-zinc-200 items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          Top Bar
        </div>
      </div>
    </div>
  )
};

export default Renderer;
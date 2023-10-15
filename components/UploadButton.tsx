'use client';

import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Cloud } from 'lucide-react';

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';

const UploadDropzone = () => {
  return (
    <Dropzone multiple={false}>
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border border-dashed h-64 m-4 border-gray-300 rounded-lg'
        >
          <div className='flex w-full h-full items-center justify-center'>
            <label
              htmlFor='dropzone-file'
              className=''
            >
              <div className='flex flex-col w-full h-full items-center justify-center rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
                <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
                <p className='mb-2 text-sm text-zinc-700'>
                  <span className='font-semibold'>
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className='text-xs text-zinc-500'>
                  PDF (up to 4MB)
                </p>
              </div>
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  )
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v)
        }
      }}
    >
      <DialogTrigger
        onClick={() => setIsOpen(true)}
        asChild
      >
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  )
};

export default UploadButton;
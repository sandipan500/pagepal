'use client';

import React, { useState } from 'react';
import { Expand, Loader2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';

import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface FullScreenProps {
  fileUrl: string;
};

const FullScreen = ({ fileUrl }: FullScreenProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [numPages, setNumPages] = useState<number>();

  const { toast } = useToast();

  const { width, ref } = useResizeDetector();

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
        <Button
          variant='ghost'
          className='gap-1.5'
          aria-label='fullscreen'
        >
          <Expand className='w-4 h-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
        <SimpleBar
          autoHide={false}
          className='max-h-[calc(100vh-10rem)] mt-6'
        >
          <div ref={ref}>
            <Document
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='h-6 w-6 my-24 animate-spin' />
                </div>
              }
              file={fileUrl}
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again later',
                  variant: 'destructive'
                })
              }}
              className='max-h-full'
              onLoadSuccess={({numPages}) => setNumPages(numPages)}
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={width ? width : 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
};

export default FullScreen;
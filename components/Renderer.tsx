'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { useResizeDetector } from 'react-resize-detector';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SimpleBar from 'simplebar-react';

import { useToast } from './ui/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import FullScreen from './FullScreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface RendererProps {
  url: string;
};

const Renderer = ({ url }: RendererProps) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  const CustomPageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1'
    },
    resolver: zodResolver(CustomPageValidator)
  });

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page))
    setValue('page', String(page))
  }

  return (
    <div className='flex flex-col w-full bg-white rounded-md shadow items-center'>
      <div className='flex w-full h-14 border-b border-zinc-200 items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            onClick={() => {
              setCurrentPage((prev) =>
                prev - 1 > 1 ? prev - 1 : 1
              )
              setValue('page', String(currentPage - 1))
            }}
            aria-label='previous-page'
            disabled={currentPage <= 1}
          >
            <ChevronDown className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            <Input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handlePageSubmit)()
                }
              }}
              className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')}
              {...register('page')}
            />
            <p className='text-sm text-zinc-700 space-x-1'>
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            variant='ghost'
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              )
              setValue('page', String(currentPage + 1))
            }}
            aria-label='next-page'
            disabled={numPages === undefined || currentPage === numPages}
          >
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='gap-1.5'
                aria-label='zoom'
              >
                <Search className='w-4 h-4' />
                {scale * 100}%<ChevronDown className='w-3 h-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant='ghost'
            onClick={() => setRotation((prev) => prev + 90)}
            aria-label='rotate 90 degrees'
          >
            <RotateCw className='w-4 h-4' />
          </Button>

          <FullScreen fileUrl={url} />
        </div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='h-6 w-6 my-24 animate-spin' />
                </div>
              }
              file={url}
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
              {isLoading && renderedScale ? (
                <Page
                  pageNumber={currentPage}
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + renderedScale}
                />
              ) : null}
              <Page
                className={cn(isLoading ? 'hidden' : '')}
                pageNumber={currentPage}
                key={'@' + scale}
                loading={
                  <div className='flex justify-center'>
                    <Loader2 className='my-24 h-6 w-6 animate-spin' />
                  </div>
                }
                width={width ? width : 1}
                scale={scale}
                onRenderSuccess={() => setRenderedScale(scale)}
                rotate={rotation}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
};

export default Renderer;
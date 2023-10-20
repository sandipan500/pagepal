import React from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  isDisabled?: boolean;
};

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  return (
    <div className='absolute bottom-0 left-0 w-full'>
      <form className='flex flex-grow mx-2 gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='flex flex-1 h-full relative items-stretch md:flex-col'>
          <div className='flex flex-col flex-grow w-full relative p-4'>
            <div className='relative'>
              <Textarea
                autoFocus
                rows={1}
                maxRows={4}
                className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
                placeholder='Enter your question...'
              />

              <Button
                className='absolute bottom-1.5 right-[8px]'
                aria-label='send message'
              >
                <Send className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
};

export default ChatInput;
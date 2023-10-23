import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { useIntersection } from '@mantine/hooks';

import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { ExtendedMessage } from '@/types/message';

interface MessageProps {
  message: ExtendedMessage
  isNextMessageSamePerson: boolean
};

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-end', {
          'justify-end': message.isUserMessage
        })}
      >
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center relative aspect-square',
            {
              'order-2 bg-purple-600 rounded-sm': message.isUserMessage,
              'order-1 bg-zinc-800 rounded-sm': !message.isUserMessage,
              invisible: isNextMessageSamePerson
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className='h-3/4 w-3/4 fill-zinc-200 text-zinc-200' />
          ) : (
            <Icons.logo className='h-3/4 w-3/4 fill-zinc-300' />
          )}
        </div>

        <div
          className={cn(
            'flex flex-col text-base space-y-2 max-w-md mx-2',
            {
              'order-1 items-end': message.isUserMessage,
              'order-2 items-start': !message.isUserMessage
            }
          )}
        >
          <div
            className={cn(
              'px-4 py-2 rounded-lg inline-block',
              {
                'bg-violet-600 text-white': message.isUserMessage,
                'bg-gray-200 text-gray-900': !message.isUserMessage,
                'rounded-br-none': !isNextMessageSamePerson && message.isUserMessage,
                'rounded-bl-none': !isNextMessageSamePerson && !message.isUserMessage
              }
            )}
          >
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                className={cn('prose',
                  {
                    'text-zinc-50': message.isUserMessage
                  }
                )}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== 'loading-message' ? (
              <div
                className={cn(
                  'text-xs select-none mt-2 w-full text-right',
                  {
                    'text-zinc-500': !message.isUserMessage,
                    'text-violet-300': message.isUserMessage
                  }
                )}
              >
                {format(
                  new Date(message.createdAt), 'HH:mm'
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
);

Message.displayName = 'Message';

export default Message;
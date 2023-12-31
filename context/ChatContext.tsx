import { ReactNode, createContext, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { trpc } from '@/app/_trpc/client';
import { useToast } from '@/components/ui/use-toast';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';

type StreamResponse = {
  addMessage: () => void
  message: string
  handleInputChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  isLoading: boolean
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false
});

interface Props {
  fileId: string
  children: ReactNode
};

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoadning] = useState<boolean>(false)

  const utils = trpc.useContext()

  const { toast } = useToast()

  const backupMessage = useRef('')

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({
      message
    } : {
      message: string
    }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ fileId, message })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return response.body
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message
      setMessage('')

      await utils.getFileMessages.cancel()

      const previousMessages = utils.getFileMessages.getInfiniteData()

      utils.getFileMessages.setInfiniteData(
        {fileId, limit: INFINITE_QUERY_LIMIT},
        (old) => {
          if(!old) {
            return {
              pages: [],
              pageParams: []
            }
          }

          let newPages = [...old.pages]

          let latestPages = newPages[0]!

          latestPages.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true
            },
            ...latestPages.messages
          ]

          newPages[0] = latestPages

          return {
            ...old,
            pages: newPages
          }
        }
      )

      setIsLoadning(true)

      return {
        previousMessages: previousMessages?.pages.flatMap(
          (page) => page.messages
        ) ?? []
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current)
      utils.getFileMessages.setData(
        {fileId},
        {messages: context?.previousMessages ?? []}
      )
    },
    onSuccess: async (stream) => {
      setIsLoadning(false)

      if(!stream) {
        return toast({
          title: 'There was a problem sending this message',
          description: 'Please refresh this page and try again',
          variant: 'destructive'
        })
      }

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let done = false

      let accResponse = ''

      while(!done) {
        const {value, done: doneReading} = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)

        accResponse += chunkValue

        utils.getFileMessages.setInfiniteData(
          {fileId, limit: INFINITE_QUERY_LIMIT},
          (old) => {
            if (!old) return { pages: [], pageParams: [] }

            let isAIResponseCreated = old.pages.some(
              (page) => page.messages.some(
                (message) => message.id === 'ai-response'
              )
            )

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages

                if (!isAIResponseCreated) {
                  updatedMessages = [
                    {
                      createdAt: new Date().toISOString(),
                      id: 'ai-response',
                      text: accResponse,
                      isUserMessage: false
                    },
                    ...page.messages
                  ]
                } else {
                  updatedMessages = page.messages.map((message) => {
                    if (message.id === 'ai-response') {
                      return {
                        ...message,
                        text: accResponse
                      }
                    }
                    return message
                  })
                }

                return {
                  ...page,
                  messages: updatedMessages
                }
              }

              return page
            })

            return {
              ...old,
              pages: updatedPages
            }
          }
        )
      }
    },
    onSettled: async () => {
      setIsLoadning(false)

      await utils.getFileMessages.invalidate({ fileId })
    }
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(e.target.value)
  }

  const addMessage = () => sendMessage({ message })

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading
      }}
    >
      {children}
    </ChatContext.Provider>
  )
};
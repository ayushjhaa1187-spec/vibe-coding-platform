'use client'

import type { ChatUIMessage } from '@/components/chat/types'
import { TEST_PROMPTS } from '@/ai/constants'
import { MessageCircleIcon, SendIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Input } from '@/components/ui/input'
import { Message } from '@/components/chat/message'
import { ModelSelector } from '@/components/settings/model-selector'
import { Panel, PanelHeader } from '@/components/panels/panels'
import { cn } from "@/lib/utils";
import { Settings } from '@/components/settings/settings'
import { useChat } from '@ai-sdk/react'
import { useLocalStorageValue } from '@/lib/use-local-storage-value'
import { useCallback, useEffect } from 'react'
import { useSharedChatContext } from '@/lib/chat-context'
import { useSettings } from '@/components/settings/use-settings'
import { useSandboxStore } from './state'

interface Props {
  className: string
  modelId?: string
}

export function Chat({ className }: Props) {
  const [input, setInput] = useLocalStorageValue('prompt-input')
  const { chat } = useSharedChatContext()
  const { modelId, reasoningEffort } = useSettings()
  const { messages, sendMessage, status, setMessages } = useChat<ChatUIMessage>({ chat })
  const { setChatStatus } = useSandboxStore()

  const validateAndSubmitMessage = useCallback(
    (text: string) => {
      if (text.trim()) {
        sendMessage({ text }, { body: { modelId, reasoningEffort } })
        setInput('')
      }
    },
    [sendMessage, modelId, setInput, reasoningEffort]
  )

  const handleClearConversation = useCallback(() => {
    setMessages([])
  }, [setMessages])

  useEffect(() => {
    setChatStatus(status)
  }, [status, setChatStatus])

  const isLoading = status === 'streaming' || status === 'submitted'

  return (
    <Panel className={cn('bg-card border-border', className)}>
      <PanelHeader className="border-b border-border bg-card">
        <div className="flex items-center text-sm font-medium text-foreground">
          <MessageCircleIcon className="mr-2 w-4 h-4 text-primary" />
          Chat
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              </span>
              <span className="text-xs text-muted-foreground">AI is thinking...</span>
            </div>
          )}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearConversation}
              className="h-7 px-2 text-muted-foreground hover:text-destructive"
              title="Clear conversation"
            >
              <Trash2Icon className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </PanelHeader>

      {/* Messages Area */}
      {messages.length === 0 ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center">
          <MessageCircleIcon className="w-10 h-10 text-muted-foreground/30 mb-4" />
          <h3 className="text-foreground font-semibold text-base mb-1">Start a conversation</h3>
          <p className="text-muted-foreground text-sm mb-6">Describe what you want to build</p>

          <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
            {TEST_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="group flex items-center text-left px-4 py-3 rounded-lg bg-secondary hover:bg-accent border border-border hover:border-primary/30 transition-colors"
                onClick={() => validateAndSubmitMessage(prompt)}
              >
                <span className="text-xs text-muted-foreground mr-3 font-mono">{idx + 1}.</span>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Conversation className="relative w-full">
          <ConversationContent className="space-y-4 p-4">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                </span>
                <span className="text-sm text-muted-foreground">Generating response...</span>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      <div className="p-3 bg-card border-t border-border">
        <form
          className="flex items-center gap-2 p-1.5 rounded-lg bg-background border border-border focus-within:border-primary/50 transition-colors"
          onSubmit={async (event) => {
            event.preventDefault()
            validateAndSubmitMessage(input)
          }}
        >
          <div className="flex items-center gap-1 px-1 border-r border-border">
            <Settings className="scale-90" />
            <ModelSelector className="scale-90" />
          </div>
          <Input
            className="flex-1 bg-transparent border-none text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-0"
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            value={input}
          />
          <Button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className="h-9 w-9 p-0 rounded-lg"
            size="icon"
          >
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Panel>
  )
}

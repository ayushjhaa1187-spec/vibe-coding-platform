import { type ChatUIMessage } from '@/components/chat/types'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from 'ai'
import { DEFAULT_MODEL } from '@/ai/constants'
import { NextResponse } from 'next/server'
import { getAvailableModels, getModelOptions } from '@/ai/gateway'
import { checkBotId } from 'botid/server'
import { tools } from '@/ai/tools'
import prompt from './prompt.md'

interface BodyData {
  messages: ChatUIMessage[]
  modelId?: string
  reasoningEffort?: 'low' | 'medium'
}

export async function POST(req: Request) {
  const checkResult = await checkBotId()
  if (checkResult.isBot) {
    return NextResponse.json({ error: 'Bot detected' }, { status: 403 })
  }

  let models: Awaited<ReturnType<typeof getAvailableModels>>
  let body: BodyData

  try {
    [models, body] = await Promise.all([
      getAvailableModels(),
      req.json() as Promise<BodyData>,
    ])
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const { messages, modelId = DEFAULT_MODEL, reasoningEffort } = body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'Messages array is required and must not be empty' },
      { status: 400 }
    )
  }

  const model = models.find((m) => m.id === modelId)
  if (!model) {
    return NextResponse.json(
      { error: `Model ${modelId} not found.` },
      { status: 400 }
    )
  }

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        // Convert ALL messages to model format to ensure full conversation
        // history is sent, preventing the same-response bug.
        const allMessages = messages.map((message) => {
          message.parts = message.parts.map((part) => {
            if (part.type === 'data-report-errors') {
              return {
                type: 'text' as const,
                text:
                  `There are errors in the generated code. This is the summary of the errors we have:\n` +
                  `\`\`\`${part.data.summary}\`\`\`\n` +
                  (part.data.paths?.length
                    ? `The following files may contain errors:\n` +
                      `\`\`\`${part.data.paths?.join('\n')}\`\`\`\n`
                    : '') +
                  `Fix the errors reported.`,
              }
            }
            return part
          })
          return message
        })

        const result = streamText({
          ...getModelOptions(modelId, { reasoningEffort }),
          system: prompt,
          messages: await convertToModelMessages(allMessages),
          stopWhen: stepCountIs(20),
          tools: tools({ modelId, writer }),
          onError: (error) => {
            console.error('Error communicating with AI:', error)
          },
        })
        result.consumeStream()
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: true,
            sendStart: false,
            messageMetadata: () => ({
              model: model.name,
            }),
          })
        )
      },
    }),
  })
}

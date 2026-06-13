import { geminiProvider } from './gemini'
import type { AiProvider } from './types'

export function getAiProvider(): AiProvider {
  const provider = process.env.AI_PROVIDER || 'gemini'
  if (provider !== 'gemini') {
    throw new Error(`Unsupported AI_PROVIDER: ${provider}`)
  }
  return geminiProvider
}

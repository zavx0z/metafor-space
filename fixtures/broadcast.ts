import { afterAll } from "bun:test"
import { type BroadcastMessage } from "../metafor"

export const messagesFixture = (options?: {
  meta: string
}): {
  messages: BroadcastMessage[]
  onmessage: (cb: (message: BroadcastMessage) => void) => void
  waitForMessages: (delay?: number) => Promise<BroadcastMessage[]>
} => {
  const channel = new BroadcastChannel("channel")
  afterAll(() => channel.close())
  const messages: BroadcastMessage[] = []

  channel.addEventListener("message", ({ data }) => {
    if (!options?.meta || data.meta?.particle === options.meta) {
      messages.push(data)
    }
  })

  const onmessage = (cb: (message: BroadcastMessage) => void) => {
    channel.addEventListener("message", ({ data }) => {
      if (!options?.meta || data.meta?.particle === options.meta) {
        cb(data)
      }
    })
  }

  const waitForMessages = async (delay = 1000): Promise<BroadcastMessage[]> => {
    let lastMessageTime = Date.now()

    return new Promise((resolve) => {
      const checkMessages = () => {
        const now = Date.now()
        if (now - lastMessageTime >= delay) {
          resolve(messages)
          return
        }
        setTimeout(checkMessages, 100)
      }

      channel.addEventListener("message", ({ data }: MessageEvent) => {
        if (!options?.meta || data.meta?.particle === options.meta) lastMessageTime = Date.now()
      })
      checkMessages()
    })
  }

  return { messages, onmessage, waitForMessages }
}

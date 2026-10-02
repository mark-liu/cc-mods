import type { Register } from 'claude-code'

import { scrub } from './scrub.ts'

export const register: Register = on => {
  on('session.append', { door: 'response' }, ($, e, next) => {
    if (e.message.type !== 'assistant') return next(e)

    let isChanged = false
    const content = e.message.content.map(block => {
      if (block.type !== 'text' || typeof block.text !== 'string') return block
      const text = scrub(block.text)
      if (text === block.text) return block
      isChanged = true
      return { ...block, text }
    })

    return isChanged ? next({ ...e, message: { ...e.message, content } }) : next(e)
  })
}

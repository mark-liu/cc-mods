import type { Register } from 'claude-code'

import { DROPPED } from './trim.ts'

export const register: Register = on => {
  // The transcript keeps the engine's record; only the model's copy is left out.
  for (const type of DROPPED) on('prompt.attachment', { type }, () => ({ text: null }))
}

import { expect, test } from 'claude-code/testing'

const engine = { kind: 'engine' } as const

test('task and todo reminders never reach the model', async $ => {
  for (const type of ['task_reminder', 'todo_reminder']) {
    expect(await $.prompt.attachment({ type, text: 'use the task tools', origin: engine })).toEqual({ text: null })
  }
})

test('every other attachment passes through', async ($, on) => {
  on('prompt.attachment', ($, e) => ({ text: e.text }))
  const out = await $.prompt.attachment({ type: 'batching_reminder', text: 'batch calls', origin: engine })
  expect(out).toEqual({ text: 'batch calls' })
})

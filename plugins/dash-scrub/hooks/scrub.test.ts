import { expect, test } from 'claude-code/testing'

import { EM, EN, scrub } from './scrub.ts'

test('spaced em dash becomes a comma', async () => {
  expect(scrub(`the cap ${EM} not the check ${EM} governs`)).toBe('the cap, not the check, governs')
})

test('unspaced numeric range becomes a hyphen', async () => {
  expect(scrub(`lines 110${EN}155`)).toBe('lines 110-155')
})

test('spaced dash between numbers stays a clause break', async () => {
  expect(scrub(`Phase 1 ${EM} 2 weeks`)).toBe('Phase 1, 2 weeks')
  expect(scrub(`16:00 ${EM} 3 hours`)).toBe('16:00, 3 hours')
})

test('bullet-leading dash becomes a hyphen bullet', async () => {
  expect(scrub(`${EM} first\n  ${EN} second`)).toBe('- first\n  - second')
})

test('line-ending dash does not join the next line', async () => {
  expect(scrub(`first line ${EM}\n- bullet`)).toBe('first line\n- bullet')
  expect(scrub(`trailing ${EM}`)).toBe('trailing')
})

test('code spans, fences and URLs are left alone', async () => {
  const src = `use \`a${EM}b\` here\n\`\`\`\nx ${EM} y\n\`\`\`\n~~~\np ${EN} q\n~~~\nsee https://x.io/a${EN}b ${EM} end`
  expect(scrub(src)).toBe(`use \`a${EM}b\` here\n\`\`\`\nx ${EM} y\n\`\`\`\n~~~\np ${EN} q\n~~~\nsee https://x.io/a${EN}b, end`)
})

test('dash before punctuation does not leave a stray comma', async () => {
  expect(scrub(`done ${EM}.`)).toBe('done.')
})

test('unspaced em dash between words becomes a comma', async () => {
  expect(scrub(`fast${EM}cheap`)).toBe('fast, cheap')
})

test('text without dashes is returned as is', async () => {
  const src = 'plain - hyphen'
  expect(scrub(src)).toBe(src)
})

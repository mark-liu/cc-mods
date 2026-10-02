// Built from code points: literal dashes in source trip the dash ban on this file.
export const EN = String.fromCharCode(0x2013)
export const EM = String.fromCharCode(0x2014)

const D = `[${EN}${EM}]`
// Code spans, backtick and tilde fences, and raw URLs pass through untouched.
const PROTECTED = /(```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)|`[^`\n]*`|https?:\/\/[^\s)>\]]+)/
const DASH = new RegExp(D)
// Unspaced only: "Phase 1 - 2 weeks" is a clause break, "110-155" is a range.
const RANGE = new RegExp(`(\\d)${D}(\\d)`, 'g')
const LEADING = new RegExp(`^([ \\t]*)${D}[ \\t]*`, 'gm')
const SPACED = new RegExp(`[ \\t]+${D}[ \\t]+`, 'g')
const TRAILING = new RegExp(`[ \\t]*${D}[ \\t]*$`, 'gm')
const BARE_EM = new RegExp(EM, 'g')
const BARE_EN = new RegExp(EN, 'g')

function scrubProse(text: string): string {
  return text
    .replace(RANGE, '$1-$2')
    .replace(LEADING, '$1- ')
    .replace(TRAILING, '')
    .replace(SPACED, ', ')
    .replace(BARE_EM, ', ')
    .replace(BARE_EN, '-')
    .replace(/[ \t]*,[ \t]*([,.;:!?])/g, '$1')
}

/** Rewrites em/en dashes in prose, leaving code, fences and URLs untouched. */
export function scrub(text: string): string {
  if (!DASH.test(text)) return text
  const parts = text.split(PROTECTED)
  return parts
    .map((part, i) => {
      if (i % 2 === 1) return part
      // A segment after a URL or span starts mid-line; the stub keeps LEADING off it.
      const isLineStart = i === 0 || /\n$/.test(parts[i - 1] ?? '')
      return isLineStart ? scrubProse(part) : scrubProse(`x${part}`).slice(1)
    })
    .join('')
}

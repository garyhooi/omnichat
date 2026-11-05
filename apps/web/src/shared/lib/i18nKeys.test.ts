import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { en } from './locales/en'

// =============================================================================
// Guards a gap the locale-parity test cannot see.
//
// i18n.test.ts proves every locale exposes the same key set as English — so a
// key that is missing from EVERY locale passes it, while the UI silently renders
// the raw key (e.g. "common.loadEarlierMessages"). This test checks the other
// direction: every literal key the source asks for must exist in en.ts, which is
// the source of truth the other locales are checked against.
//
// Only string literals are inspected, so dynamic lookups (t(tab.labelKey)) are
// deliberately out of scope.
// =============================================================================

const SRC_DIR = fileURLToPath(new URL('../../', import.meta.url))

function sourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'locales') continue
      out.push(...sourceFiles(full))
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

describe('i18n keys used by source', () => {
  it('every literal t() key exists in en.ts', () => {
    const enKeys = new Set(Object.keys(en))
    const missing: Array<{ key: string; file: string }> = []

    for (const file of sourceFiles(SRC_DIR)) {
      const source = readFileSync(file, 'utf8')
      for (const match of source.matchAll(/\bt\(\s*'([^']+)'\s*[,)]/g)) {
        const key = match[1]
        if (!enKeys.has(key)) missing.push({ key, file: relative(SRC_DIR, file) })
      }
    }

    expect(missing, 'keys rendered raw because they are not defined in en.ts').toEqual([])
  })
})

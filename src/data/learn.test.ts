import { describe, it, expect } from 'vitest'
import { LEARN_SECTIONS, LEARN_SOURCES } from './learn'

describe('learn data', () => {
  const sourceIds = new Set(LEARN_SOURCES.map((s) => s.id))

  it('every section has at least one source', () => {
    for (const section of LEARN_SECTIONS) {
      expect(section.sources.length).toBeGreaterThan(0)
    }
  })

  it('every section source id exists in LEARN_SOURCES', () => {
    for (const section of LEARN_SECTIONS) {
      for (const sid of section.sources) {
        expect(sourceIds.has(sid)).toBe(true)
      }
    }
  })

  it('every source has id, label, and url', () => {
    for (const s of LEARN_SOURCES) {
      expect(typeof s.id).toBe('string')
      expect(s.id.length).toBeGreaterThan(0)
      expect(typeof s.label).toBe('string')
      expect(s.label.length).toBeGreaterThan(0)
      expect(typeof s.url).toBe('string')
      expect(s.url.length).toBeGreaterThan(0)
    }
  })

  it('every section has en and hi fields for title and blocks', () => {
    for (const section of LEARN_SECTIONS) {
      expect(typeof section.title.en).toBe('string')
      expect(typeof section.title.hi).toBe('string')
      expect(section.title.en.length).toBeGreaterThan(0)
      expect(section.title.hi.length).toBeGreaterThan(0)
      expect(Array.isArray(section.blocks.en)).toBe(true)
      expect(Array.isArray(section.blocks.hi)).toBe(true)
      expect(section.blocks.en.length).toBeGreaterThan(0)
      expect(section.blocks.hi.length).toBeGreaterThan(0)
    }
  })

  it('has 9 sections', () => {
    expect(LEARN_SECTIONS.length).toBe(9)
  })
})

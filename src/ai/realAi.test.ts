import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getGuidance, fallbackGuidance, type AiGuidance } from './realAi'

const originalFetch = globalThis.fetch

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  globalThis.fetch = originalFetch
})

function mockFetch(response: { ok: boolean; status?: number; json?: unknown; text?: string }) {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: response.ok,
      status: response.status ?? 200,
      json: response.json ? () => Promise.resolve(response.json) : undefined,
      text: response.text ? () => Promise.resolve(response.text) : undefined,
    } as Response)
  )
}

describe('fallbackGuidance', () => {
  it('returns safe static text for red level', () => {
    const g = fallbackGuidance('red')
    expect(g.summary).toContain('Please see a doctor soon')
    expect(g.summary).toContain('AI guidance unavailable right now')
    expect(g.disclaimer).toBe('Only a doctor can confirm this.')
  })

  it('returns safe static text for red-urgent level', () => {
    const g = fallbackGuidance('red-urgent')
    expect(g.summary).toContain('Please get care today')
    expect(g.summary).toContain('AI guidance unavailable right now')
  })

  it('returns safe static text for yellow level', () => {
    const g = fallbackGuidance('yellow')
    expect(g.summary).toContain('need checking')
    expect(g.summary).toContain('AI guidance unavailable right now')
  })

  it('returns safe static text for green level', () => {
    const g = fallbackGuidance('green')
    expect(g.summary).toContain('clinical breast exam from age 30')
    expect(g.summary).toContain('AI guidance unavailable right now')
  })

  it('never returns benign reasons for red level', () => {
    const g = fallbackGuidance('red')
    const benign = [
      'Hormonal changes related to your menstrual cycle.',
      'A benign cyst or fibroadenoma.',
      'Normal breast tissue that feels lumpy.',
    ]
    benign.forEach((b) => {
      expect(g.possibleReasons).not.toContain(b)
    })
  })
})

describe('getGuidance JSON parsing', () => {
  it('parses valid JSON from the API', async () => {
    const expected: AiGuidance = {
      summary: 'All clear.',
      possibleReasons: ['Hormonal changes.'],
      whatToWatch: ['Watch for changes.'],
      whatToTellDoctor: ['Tell the doctor.'],
      testsToAskAbout: ['Clinical breast exam'],
      disclaimer: 'Only a doctor can confirm this.',
    }
    mockFetch({ ok: true, json: expected })
    const result = await getGuidance({
      level: 'green',
      answers: {},
      otherTexts: [],
      language: 'en',
    })
    expect(result.summary).toBe('All clear.')
    expect(result.possibleReasons).toEqual(['Hormonal changes.'])
  })

  it('falls back when API returns non-ok', async () => {
    mockFetch({ ok: false, status: 500 })
    const result = await getGuidance({
      level: 'red',
      answers: {},
      otherTexts: [],
      language: 'en',
    })
    expect(result.summary).toContain('Please see a doctor soon')
    expect(result.summary).toContain('AI guidance unavailable right now')
  })

  it('falls back when API returns invalid JSON', async () => {
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('bad json')),
      } as unknown as Response)
    )
    const result = await getGuidance({
      level: 'red',
      answers: {},
      otherTexts: [],
      language: 'en',
    })
    expect(result.summary).toContain('Please see a doctor soon')
    expect(result.summary).toContain('AI guidance unavailable right now')
  })

  it('falls back when fetch throws (network error)', async () => {
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('network down')))
    const result = await getGuidance({
      level: 'red',
      answers: {},
      otherTexts: [],
      language: 'en',
    })
    expect(result.summary).toContain('Please see a doctor soon')
    expect(result.summary).toContain('AI guidance unavailable right now')
  })
})

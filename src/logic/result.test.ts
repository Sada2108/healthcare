import { describe, it, expect } from 'vitest'
import { getResult, type ResultLevel } from './result'
import { getGuidance } from '../ai/realAi'

const base: Record<string, unknown> = {
  age: 35,
  pregnant: 'check.opt.no',
  periodsStopped: 'check.opt.no',
  familyBreast: 'check.opt.no',
  familyOvarian: 'check.opt.no',
  brcaKnown: 'check.opt.no',
  pastLump: 'check.opt.no',
  pastCancer: 'check.opt.no',
  chestRadiation: 'check.opt.no',
  lumpBreast: 'check.opt.no',
  lumpArmpit: 'check.opt.no',
  dimpling: 'check.opt.no',
  nippleInversion: 'check.opt.no',
  nippleRash: 'check.opt.no',
  nippleDischarge: 'check.opt.no',
  dischargeBlood: 'check.opt.no',
  sizeChange: 'check.opt.no',
  redness: 'check.opt.no',
  fever: 'check.opt.no',
  gettingWorse: 'check.opt.no',
  screening: 'check.opt.screenYear',
  pain: { breast: null, zone: null, intensity: 0, timing: null },
  feltOther: '',
}

function answersWith(overrides: Record<string, unknown>): Record<string, unknown> {
  return { ...base, ...overrides }
}

function levelOf(answers: Record<string, unknown>): ResultLevel {
  return getResult(answers).level
}

describe('getResult', () => {
  it('returns green when nothing is flagged', () => {
    expect(levelOf(answersWith({}))).toBe('green')
  })

  it('red-urgent: fever and red/hot/swollen breast', () => {
    expect(
      levelOf(answersWith({ fever: 'check.opt.yes', redness: 'check.opt.yes' })),
    ).toBe('red-urgent')
  })

  it('red-urgent wins over red', () => {
    const r = getResult(
      answersWith({
        fever: 'check.opt.yes',
        redness: 'check.opt.yes',
        lumpBreast: 'check.opt.yes',
      }),
    )
    expect(r.level).toBe('red-urgent')
    expect(r.reasons).toContain('result.reason.redUrgent')
    expect(r.reasons).toContain('result.reason.lumpBreast')
  })

  it('red: new breast lump', () => {
    expect(levelOf(answersWith({ lumpBreast: 'check.opt.yes' }))).toBe('red')
  })

  it('red: armpit lump', () => {
    expect(levelOf(answersWith({ lumpArmpit: 'check.opt.yes' }))).toBe('red')
  })

  it('red: skin dimpling', () => {
    expect(levelOf(answersWith({ dimpling: 'check.opt.yes' }))).toBe('red')
  })

  it('red: nipple inversion', () => {
    expect(levelOf(answersWith({ nippleInversion: 'check.opt.yes' }))).toBe('red')
  })

  it('red: nipple rash', () => {
    expect(levelOf(answersWith({ nippleRash: 'check.opt.yes' }))).toBe('red')
  })

  it('red: bloody discharge', () => {
    expect(
      levelOf(
        answersWith({
          nippleDischarge: 'check.opt.yes',
          dischargeBlood: 'check.opt.yes',
        }),
      ),
    ).toBe('red')
  })

  it('red: discharge without blood is not red', () => {
    expect(
      levelOf(answersWith({ nippleDischarge: 'check.opt.yes' })),
    ).toBe('green')
  })

  it('red: size or shape change', () => {
    expect(levelOf(answersWith({ sizeChange: 'check.opt.yes' }))).toBe('red')
  })

  it('red: symptoms getting worse', () => {
    expect(levelOf(answersWith({ gettingWorse: 'check.opt.yes' }))).toBe('red')
  })

  it('red: Other text containing red-flag word (lump)', () => {
    const r = getResult(
      answersWith({ 'lumpBreast__other': 'I feel a hard lump here' }),
    )
    expect(r.level).toBe('red')
    expect(r.otherTexts).toContain('I feel a hard lump here')
  })

  it('red: Other text containing red-flag word (dimple)', () => {
    const r = getResult(
      answersWith({ dimpling__other: 'skin looks dimpled' }),
    )
    expect(r.level).toBe('red')
  })

  it('yellow: high-risk family history', () => {
    expect(
      levelOf(answersWith({ familyBreast: 'check.opt.yes' })),
    ).toBe('yellow')
    expect(levelOf(answersWith({ familyOvarian: 'check.opt.yes' }))).toBe(
      'yellow',
    )
    expect(levelOf(answersWith({ brcaKnown: 'check.opt.yes' }))).toBe('yellow')
    expect(
      levelOf(answersWith({ chestRadiation: 'check.opt.yes' })),
    ).toBe('yellow')
    expect(levelOf(answersWith({ pastLump: 'check.opt.yes' }))).toBe('yellow')
    expect(levelOf(answersWith({ pastCancer: 'check.opt.yes' }))).toBe(
      'yellow',
    )
  })

  it('yellow: persistent one-sided constant pain', () => {
    expect(
      levelOf(
        answersWith({
          pain: { breast: 'left', zone: 'check.zoneUpper', intensity: 6, timing: 'check.opt.constant' },
        }),
      ),
    ).toBe('yellow')
  })

  it('yellow: age 30+ with no screening', () => {
    expect(
      levelOf(answersWith({ age: 35, screening: 'check.opt.screenNever' })),
    ).toBe('yellow')
    expect(
      levelOf(answersWith({ age: 35, screeningWhen: 'check.opt.screenOver' })),
    ).toBe('yellow')
  })

  it('yellow: under 30 with no screening is green', () => {
    expect(
      levelOf(answersWith({ age: 25, screening: 'check.opt.screenNever' })),
    ).toBe('green')
  })

  it('yellow: non-empty Other text without red-flag words', () => {
    const r = getResult(answersWith({ pastLump__other: 'small cyst years ago' }))
    expect(r.level).toBe('yellow')
    expect(r.otherTexts).toContain('small cyst years ago')
  })

  it('collects all other texts exactly as typed', () => {
    const r = getResult(
      answersWith({
        'lumpBreast__other': '  A lump  ',
        'feltOther': '  tingling  ',
      }),
    )
    expect(r.otherTexts).toEqual(['A lump', 'tingling'])
  })

  it('Other text with red-flag word is red not yellow', () => {
    const r = getResult(
      answersWith({ 'feltOther': 'there is blood and it is growing' }),
    )
    expect(r.level).toBe('red')
    expect(r.reasons).toContain('result.reason.otherRedFlag')
  })

  it('red beats yellow', () => {
    const r = getResult(
      answersWith({
        familyBreast: 'check.opt.yes',
        lumpBreast: 'check.opt.yes',
      }),
    )
    expect(r.level).toBe('red')
  })

  it('red result never returns benign reasons from realAi', async () => {
    const r = getResult(answersWith({ lumpBreast: 'check.opt.yes' }))
    expect(r.level).toBe('red')
    const guidance = await getGuidance({
      level: r.level,
      answers: answersWith({}),
      otherTexts: r.otherTexts,
      language: 'en',
    })
    const benign = [
      'Hormonal changes related to your menstrual cycle.',
      'A benign cyst or fibroadenoma.',
      'Normal breast tissue that feels lumpy.',
    ]
    benign.forEach((b) => {
      expect(guidance.possibleReasons).not.toContain(b)
    })
  })

  it('felt "a lump" gives red', () => {
    const r = getResult(answersWith({ felt: ['check.feltLump'] }))
    expect(r.level).toBe('red')
    expect(r.reasons).toContain('result.reason.feltLump')
  })

  it('felt "skin change" gives red', () => {
    const r = getResult(answersWith({ felt: ['check.feltSkin'] }))
    expect(r.level).toBe('red')
    expect(r.reasons).toContain('result.reason.feltLump')
  })

  it('felt "thickening" gives red', () => {
    const r = getResult(answersWith({ felt: ['check.feltThickening'] }))
    expect(r.level).toBe('red')
    expect(r.reasons).toContain('result.reason.feltThickening')
  })

  it('felt "pain" gives yellow', () => {
    const r = getResult(answersWith({ felt: ['check.feltPain'] }))
    expect(r.level).toBe('yellow')
    expect(r.reasons).toContain('result.reason.feltPain')
  })

  it('felt "not sure" gives yellow', () => {
    const r = getResult(answersWith({ felt: ['check.feltNotSure'] }))
    expect(r.level).toBe('yellow')
    expect(r.reasons).toContain('result.reason.feltNotSure')
  })

  it('felt "Other" without text gives yellow', () => {
    const r = getResult(
      answersWith({ felt: ['check.opt.other'], feltOther: '' }),
    )
    expect(r.level).toBe('yellow')
  })

  it('felt "nothing unusual" is green', () => {
    const r = getResult(answersWith({ felt: ['check.feltNothing'] }))
    expect(r.level).toBe('green')
  })
})

export type ResultLevel = 'green' | 'yellow' | 'red' | 'red-urgent'

export interface CheckResult {
  level: ResultLevel
  reasons: string[]
  otherTexts: string[]
}

const LEVEL_RANK: Record<ResultLevel, number> = {
  green: 0,
  yellow: 1,
  red: 2,
  'red-urgent': 3,
}

const RED_FLAG_WORDS = ['lump', 'blood', 'discharge', 'hard', 'growing', 'dimple']

function isYes(value: unknown): boolean {
  return value === 'check.opt.yes' || value === true || value === 'yes'
}

function setLevel(current: ResultLevel, next: ResultLevel): ResultLevel {
  return LEVEL_RANK[next] > LEVEL_RANK[current] ? next : current
}

export function getResult(answers: Record<string, unknown>): CheckResult {
  const reasons: string[] = []
  const otherTexts: string[] = []
  let level: ResultLevel = 'green'

  const pain =
    (answers['pain'] as {
      breast?: string | null
      zone?: string | null
      intensity?: number
      timing?: string | null
    } | undefined) ?? {}
  const felt = answers['felt'] as string[] | undefined
  const feltOther = answers['feltOther'] as string | undefined

  for (const [key, val] of Object.entries(answers)) {
    if (key.endsWith('__other') && typeof val === 'string' && val.trim() !== '') {
      otherTexts.push(val.trim())
    }
  }
  if (feltOther && feltOther.trim() !== '') {
    otherTexts.push(feltOther.trim())
  }

  const otherRedFlag = otherTexts.some((text) =>
    RED_FLAG_WORDS.some((word) => text.toLowerCase().includes(word)),
  )

  // ---------- red-urgent ----------
  if (isYes(answers['fever']) && isYes(answers['redness'])) {
    level = setLevel(level, 'red-urgent')
    reasons.push('result.reason.redUrgent')
  }

  // ---------- felt touch-test (red options) ----------
  if (Array.isArray(felt)) {
    let feltHasOther = false
    for (const f of felt) {
      if (f === 'check.opt.other') {
        feltHasOther = true
        continue
      }
      if (f === 'check.feltLump' || f === 'check.feltSkin') {
        level = setLevel(level, 'red')
        reasons.push('result.reason.feltLump')
      } else if (f === 'check.feltThickening') {
        level = setLevel(level, 'red')
        reasons.push('result.reason.feltThickening')
      }
    }
    if (feltHasOther && (!feltOther || feltOther.trim() === '')) {
      level = setLevel(level, 'yellow')
      reasons.push('result.reason.otherText')
    }
  }

  // ---------- red ----------
  if (isYes(answers['lumpBreast'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.lumpBreast')
  }
  if (isYes(answers['lumpArmpit'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.lumpArmpit')
  }
  if (isYes(answers['dimpling'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.dimpling')
  }
  if (isYes(answers['nippleInversion'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.nippleInversion')
  }
  if (isYes(answers['nippleRash'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.nippleRash')
  }
  if (isYes(answers['nippleDischarge']) && isYes(answers['dischargeBlood'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.bloodyDischarge')
  }
  if (isYes(answers['sizeChange'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.sizeChange')
  }
  if (isYes(answers['gettingWorse'])) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.gettingWorse')
  }
  if (otherRedFlag) {
    level = setLevel(level, 'red')
    reasons.push('result.reason.otherRedFlag')
  }

  // ---------- yellow ----------
  if (
    isYes(answers['familyBreast']) ||
    isYes(answers['familyOvarian']) ||
    isYes(answers['brcaKnown']) ||
    isYes(answers['chestRadiation']) ||
    isYes(answers['pastLump']) ||
    isYes(answers['pastCancer'])
  ) {
    level = setLevel(level, 'yellow')
    reasons.push('result.reason.familyHistory')
  }
  if (pain.breast && pain.timing === 'check.opt.constant') {
    level = setLevel(level, 'yellow')
    reasons.push('result.reason.persistentPain')
  }
  const age =
    typeof answers['age'] === 'number'
      ? answers['age']
      : Number(answers['age']) || 0
  const screening = answers['screening']
  const screeningWhen = answers['screeningWhen']
  const noExam =
    screening === 'check.opt.screenNever' || screeningWhen === 'check.opt.screenOver'
  if (age >= 30 && noExam) {
    level = setLevel(level, 'yellow')
    reasons.push('result.reason.noScreening')
  }
  if (otherTexts.length > 0 && !otherRedFlag) {
    level = setLevel(level, 'yellow')
    reasons.push('result.reason.otherText')
  }

  // ---------- felt touch-test (yellow options) ----------
  if (Array.isArray(felt)) {
    for (const f of felt) {
      if (f === 'check.feltPain') {
        level = setLevel(level, 'yellow')
        reasons.push('result.reason.feltPain')
      } else if (f === 'check.feltNotSure') {
        level = setLevel(level, 'yellow')
        reasons.push('result.reason.feltNotSure')
      }
    }
  }

  return { level, reasons, otherTexts }
}

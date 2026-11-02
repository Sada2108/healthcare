export type Step = 1 | 2 | 3 | 4

export type QType =
  | 'number'
  | 'boolean'
  | 'select'
  | 'text'

export interface QuestionDep {
  id: string
  value: unknown
}

export interface Question {
  id: string
  step: Step
  type: QType
  label: string
  options?: string[]
  other?: boolean
  preferNotToSay?: boolean
  min?: number
  max?: number
  unit?: string
  dependsOn?: QuestionDep
}

export const QUESTIONS: Question[] = [
  // ---------- STEP 1: Basic ----------
  {
    id: 'age',
    step: 1,
    type: 'number',
    label: 'check.q.age',
    min: 0,
    max: 120,
    unit: 'years',
  },
  {
    id: 'pregnant',
    step: 1,
    type: 'boolean',
    label: 'check.q.pregnant',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'periodsStopped',
    step: 1,
    type: 'select',
    label: 'check.q.periodsStopped',
    options: ['check.opt.yes', 'check.opt.no', 'check.opt.notSure'],
  },
  {
    id: 'periodsStoppedAge',
    step: 1,
    type: 'number',
    label: 'check.q.periodsStoppedAge',
    min: 0,
    max: 120,
    unit: 'years',
    dependsOn: { id: 'periodsStopped', value: 'check.opt.yes' },
  },
  {
    id: 'familyBreast',
    step: 1,
    type: 'select',
    label: 'check.q.familyBreast',
    options: ['check.opt.yes', 'check.opt.no', 'check.opt.notSure'],
  },
  {
    id: 'familyOvarian',
    step: 1,
    type: 'select',
    label: 'check.q.familyOvarian',
    options: ['check.opt.yes', 'check.opt.no', 'check.opt.notSure'],
  },
  {
    id: 'brcaKnown',
    step: 1,
    type: 'select',
    label: 'check.q.brcaKnown',
    options: ['check.opt.yes', 'check.opt.no', 'check.opt.notSure'],
  },
  {
    id: 'pastLump',
    step: 1,
    type: 'boolean',
    label: 'check.q.pastLump',
    options: ['check.opt.yes', 'check.opt.no'],
    other: true,
  },
  {
    id: 'pastCancer',
    step: 1,
    type: 'boolean',
    label: 'check.q.pastCancer',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'chestRadiation',
    step: 1,
    type: 'boolean',
    label: 'check.q.chestRadiation',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'firstPeriod',
    step: 1,
    type: 'number',
    label: 'check.q.firstPeriod',
    min: 0,
    max: 60,
    unit: 'years',
  },
  {
    id: 'children',
    step: 1,
    type: 'number',
    label: 'check.q.children',
    min: 0,
    max: 20,
  },
  {
    id: 'firstChildAge',
    step: 1,
    type: 'number',
    label: 'check.q.firstChildAge',
    min: 0,
    max: 60,
    unit: 'years',
    dependsOn: { id: 'children', value: 1 },
  },
  {
    id: 'hormones',
    step: 1,
    type: 'boolean',
    label: 'check.q.hormones',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'alcohol',
    step: 1,
    type: 'select',
    label: 'check.q.alcohol',
    options: ['check.opt.never', 'check.opt.sometimes', 'check.opt.often'],
  },
  {
    id: 'activity',
    step: 1,
    type: 'select',
    label: 'check.q.activity',
    options: ['check.opt.low', 'check.opt.some', 'check.opt.regular'],
  },
  {
    id: 'screening',
    step: 1,
    type: 'select',
    label: 'check.q.screening',
    options: [
      'check.opt.screenNever',
      'check.opt.screenYear',
      'check.opt.screenTwoYears',
      'check.opt.screenOver',
    ],
  },

  // ---------- STEP 2: Symptoms ----------
  {
    id: 'lumpBreast',
    step: 2,
    type: 'boolean',
    label: 'check.q.lumpBreast',
    options: ['check.opt.yes', 'check.opt.no'],
    other: true,
  },
  {
    id: 'lumpArmpit',
    step: 2,
    type: 'boolean',
    label: 'check.q.lumpArmpit',
    options: ['check.opt.yes', 'check.opt.no'],
    other: true,
  },
  {
    id: 'dimpling',
    step: 2,
    type: 'boolean',
    label: 'check.q.dimpling',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'nippleInversion',
    step: 2,
    type: 'boolean',
    label: 'check.q.nippleInversion',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'nippleRash',
    step: 2,
    type: 'boolean',
    label: 'check.q.nippleRash',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'nippleDischarge',
    step: 2,
    type: 'boolean',
    label: 'check.q.nippleDischarge',
    options: ['check.opt.yes', 'check.opt.no'],
    other: true,
  },
  {
    id: 'dischargeBlood',
    step: 2,
    type: 'boolean',
    label: 'check.q.dischargeBlood',
    options: ['check.opt.yes', 'check.opt.no'],
    dependsOn: { id: 'nippleDischarge', value: 'check.opt.yes' },
  },
  {
    id: 'sizeChange',
    step: 2,
    type: 'boolean',
    label: 'check.q.sizeChange',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'redness',
    step: 2,
    type: 'boolean',
    label: 'check.q.redness',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'fever',
    step: 2,
    type: 'boolean',
    label: 'check.q.fever',
    options: ['check.opt.yes', 'check.opt.no'],
  },
  {
    id: 'noticedFor',
    step: 2,
    type: 'number',
    label: 'check.q.noticedWhen',
    min: 0,
    max: 1000,
  },
  {
    id: 'noticedUnit',
    step: 2,
    type: 'select',
    label: 'check.q.noticedWhen',
    options: ['check.opt.days', 'check.opt.weeks', 'check.opt.months'],
    dependsOn: { id: 'noticedFor', value: 0 },
  },
  {
    id: 'gettingWorse',
    step: 2,
    type: 'boolean',
    label: 'check.q.gettingWorse',
    options: ['check.opt.yes', 'check.opt.no'],
  },

  // ---------- STEP 4: Touch guide ----------
  {
    id: 'felt',
    step: 4,
    type: 'select',
    label: 'check.q.felt',
    options: [
      'check.feltNothing',
      'check.feltLump',
      'check.feltThickening',
      'check.feltPain',
      'check.feltSkin',
      'check.feltNotSure',
    ],
    other: true,
  },
]

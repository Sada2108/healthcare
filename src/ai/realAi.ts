export type AiLevel = 'green' | 'yellow' | 'red' | 'red-urgent'

export interface AiGuidance {
  summary: string
  possibleReasons: string[]
  whatToWatch: string[]
  whatToTellDoctor: string[]
  testsToAskAbout: string[]
  disclaimer: string
}

const FALLBACK: Record<AiLevel, AiGuidance> = {
  green: {
    summary: 'No warning signs found. Stay breast-aware and get a clinical breast exam from age 30.',
    possibleReasons: [],
    whatToWatch: [
      'Any new lump that does not go away after your next period.',
      'Skin changes such as dimpling or an orange-peel look.',
      'Nipple discharge, especially if it is bloody.',
      'Pain that stays in one spot and gets worse.',
    ],
    whatToTellDoctor: [],
    testsToAskAbout: ['Clinical breast exam from age 30'],
    disclaimer: 'Only a doctor can confirm this.',
  },
  yellow: {
    summary: 'Some findings need checking by a doctor.',
    possibleReasons: ['Some findings need checking by a doctor.'],
    whatToWatch: [
      'Any new lump that does not go away after your next period.',
      'Skin changes such as dimpling or an orange-peel look.',
      'Nipple discharge, especially if it is bloody.',
      'Pain that stays in one spot and gets worse.',
    ],
    whatToTellDoctor: ['Tell the doctor about any changes you noticed.'],
    testsToAskAbout: ['Clinical breast exam'],
    disclaimer: 'Only a doctor can confirm this.',
  },
  red: {
    summary: 'Please see a doctor soon.',
    possibleReasons: ['Your answers include a warning sign that needs a doctor\'s check.'],
    whatToWatch: [
      'Describe exactly when you first noticed each change.',
      'Tell the doctor if the change is in one breast or both.',
      'Mention any nipple discharge, especially if it is bloody.',
    ],
    whatToTellDoctor: ['Describe exactly when you first noticed each change.'],
    testsToAskAbout: ['Clinical breast exam', 'Ultrasound', 'Mammogram if advised by the doctor'],
    disclaimer: 'Only a doctor can confirm this.',
  },
  'red-urgent': {
    summary: 'Please get care today.',
    possibleReasons: ['Your answers include a warning sign that needs a doctor\'s check.'],
    whatToWatch: [
      'Describe exactly when you first noticed each change.',
      'Tell the doctor if the change is in one breast or both.',
      'Mention any nipple discharge, especially if it is bloody.',
    ],
    whatToTellDoctor: ['Describe exactly when you first noticed each change.'],
    testsToAskAbout: ['Clinical breast exam', 'Ultrasound', 'Mammogram if advised by the doctor'],
    disclaimer: 'Only a doctor can confirm this.',
  },
}

export function fallbackGuidance(level: AiLevel): AiGuidance {
  return { ...FALLBACK[level], summary: FALLBACK[level].summary + ' (AI guidance unavailable right now.)' }
}

export async function getGuidance(input: {
  level: AiLevel
  answers: Record<string, unknown>
  otherTexts: string[]
  language: string
}): Promise<AiGuidance> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const response = await fetch('/api/guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level: input.level,
        answers: input.answers,
        otherTexts: input.otherTexts,
        language: input.language,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`)
    }

    const data = await response.json()

    const guidance: AiGuidance = {
      summary: typeof data.summary === 'string' ? data.summary : '',
      possibleReasons: Array.isArray(data.possibleReasons) ? data.possibleReasons : [],
      whatToWatch: Array.isArray(data.whatToWatch) ? data.whatToWatch : [],
      whatToTellDoctor: Array.isArray(data.whatToTellDoctor) ? data.whatToTellDoctor : [],
      testsToAskAbout: Array.isArray(data.testsToAskAbout) ? data.testsToAskAbout : [],
      disclaimer: typeof data.disclaimer === 'string' ? data.disclaimer : 'Only a doctor can confirm this.',
    }
    return guidance
  } catch (err) {
    console.error('Real AI guidance failed, using fallback:', err)
    return fallbackGuidance(input.level)
  } finally {
    clearTimeout(timeoutId)
  }
}

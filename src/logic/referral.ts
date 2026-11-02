export type ReferralStep = 'Referred' | 'Booked' | 'Screened' | 'Result' | 'Follow-up'

export const REFERRAL_STEPS: ReferralStep[] = [
  'Referred',
  'Booked',
  'Screened',
  'Result',
  'Follow-up',
]

export type ReferralStatus = {
  step: ReferralStep
  date?: string
  note?: string
}

export function stepIndex(step: ReferralStep): number {
  return REFERRAL_STEPS.indexOf(step)
}

export function nextStep(step: ReferralStep): ReferralStep | null {
  const i = stepIndex(step)
  return i < REFERRAL_STEPS.length - 1 ? REFERRAL_STEPS[i + 1] : null
}

export function referralProgress(step: ReferralStep): { current: number; total: number } {
  return { current: stepIndex(step) + 1, total: REFERRAL_STEPS.length }
}

export function isFinalStep(step: ReferralStep): boolean {
  return step === 'Follow-up'
}

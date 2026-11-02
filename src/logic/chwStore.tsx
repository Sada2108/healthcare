import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ResultLevel } from '../logic/result'

export type CHWStatus = 'Registered' | 'Pending' | 'Dropped off'

export interface CHWoman {
  id: string
  name: string
  age: number
  phone: string
  language: string
  village: string
  status: CHWStatus
  lastUpdate: string // ISO date
  resultLevel?: ResultLevel
  otherText?: string
  referralStep?: string
  notes: string[]
}

interface CHWContextType {
  women: CHWoman[]
  addWoman: (woman: Omit<CHWoman, 'id' | 'notes'>) => void
  updateStatus: (id: string, status: CHWStatus) => void
  addNote: (id: string, note: string) => void
  getWoman: (id: string) => CHWoman | undefined
  sendReminder: (id: string) => void
}

const CHWContext = createContext<CHWContextType | undefined>(undefined)

const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const SEED: CHWoman[] = [
  {
    id: 'w-1',
    name: 'Priya Sharma',
    age: 34,
    phone: '+91 98765 43210',
    language: 'English',
    village: 'Dwarka',
    status: 'Registered',
    lastUpdate: daysAgo(2),
    resultLevel: 'yellow',
    otherText: 'I feel a small lump, not sure.',
    referralStep: 'Referred',
    notes: ['First visit, counselled.'],
  },
  {
    id: 'w-2',
    name: 'Anita Verma',
    age: 41,
    phone: '+91 91234 56789',
    language: 'हिन्दी',
    village: 'Rohini',
    status: 'Pending',
    lastUpdate: daysAgo(10),
    resultLevel: 'red',
    otherText: 'There is blood in the discharge and it is growing.',
    referralStep: 'Booked',
    notes: [],
  },
  {
    id: 'w-3',
    name: 'Sunita Rao',
    age: 38,
    phone: '+91 99887 76655',
    language: 'English',
    village: 'Saket',
    status: 'Dropped off',
    lastUpdate: daysAgo(20),
    resultLevel: 'green',
    otherText: 'Nothing unusual.',
    referralStep: 'Screened',
    notes: [],
  },
  {
    id: 'w-4',
    name: 'Kavita Joshi',
    age: 45,
    phone: '+91 90011 22334',
    language: 'हिन्दी',
    village: 'Janakpuri',
    status: 'Registered',
    lastUpdate: daysAgo(1),
    resultLevel: 'red-urgent',
    otherText: 'Red, hot, swollen breast with fever.',
    referralStep: 'Result',
    notes: ['Urgent referral sent.'],
  },
]

export function CHWProvider({ children }: { children: ReactNode }) {
  const [women, setWomen] = useState<CHWoman[]>(SEED)

  const addWoman = useCallback(
    (woman: Omit<CHWoman, 'id' | 'notes'>) => {
      const id = 'w-' + Date.now()
      setWomen((prev) => [
        ...prev,
        { ...woman, id, notes: [], lastUpdate: new Date().toISOString() },
      ])
    },
    [],
  )

  const updateStatus = useCallback((id: string, status: CHWStatus) => {
    setWomen((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status, lastUpdate: new Date().toISOString() } : w,
      ),
    )
  }, [])

  const addNote = useCallback((id: string, note: string) => {
    setWomen((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, notes: [...w.notes, note], lastUpdate: new Date().toISOString() }
          : w,
      ),
    )
  }, [])

  const getWoman = useCallback((id: string) => women.find((w) => w.id === id), [women])

  const sendReminder = useCallback((id: string) => {
    setWomen((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, lastUpdate: new Date().toISOString() }
          : w,
      ),
    )
  }, [])

  return (
    <CHWContext.Provider value={{ women, addWoman, updateStatus, addNote, getWoman, sendReminder }}>
      {children}
    </CHWContext.Provider>
  )
}

export function useCHW() {
  const ctx = useContext(CHWContext)
  if (!ctx) throw new Error('useCHW must be used within CHWProvider')
  return ctx
}

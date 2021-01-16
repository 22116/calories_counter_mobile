import { Counter } from 'src/store/persistent/counters-models'

export type Hash = string
export type History = Record<string, DayData>

export interface Profile {
  dark: boolean | null,
  theme: string,
}

export interface DayData {
  counters: Record<Hash, Counter>,
}

export interface PersistentStoreInterface {
  profile: Profile,
  counters: Record<Hash, Counter>,
  history: History,
  version: number
}

const state: PersistentStoreInterface = {
  profile: {
    dark: null,
    theme: '#1976D2'
  },
  counters: {},
  history: {},
  version: 1
}

export default state

export interface Profile {
  limit: number,
  dark: boolean | null,
}

export interface DayData {
  limit: number,
  current: number,
  date: string,
}

export interface StoreInterface {
  profile: Profile,
  history: Array<DayData>,
}

const state: StoreInterface = {
  profile: {
    limit: 2000,
    dark: null,
  },
  history: [],
};

export default state;

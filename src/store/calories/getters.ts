import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DayData, Profile, StoreInterface } from './state';

const getters: GetterTree<StoreInterface, StateInterface> = {
  history(context): Array<DayData> {
    return context.history;
  },
  profile(context): Profile {
    return context.profile;
  },
  currentDay(context): DayData {
    const date = new Date().toDateString();

    return context.history.find((day) => day.date === date) || {
      date,
      limit: context.profile.limit,
      current: 0,
    };
  },
};

export default getters;

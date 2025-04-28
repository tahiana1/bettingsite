import { atom } from "jotai";

import { atomWithStorage } from "jotai/utils";

export const textState = atom<any>("1");

export const userState = atom<any>({});

export const notiState = atomWithStorage<any>("notifications", []);

export const notificationState = atom<any[]>([]);

export const leagueState = atom<any[]>([]);

export const sportState = atom<any[]>([]);

export const fixtureState = atom<any[]>([]);

export const currentSportState = atom<any>([]);

export const currentLeagueState = atom<any>([]);

export const currentFixtureState = atom<any>([]);

export const rateState = atom<any[]>([]);

export const betAmount = atom<number>(0);

export const expectedWinningAmount = atom<Promise<number>>(async (get) => {
  const rates = get(rateState);
  const bAmount = get(betAmount);

  const da = rates.map((r) => {
    if (r.selection == r.homePickName) {
      return r.homeRate;
    } else if (r.selection == r.awayPickName) {
      return r.awayRate;
    } else if (r.selection == r.drawPickName) {
      return r.drawRate;
    }
  });

  return da.reduce((acc, num) => acc * num, 1) * bAmount;
});

import { atom } from "jotai";
export const textState = atom<any>("1");

export const userState = atom<any>({
  id: 1,
  username: "ZaoXue",
  balance: 2345123,
});

export const leagueState = atom<any[]>([]);

export const currentLeagueState = atom<any>({});

export const rateState = atom<any[]>([]);

export const betAmount = atom<number>(0);

export const expectedWinningAmount = atom<Promise<number>>(async (get) => {
  const rates = get(rateState);
  const bAmount = get(betAmount);
  let b = 0;
  const a = rates.map((r) => {
    if (r.selection == r.homePickName) {
      b += r.homeRate * bAmount;
      return r.homeRate * bAmount;
    } else if (r.selection == r.awayPickName) {
      b += r.awayRate * bAmount;
      return r.awayRate * bAmount;
    } else if (r.selection == r.drawPickName) {
      b += r.drawRate * bAmount;
      return r.drawRate * bAmount;
    }
  });

  const da = rates.map((r) => {
    if (r.selection == r.homePickName) {
      return r.homeRate;
    } else if (r.selection == r.awayPickName) {
      return r.awayRate;
    } else if (r.selection == r.drawPickName) {
      return r.drawRate;
    }
  });
  console.log({ rates, bAmount, b, a },  da.reduce((acc, num) => acc * num, 1) );
  return da.reduce((acc, num) => acc * num, 1) * bAmount;
});

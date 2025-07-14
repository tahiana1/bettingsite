import { Button, Card, Radio, message } from "antd";
import { useState } from "react";

import { rateState } from "@/state/state";
import { useAtom } from "jotai";
import { showBettingCartState, userState } from "@/state/state";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes";
import { useTranslations } from "next-intl";

const FixtureCard: React.FC<{ data: any; title: any }> = ({ data, title }) => {
  const [show, setShow] = useState<boolean>(false);
  const [rates, setRates] = useAtom<any[]>(rateState);
  const [, setShowBettingCart] = useAtom(showBettingCartState);
  const [profile] = useAtom(userState);
  const router = useRouter();
  const t = useTranslations();
  const onBet = (v: any, rate: any) => {
    // Check if user is logged in
    if (!profile?.userId) {
      message.warning(t("partner/menu/pleaseLogin"));
      router.push("/auth/signIn");
      return;
    }

    // Find the current selection for this market+
    const current = rates.find((r) => r.id == rate.id);
    if (current && String(current.selection) === String(v)) {
      // Toggling off: remove the rate with this id
      const newRates = rates.filter((r) => r.id !== rate.id);
      setRates(newRates);
      if (newRates.length === 0) setShowBettingCart(false);
      message.info(t("betRemovedFromCart"));
      return;
    }
    // Toggling on: replace any existing rate with this id
    const filteredRates = rates.filter((r) => r.id !== rate.id);
    let r = { ...rate };
    r.selection = v;
    r.title = `${data.homeTeam.name} VS ${data.awayTeam.name}`;
    r.homeTeam = data.homeTeam;
    r.awayTeam = data.awayTeam;
    const newRates = [...filteredRates, r];
    setRates(newRates);
    setShowBettingCart(true);
    message.success(t("betAddedToCart"));
  };
  return (
    <Card
      title={title}
      className="mb-2 w-full mx-auto"
      classNames={{
        header: "dark:bg-black ",
      }}
      extra={<div>{ dayjs(data.startDate).format("DD/MM/YYYY HH:mm")}</div>}
    >
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-1/4" />
          <col className="w-1/2" />
          <col className="w-1/4" />
        </colgroup>
        <thead>
          <tr>
            <td className="w-1/4">
              <div className="truncate">{data.rates.at(0).market.name}</div>
            </td>
            <td className="w-1/2">
              <Radio.Group
                className="w-full items-center !flex gap-1"
                optionType="button"
                buttonStyle="solid"
                value={
                  rates.find((r) => r.id == data.rates.at(0).id)?.selection || undefined
                }
                onChange={(e) => onBet(e.target.value, data.rates.at(0))}
              >
                <Radio.Button
                  value={data.rates.at(0).homePickName}
                  className="w-[110px] flex-2 whitespace-nowrap"
                  onClick={() => {
                    // If already selected, toggle off
                    const selected = rates.find((r) => r.id == data.rates.at(0).id)?.selection;
                    if (selected === data.rates.at(0).homePickName) {
                      onBet(data.rates.at(0).homePickName, data.rates.at(0));
                    }
                  }}
                >
                  {data.homeTeam?.name} - <span className="text-sm text-[#71cb4a] font-bold">{data.rates.at(0).homeRate}</span>
                </Radio.Button>

                {[
                  "first_goal",
                ].indexOf(data.rates.at(0).market.type) > -1 ||
                data.rates.at(0).market.name === "Handicap" ||
                data.rates.at(0).market.name === "Under/Over" ? (
                  <label className="w-[110px] flex-1 text-sm text-center whitespace-nowrap inline-block align-middle">
                    {[
                      "first_goal",
                    ].indexOf(data.rates.at(0).market.type) > -1
                      ? "VS"
                      : data.rates.at(0).baseLine}
                  </label>
                ) : (
                  <Radio.Button
                    value={
                      data.rates.at(0).drawPickName ||
                      data.rates.at(0).baseLine
                    }
                    onClick={() => {
                      // If already selected, toggle off
                      const selected = rates.find((r) => r.id == data.rates.at(0).id)?.selection;
                      if (selected === data.rates.at(0).drawPickName || selected === data.rates.at(0).baseLine) {
                        onBet(data.rates.at(0).drawPickName || data.rates.at(0).baseLine, data.rates.at(0));
                      }
                    }}
                    className="w-[110px] text-center flex-1 !px-0 whitespace-nowrap"
                  >
                    {data.rates.at(0).market.type == "match_winner"
                      ? data.rates.at(0).drawRate
                      : data.rates.at(0).baseLine}
                  </Radio.Button>
                )}

                <Radio.Button
                  value={data.rates.at(0).awayPickName}
                  className="w-[110px] flex-2 whitespace-nowrap"
                  onClick={() => {
                    // If already selected, toggle off
                    const selected = rates.find((r) => r.id == data.rates.at(0).id)?.selection;
                    if (selected === data.rates.at(0).awayPickName) {
                      onBet(data.rates.at(0).awayPickName, data.rates.at(0));
                    }
                  }}
                  >
                  <span className="text-sm text-[#71cb4a] font-bold">{data.rates.at(0).awayRate}</span> - {data.awayTeam?.name}
                </Radio.Button>
              </Radio.Group>
            </td>

            <td className="w-1/4">
              {data.rates.length > 0 ? (
                <Button
                  onClick={() => setShow(!show)}
                  color="green"
                  variant={show ? "outlined" : "solid"}
                  className="ml-2"
                >
                  {show ? "-" : "+"} {data.rates.length}
                </Button>
              ) : null}
            </td>
          </tr>
        </thead>
        <tbody className={show ? "" : "hidden"}>
          {data.rates
            .filter((r: any, i: number) => r.id && i > 0)
            .map((r: any) => (
              <tr key={r.id}>
                <td className="w-1/4">
                  <div className="truncate">{r.market.name}</div>
                </td>
                <td className="w-1/2">
                  <Radio.Group
                    className="w-full items-center !flex gap-1 flex-nowrap"
                    optionType="button"
                    buttonStyle="solid"
                    value={rates.find((rr) => rr.id == r.id)?.selection || undefined}
                    onChange={(e) => onBet(e.target.value, r)}
                  >
                    <Radio.Button
                      value={r.homePickName}
                      className="w-[110px] flex-2 whitespace-nowrap"
                      onClick={() => {
                        // If already selected, toggle off
                        const selected = rates.find((rr) => rr.id == r.id)?.selection;
                        if (selected === r.homePickName) {
                          onBet(r.homePickName, r);
                        }
                      }}
                    >
                      {data.homeTeam?.name} - <span className="text-sm text-[#71cb4a] font-bold">{r.homeRate}</span>
                    </Radio.Button>
                    {[
                      "first_goal",
                    ].indexOf(r.market.type) > -1 ||
                    r.market.name === "Handicap" ? (
                      <label className="w-[110px] flex-1 text-sm text-center whitespace-nowrap inline-block align-middle">
                        {[
                          "first_goal",
                        ].indexOf(r.market.type) > -1
                          ? "VS"
                          : r.baseLine}
                      </label>
                    ) : (
                      <Radio.Button
                        value={r.drawPickName || r.baseLine}
                        className="w-[110px] text-center flex-1 !px-0 whitespace-nowrap"
                        onClick={() => {
                          // If already selected, toggle off
                          const selected = rates.find((rr) => rr.id == r.id)?.selection;
                          if (selected === r.drawPickName || selected === r.baseLine) {
                            onBet(r.drawPickName || r.baseLine, r);
                          }
                        }}
                      >
                        {r.market.type == "match_winner"
                          ? r.drawRate
                          : r.baseLine}
                      </Radio.Button>
                    )}

                    <Radio.Button
                      value={r.awayPickName}
                      className="w-[110px] flex-2 whitespace-nowrap"
                      onClick={() => {
                        // If already selected, toggle off
                        const selected = rates.find((rr) => rr.id == r.id)?.selection;
                        if (selected === r.awayPickName) {
                          onBet(r.awayPickName, r);
                        }
                      }}
                    >
                      <span className="text-sm text-[#71cb4a] font-bold">{r.awayRate}</span> - {data.awayTeam?.name}
                    </Radio.Button>
                  </Radio.Group>
                </td>
                <td className="w-1/4"></td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
};

export default FixtureCard;
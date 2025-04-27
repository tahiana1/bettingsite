import { Button, Card, Radio } from "antd";
import { useState } from "react";

import { rateState } from "@/state/state";
import { useAtom } from "jotai";
const FixtureCard: React.FC<{ data: any; title: any }> = ({ data, title }) => {
  const [show, setShow] = useState<boolean>(false);
  const [rates, setRates] = useAtom<any[]>(rateState);
  const onBet = (v: any, rate: any) => {
    rate.selection = v;
    const rIndex = rates.findIndex((r) => r.id == rate.id);
    let r = rate;
    r.title = `${data.homeTeam.name} VS ${data.awayTeam.name}`;
    r.homeTeam = data.homeTeam;
    r.awayTeam = data.awayTeam;
    if (rIndex > -1) {
      r = rates[rIndex];
      r.selection = v;
      r.title = `${data.homeTeam.name} VS ${data.awayTeam.name}`;
      r.homeTeam = data.homeTeam;
      r.awayTeam = data.awayTeam;
      setRates(rates.map((rr: any) => (rr.id == r.id ? r : rr)));
    } else {
      setRates([...rates, r]);
    }
  };
  return (
    <Card
      title={title}
      className="mb-2 w-full"
      classNames={{
        header: "dark:bg-black ",
      }}
      extra={<div>{data.startDate}</div>}
    >
      <table className="w-full">
        <thead>
          <tr>
            <td>
              <div>{data.rates.at(0).market.name}</div>
            </td>
            <td>
              <Radio.Group
                className="w-full items-center !flex gap-1"
                optionType="button"
                buttonStyle="solid"
                value={
                  rates.find((r) => r.id == data.rates.at(0).id)?.selection
                }
                onChange={(e) => onBet(e.target.value, data.rates.at(0))}
              >
                <Radio.Button
                  value={data.rates.at(0).homePickName}
                  className="w-2/5 flex-2 whitespace-nowrap"
                >
                  {data.homeTeam?.name} - {data.rates.at(0).homeRate}
                </Radio.Button>

                {data.rates.at(0).drawPickName ? (
                  <Radio.Button
                    value={data.rates.at(0).drawPickName}
                    className="text-center flex-1 whitespace-nowrap"
                  >
                    {data.rates.at(0).market.type == "match_winner"
                      ? data.rates.at(0).drawRate
                      : data.rates.at(0).baseLine}
                  </Radio.Button>
                ) : (
                  <label className="w-1/5 flex-1 text-sm text-center whitespace-nowrap">
                    {["first_goal"].indexOf(data.rates.at(0).market.type) > -1
                      ? "VS"
                      : data.rates.at(0).market.type == "match_winner"
                      ? data.rates.at(0).drawRate
                      : data.rates.at(0).baseLine}
                  </label>
                )}

                <Radio.Button
                  value={data.rates.at(0).awayPickName}
                  className="w-2/5 flex-2 whitespace-nowrap"
                >
                  {data.rates.at(0).awayRate} - {data.awayTeam?.name}
                </Radio.Button>
              </Radio.Group>
            </td>

            <td>
              {data.rates.length > 0 ? (
                <Button
                  onClick={() => setShow(!show)}
                  color="green"
                  variant={show ? "outlined" : "solid"}
                  className="ml-2"
                >
                  + {data.rates.length}
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
                <td>
                  <div>{r.market.name}</div>
                </td>
                <td>
                  <Radio.Group
                    className="w-full items-center !flex gap-1 flex-nowrap"
                    optionType="button"
                    buttonStyle="solid"
                    value={rates.find((rr) => rr.id == r.id)?.selection}
                    onChange={(e) => onBet(e.target.value, r)}
                  >
                    <Radio.Button
                      value={r.homePickName}
                      className="w-2/5 flex-2 whitespace-nowrap"
                    >
                      {data.homeTeam?.name} - {r.homeRate}
                    </Radio.Button>
                    {r.drawPickName ? (
                      <Radio.Button
                        value={r.drawPickName}
                        className="w-1/5 text-center flex-1 !px-0 whitespace-nowrap"
                      >
                        {r.market.type == "match_winner"
                          ? r.drawRate
                          : r.baseLine}
                      </Radio.Button>
                    ) : (
                      <label className="w-1/5 flex-1 text-sm text-center whitespace-nowrap">
                        {["first_goal"].indexOf(r.market.type) > -1
                          ? "VS"
                          : r.market.type == "match_winner"
                          ? r.drawRate
                          : r.baseLine}
                      </label>
                    )}

                    <Radio.Button
                      value={r.awayPickName}
                      className="w-2/5 flex-2 whitespace-nowrap"
                    >
                      {r.awayRate} - {data.awayTeam?.name}
                    </Radio.Button>
                  </Radio.Group>
                </td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
};

export default FixtureCard;

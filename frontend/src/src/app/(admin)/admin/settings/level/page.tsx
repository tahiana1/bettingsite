"use client";
import { useState } from "react";
import { Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, Select, Switch, Table } from "antd";
import { useTranslations } from "next-intl";

export default function LevelPage() {
    const t = useTranslations();
    const numberOptions = [
        {lable: t("noRestrictions"), value : 0},
        {lable: t("100"), value : 100},
        {lable: t("1 thousand"), value : 1000},
        {lable: t("10,000"), value : 10000},
        {lable: t("100,000"), value : 100000},
    ]

    const paymentCycleOptions = [
        {label: t("disposable"), value : "disposable"},
        {lable: t("daily"), value : "daily"},
        {lable: t("weekly"), value : "weekly"},
        {lable: t("monthly"), value : "monthly"},
    ]

    const applicabliltyByGameOptions = [
        {label: t("live"), value : "live"},
        {label: t("slot"), value : "slot"},
        {label: t("mini"), value : "mini"},
        {label: t("hold'em"), value : "hold'em"},
        {label: t("sports"), value : "sports"},
        {label: t("virtual"), value : "virtual"},
        {label: t("lotus"), value : "lotus"},
        {label: t("mgm"), value : "mgm"},
        {label: t("touch"), value : "touch"}
    ]

    const paymentMethodOptions = [
        {label: t("automatic"), value : "automatic"},
        {label: t("passive"), value : "passive"},
    ]

    const paymentFormulaOptions = [
        {label: t("(Deposit-Withdrawal-holdingMoney)*rate%"), value : "(Deposit-Withdrawal-holdingMoney)*rate%"},
        {label: t("(Be-dang)*rate%"), value : "(Be-dang)*rate%"},
        {label: t("(Be-dang-PointConversion)*rate%"), value : "(Be-dang-PointConversion)*rate%"},
        {label: t("(Input-Output)*Rate%"), value : "(Input-Output)*Rate%"},
        {label: t("(Deposit-Withdrawal-holdingMoney)*rate%"), value : "(Deposit-Withdrawal-holdingMoney)*rate%"},
    ]

    const referralOption = [
        {label: t("notInUse"), value : "notInUse"},
        {label: t("bettingAmount%"), value : "bettingAmount%"},
        {label: t("%ofWinnings"), value : "%ofWinnings"},
    ]

    const surpriseBonusTableColumns = [
        {title: t("number"), dataIndex: "number", key: "number", width: 100},
        {title: t("timeInterval"), dataIndex: "timeInterval", key: "timeInterval", width: 100},
        {title: t("surpriseBonus%"), dataIndex: "surpriseBonus%", key: "surpriseBonus%", width: 100},
        {title: t("paymentStatus"), dataIndex: "paymentStatus", key: "paymentStatus", width: 100},
        {title: "-", dataIndex: "action", key: "action", width: 300, render: (text: string, record: any) => {
            return <>
                <Button type="primary" onClick={() => {}}>{t("change")}</Button>
                <Button type="primary" danger onClick={() => {}}>{t("delete")}</Button>
            </>
        }},
    ]

    const bonusPaymentMethodOptions = [
        {label: t("unpaid"), value : "unpaid"},
        {label: t("payment1"), value : "payment1"},
        {label: t("payment2"), value : "payment2"},
        {label: t("payment3"), value : "payment3"},
        {label: t("payment4"), value : "payment4"},
        {label: t("payment5"), value : "payment5"}
    ]

    const surpriseBonusTableData = [
        {number: 1, timeInterval: t("timeInterval"), surpriseBonus: t("surpriseBonus"), paymentStatus: t("paymentStatus")},
        {number: 2, timeInterval: t("timeInterval"), surpriseBonus: t("surpriseBonus"), paymentStatus: t("paymentStatus")},
        {number: 3, timeInterval: t("timeInterval"), surpriseBonus: t("surpriseBonus"), paymentStatus: t("paymentStatus")},
        {number: 4, timeInterval: t("timeInterval"), surpriseBonus: t("surpriseBonus"), paymentStatus: t("paymentStatus")},
        {number: 5, timeInterval: t("timeInterval"), surpriseBonus: t("surpriseBonus"), paymentStatus: t("paymentStatus")},
    ]

    const chargingBonusTableColumns = [
        {title: t("member"), dataIndex: "member", key: "member", width: 250},
        {title: t("bonusPaymentMethod"), dataIndex: "bonusPaymentMethod", key: "bonusPaymentMethod", width: 100},
        {title: "-", dataIndex: "action", key: "action", width: 100, render: (text: string, record: any) => {
            return <>
                <Button type="primary" onClick={() => {}}>{t("change")}</Button>
                <Button type="primary" danger onClick={() => {}}>{t("delete")}</Button>
            </>
        }},
    ]

    return <Card title={t("admin/menu/levelSettingTitle")}>
        <div className="flex flex-wrap gap-2">
            <Button>{t("level1")}</Button>
            <Button>{t("level2")}</Button>
            <Button>{t("level3")}</Button>
            <Button>{t("level4")}</Button>
            <Button>{t("level5")}</Button>
            <Button>{t("level6")}</Button>
            <Button>{t("level7")}</Button>
            <Button>{t("level8")}</Button>
            <Button>{t("level9")}</Button>
            <Button>{t("level10")}</Button>
            <Button>{t("level11")}</Button>
            <Button>{t("level12")}</Button>
            <Button>{t("levelVIP1")}</Button>
            <Button>{t("levelVIP2")}</Button>
            <Button>{t("levelPremium")}</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
            <Card 
                title={t("level1Setting")}
                className="max-w-[900px]"
                headStyle={{ backgroundColor: 'black', color: 'white' }}
            >
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2">
                        <Form
                            onFinish={() => {}}
                            labelCol={{ span: 12 }}
                        >
                            <Form.Item label={t("minimumDepositAmount")} name="minimumDepositAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("minimumWithdrawalAmount")} name="minimumWithdrawalAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumDepositAmount")} name="maximumDepositAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumWithdrawalAmount")} name="maximumWithdrawalAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumDailyWithdrawalAmount")} name="maximumDailyWithdrawalAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("pointsAwardedWhenWritingAPost")} name="pointsAwardedWhenWritingAPost">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("p")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("dailyLimitOnNumberOfPostingPoints")} name="dailyLimitOnNumberOfPostingPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("th")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("depositAmountUnit")} name="depositAmountUnit">
                                <Select options={numberOptions} />
                            </Form.Item>
                            <Form.Item label={t("withdrawalAmountUnit")} name="withdrawalAmountUnit">
                                <Select options={numberOptions} />
                            </Form.Item>
                            <Form.Item label={t("enterPasswordWhenInquiringAboutAccount")} name="enterPasswordWhenInquiringAboutAccount">
                                <Switch className="flex justify-end"/>
                            </Form.Item>     
                            <Form.Item label={t("minigameSinglePoleDrawPoint")} name="minigameSinglePoleDrawPoint">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>     
                            <Form.Item label={t("minigameCombinationWinningPoints")} name="minigameCombinationWinningPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>     
                            <Form.Item label={t("totalPointsLostInMinigames")} name="totalPointsLostInMinigames">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>     
                            <Form.Item label={t("sportsLiveSinglePollDrawPoints")} name="sportsLiveSinglePollDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>    
                            <Form.Item label={t("sportsLive2PoleDrawPoints")} name="sportsLive2PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>    
                            <Form.Item label={t("sportsLive3PoleDrawPoints")} name="sportsLive3PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("sportsLive4PoleDrawPoints")} name="sportsLive4PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("sportsLiveDapolLostPoints")} name="sportsLiveDapolLostPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                      
                            <Form.Item label={t("sportsTotalLostPoints")} name="sportsTotalLostPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatchSinglePoleDrawPoints")} name="sportsPreMatchSinglePoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatch2PoleDrawPoints")} name="sportsPreMatch2PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatch3PoleDrawPoints")} name="sportsPreMatch3PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatch4PoleDrawPoints")} name="sportsPreMatch4PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>  
                            <Form.Item label={t("sportsPreMatchDapolLostPoints")} name="sportsPreMatchDapolLostPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>       
                            <Form.Item label={t("sportsPreMatchTotalDrawPoints")} name="sportsPreMatchTotalDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>       
                            <Form.Item label={t("maximumSportsLotteryPoints1Day")} name="maximumSportsLotteryPoints1Day">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("p")}</span>} />
                            </Form.Item>  
                            <Form.Item label={t("virtualGameSinlePoleDrawPoints")} name="virtualGameSinlePoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("virtualGameDapolLosingPoints")} name="virtualGameDapolLosingPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("virtualGameTotalLossPoints")} name="virtualGameTotalLossPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                                  
                        </Form>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Form
                            onFinish={() => {}}
                            labelCol={{ span: 12 }}
                        >
                            <Form.Item label={t("casinoLiveMaximumRolling")} name="casinoLiveMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                        
                            <Form.Item label={t("casinoLiveMinimumRolling")} name="casinoLiveMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                        
                            <Form.Item label={t("casinoSlotsMaxRolling")} name="casinoSlotsMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                        
                            <Form.Item label={t("casinoSlotsMinimumRolling")} name="casinoSlotsMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("holdemPokerMaximumRolling")} name="holdemPokerMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>    
                            <Form.Item label={t("holdemPokerMinimumRolling")} name="holdemPokerMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("minigameMinimumBetAmount")} name="minigameMinimumBetAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>         
                            <Form.Item label={t("minigameMaxRolling")} name="minigameMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>  
                            <Form.Item label={t("minigameMinimumRolling")} name="minigameMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("sportsMaxRolling")} name="sportsMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("sportsMinimumRolling")} name="sportsMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("virtualGameMaximumRolling")} name="virtualGameMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("minimumRollingForVirtualGames")} name="minimumRollingForVirtualGames">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("lotusMaxRolling")} name="lotusMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("lotusMinimumRolling")} name="lotusMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("mgmMaxRolling")} name="mgmMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("mgmMinimumRolling")} name="mgmMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("touchGameMinimumRolling")} name="touchGameMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("touchGameMaximumRolling")} name="touchGameMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("touchGameMinimumRolling")} name="touchGameMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("rollingCoversionMinimumAmount")} name="rollingCoversionMinimumAmount">
                                <InputNumber min={0}/>
                            </Form.Item>
                            <Form.Item label={t("rollingCoversionLimitPerDay")} name="rollingCoversionLimitPerDay">
                                <InputNumber min={0}/>
                            </Form.Item>
                            <Form.Item label={t("rollingCoversion1DayAmountLimit")} name="rollingCoversion1DayAmountLimit">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("waitingTimeForReApplicationAfterExchangeIsCompleted")} name="waitingTimeForReApplicationAfterExchangeIsCompleted">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("waitingTimeForReApplicationAfterChargingIsCompleted")} name="waitingTimeForReApplicationAfterChargingIsCompleted">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted")} name="waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("timeLimitForExchangeingMoreThanXTimesOnTheSameDay")} name="timeLimitForExchangeingMoreThanXTimesOnTheSameDay">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumAmountOfBettingHistoryReduction")} name="maximumAmountOfBettingHistoryReduction">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("reduceBettingAmountPerDay")} name="reduceBettingAmountPerDay">
                                <InputNumber min={0} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-2">
                        <Form
                            onFinish={() => {}}
                            labelCol={{ span: 12 }}
                        >
                            <Form.Item label={t("minimumDepositAmount")} name="minimumDepositAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("minimumWithdrawalAmount")} name="minimumWithdrawalAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumDepositAmount")} name="maximumDepositAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumWithdrawalAmount")} name="maximumWithdrawalAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumDailyWithdrawalAmount")} name="maximumDailyWithdrawalAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("pointsAwardedWhenWritingAPost")} name="pointsAwardedWhenWritingAPost">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("p")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("dailyLimitOnNumberOfPostingPoints")} name="dailyLimitOnNumberOfPostingPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("th")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("depositAmountUnit")} name="depositAmountUnit">
                                <Select options={numberOptions} />
                            </Form.Item>
                            <Form.Item label={t("withdrawalAmountUnit")} name="withdrawalAmountUnit">
                                <Select options={numberOptions} />
                            </Form.Item>
                            <Form.Item label={t("enterPasswordWhenInquiringAboutAccount")} name="enterPasswordWhenInquiringAboutAccount">
                                <Switch className="flex justify-end"/>
                            </Form.Item>     
                            <Form.Item label={t("minigameSinglePoleDrawPoint")} name="minigameSinglePoleDrawPoint">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>     
                            <Form.Item label={t("minigameCombinationWinningPoints")} name="minigameCombinationWinningPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>     
                            <Form.Item label={t("totalPointsLostInMinigames")} name="totalPointsLostInMinigames">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>     
                            <Form.Item label={t("sportsLiveSinglePollDrawPoints")} name="sportsLiveSinglePollDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>    
                            <Form.Item label={t("sportsLive2PoleDrawPoints")} name="sportsLive2PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>    
                            <Form.Item label={t("sportsLive3PoleDrawPoints")} name="sportsLive3PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("sportsLive4PoleDrawPoints")} name="sportsLive4PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("sportsLiveDapolLostPoints")} name="sportsLiveDapolLostPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                      
                            <Form.Item label={t("sportsTotalLostPoints")} name="sportsTotalLostPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatchSinglePoleDrawPoints")} name="sportsPreMatchSinglePoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatch2PoleDrawPoints")} name="sportsPreMatch2PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatch3PoleDrawPoints")} name="sportsPreMatch3PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("sportsPreMatch4PoleDrawPoints")} name="sportsPreMatch4PoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>  
                            <Form.Item label={t("sportsPreMatchDapolLostPoints")} name="sportsPreMatchDapolLostPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>       
                            <Form.Item label={t("sportsPreMatchTotalDrawPoints")} name="sportsPreMatchTotalDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>       
                            <Form.Item label={t("maximumSportsLotteryPoints1Day")} name="maximumSportsLotteryPoints1Day">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("p")}</span>} />
                            </Form.Item>  
                            <Form.Item label={t("virtualGameSinlePoleDrawPoints")} name="virtualGameSinlePoleDrawPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("virtualGameDapolLosingPoints")} name="virtualGameDapolLosingPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("virtualGameTotalLossPoints")} name="virtualGameTotalLossPoints">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                                  
                        </Form>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Form
                            onFinish={() => {}}
                            labelCol={{ span: 12 }}
                        >
                            <Form.Item label={t("casinoLiveMaximumRolling")} name="casinoLiveMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                        
                            <Form.Item label={t("casinoLiveMinimumRolling")} name="casinoLiveMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                        
                            <Form.Item label={t("casinoSlotsMaxRolling")} name="casinoSlotsMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>                                                                                                        
                            <Form.Item label={t("casinoSlotsMinimumRolling")} name="casinoSlotsMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item> 
                            <Form.Item label={t("holdemPokerMaximumRolling")} name="holdemPokerMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>    
                            <Form.Item label={t("holdemPokerMinimumRolling")} name="holdemPokerMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("minigameMinimumBetAmount")} name="minigameMinimumBetAmount">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>         
                            <Form.Item label={t("minigameMaxRolling")} name="minigameMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>  
                            <Form.Item label={t("minigameMinimumRolling")} name="minigameMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>   
                            <Form.Item label={t("sportsMaxRolling")} name="sportsMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("sportsMinimumRolling")} name="sportsMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("virtualGameMaximumRolling")} name="virtualGameMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("minimumRollingForVirtualGames")} name="minimumRollingForVirtualGames">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("lotusMaxRolling")} name="lotusMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("lotusMinimumRolling")} name="lotusMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("mgmMaxRolling")} name="mgmMaxRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("mgmMinimumRolling")} name="mgmMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("touchGameMinimumRolling")} name="touchGameMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("touchGameMaximumRolling")} name="touchGameMaximumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("touchGameMinimumRolling")} name="touchGameMinimumRolling">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                            </Form.Item>
                            <Form.Item label={t("rollingCoversionMinimumAmount")} name="rollingCoversionMinimumAmount">
                                <InputNumber min={0}/>
                            </Form.Item>
                            <Form.Item label={t("rollingCoversionLimitPerDay")} name="rollingCoversionLimitPerDay">
                                <InputNumber min={0}/>
                            </Form.Item>
                            <Form.Item label={t("rollingCoversion1DayAmountLimit")} name="rollingCoversion1DayAmountLimit">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("waitingTimeForReApplicationAfterExchangeIsCompleted")} name="waitingTimeForReApplicationAfterExchangeIsCompleted">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("waitingTimeForReApplicationAfterChargingIsCompleted")} name="waitingTimeForReApplicationAfterChargingIsCompleted">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted")} name="waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("timeLimitForExchangeingMoreThanXTimesOnTheSameDay")} name="timeLimitForExchangeingMoreThanXTimesOnTheSameDay">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("maximumAmountOfBettingHistoryReduction")} name="maximumAmountOfBettingHistoryReduction">
                                <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                            </Form.Item>
                            <Form.Item label={t("reduceBettingAmountPerDay")} name="reduceBettingAmountPerDay">
                                <InputNumber min={0} />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Card>
            <Card 
                title={t("level1PayBackSetting")}
                className="max-w-[500px]"
                headStyle={{ backgroundColor: 'black', color: 'white' }}
                actions={
                    [<Button type="default" onClick={() => {}}>{t("change")}</Button>,
                    <Button type="default" onClick={() => {}}>{t("applyToAllLevelsAtOnce")}</Button>]
                }
            >
                <Form
                    onFinish={() => {}}
                    labelCol={{ span: 12 }}
                >
                    <Form.Item label={t("paymentCycle")} name="paymentCycle">
                       <Select options={paymentCycleOptions} />
                    </Form.Item>
                    <Form.Item label={t("startDateAndTime")} name="startDateAndTime">
                       <DatePicker showTime />
                    </Form.Item>
                    <Form.Item label={t("deadline")} name="deadline">
                       <DatePicker showTime />
                    </Form.Item>
                    <Form.Item label={t("paymentDate")} name="paymentDate">
                       <DatePicker showTime />
                    </Form.Item>
                    <Form.Item label={t("applicabliltyByGame")} name="applicabliltyByGame">
                       <Checkbox.Group options={applicabliltyByGameOptions} />
                    </Form.Item>
                    <Form.Item label={t("paymentMethod")} name="paymentMethod">
                       <Select options={paymentMethodOptions} />
                    </Form.Item>
                    <Form.Item label={t("paymentFormula")} name="paymentFormula">
                       <Select options={paymentFormulaOptions} />
                    </Form.Item>
                    <Form.Item label={t("payback%")} name="payback%">
                       <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("ifTheAmountIs(-),ItIsProcessedAs0")} name="ifTheAmountIs(-),ItIsProcessedAs0">
                       <Switch />
                    </Form.Item>
                    <Form.Item label={t("nonPaymentWhenDepositWithdrawalDifferenceIs(-)")} name="nonPaymentWhenDepositWithdrawalDifferenceIs(-)">
                       <Switch />
                    </Form.Item>
                    <Form.Item label={t("paymentToDistributorsAsWell")} name="paymentToDistributorsAsWell">
                       <Switch />
                    </Form.Item>
                    <Form.Item label={t("maximumPaymentAmount")} name="maximumPaymentAmount">
                       <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                    </Form.Item>
                    <Form.Item label={t("paymentUponDepositOfXOrMoreTimes")} name="paymentUponDepositOfXOrMoreTimes">
                       <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("episode")}</span>} />
                    </Form.Item>
                    <Form.Item label={t("paymentUponDepositForXDaysOrMore")} name="paymentUponDepositForXDaysOrMore">
                       <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("day")}</span>} />
                    </Form.Item>
                    <div className="text-red-500 bg-red-100 p-4">
                        <span>{t('paybacksArePaidBasedOnTheBettingStatisticsOfMembers,NotTheGeneralAgent,WithinAGivenTimeFrame')}</span>
                        <span>{t('toEliminateOmissionsInPaybackPointPayments,BettingStatisticsAreCalculatedBasedOnTheRegistrationTime,NotTheBettingTimeAsOnOtherPages')}</span>
                    </div>
                </Form>
            </Card>
            <Card
                title="Level1 sudden bonus setting"
                className="max-w-[600px]"
                headStyle={{ backgroundColor: 'black', color: 'white' }}
                actions={
                    [<Button type="default" onClick={() => {}}>{t("applyToAllLevelsAtOnce")}</Button>]
                }
            >
                <Form
                    onFinish={() => {}}
                    labelCol={{ span: 12 }}
                >
                    <Form.Item label={t("restrictionsOnOtherBonusesBesidesSupriseBonuses")} name="restrictionsOnOtherBonusesBesidesSupriseBonuses">
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("restrictionsOnOtherRechargebonusesAfterTheSurpriseBonusIsPaid")} name="restrictionsOnOtherRechargebonusesAfterTheSurpriseBonusIsPaid">
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("surpriseBonusRestrictionsOnFirstDepositOrFirstDeposit")} name="surpriseBonusRestrictionsOnFirstDepositOrFirstDeposit">
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("surpriseBonusRestrictionAfterCashingOutWithinSurpriseBonusTime")} name="surpriseBonusRestrictionAfterCashingOutWithinSurpriseBonusTime">
                        <Switch />
                    </Form.Item>
                    <Button type="primary" onClick={() => {}}>{t("addSurpriseBonus")}</Button>
                    <div>
                        <Table columns={surpriseBonusTableColumns} dataSource={surpriseBonusTableData} />   
                    </div>
                </Form>
            </Card>
            <Card
                className="max-w-[500px] min-w-[500px]"
                headStyle={{ backgroundColor: 'black', color: 'white' }}
                title={t("settingUpLevel1ReferalBenefits")}
                actions={[<Button type="default" onClick={() => {}}>{t("change")}</Button>,
                <Button type="default" onClick={() => {}}>{t("applyToAllLevelsAtOnce")}</Button>]}
            >
                <Form labelCol={{ span: 12 }}>
                    <Form.Item label={t("referralBenefitsMini")} name="referralBenefitsMini">
                        <div className="flex gap-2">
                            <Select options={referralOption} />
                            <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                        </div>
                    </Form.Item>
                    <Form.Item label={t("referralBenefitsVirtual")} name="referralBenefitsVirtual">
                        <div className="flex gap-2">
                            <Select options={referralOption} />
                            <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                        </div>
                    </Form.Item>
                    <Form.Item label={t("referralBenefitsSportsSinglePole")} name="referralBenefitsSportsSinglePole">
                        <div className="flex gap-2">
                            <Select options={referralOption} />
                            <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                        </div>
                    </Form.Item>
                    <Form.Item label={t("referralBenefitsSports2Pole")} name="referralBenefitsSports2Pole">
                        <div className="flex gap-2">
                            <Select options={referralOption} />
                            <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                        </div>
                    </Form.Item>
                    <Form.Item label={t("referralBenefitsSports3Pole")} name="referralBenefitsSports3Pole">
                        <div className="flex gap-2">
                            <Select options={referralOption} />
                            <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                        </div>
                    </Form.Item>
                    <Form.Item label={t("referralBenefitsSports4Pole")} name="referralBenefitsSports4Pole">
                        <div className="flex gap-2">
                            <Select options={referralOption} />
                            <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                        </div>
                    </Form.Item>
                    <div className="text-red-500 bg-red-100 p-4">
                        <span>{t("appliesInComjunctionWithTheSettingsInTheMemberDetailsPopUp")}</span>
                    </div>
                </Form>
            </Card>
            <Card
                className="max-w-[500px] min-w-[500px]"
                headStyle={{ backgroundColor: 'black', color: 'white' }}
                title={t("level1CharginBonusSelectionSetting")}
                actions={[
                <Button type="default" onClick={() => {}}>{t("applyToAllLevelsAtOnce")}</Button>]}
            >
                <Form labelCol={{ span: 12 }}>
                    <Form.Item label={t("useTheRechargeBonousSelection")} name="useTheRechargeBonousSelection">
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("numberOfBonusPaymentTypes")} name="numberOfBonusPaymentTypes">
                        <div className="flex gap-2">
                            <InputNumber min={0}/>
                            <Button type="primary" onClick={() => {}}>{t("change")}</Button>
                        </div>
                    </Form.Item>
                    <div>
                        <Table columns={chargingBonusTableColumns} dataSource={[]} footer={
                            () => {
                                return <div className="flex justify-end w-full">
                                    <InputNumber min={0} className="min-w-[250px]"/>
                                    <Select options={bonusPaymentMethodOptions} className="min-w-[150px]"/>
                                    <Button type="primary" onClick={() => {}}>{t("add")}</Button>
                                </div>
                            }
                        }/>
                    </div>
                    {/* <div className="text-red-500 bg-red-100 p-4">
                        <span>{t("appliesInComjunctionWithTheSettingsInTheMemberDetailsPopUp")}</span>
                    </div> */}
                </Form>
            </Card>
            <Card
                className="max-w-[500px] min-w-[500px]"
                headStyle={{ backgroundColor: 'black', color: 'white' }}
                title={t("chargeBonus1Setting")}
                actions={[
                <Button type="default" onClick={() => {}}>{t("applyToAllLevelsAtOnce")}</Button>]}
            >
                <Form labelCol={{ span: 12 }}>
                    <Form.Item label={t("firstDepositBonusWeekdays")} name="firstDepositBonusWeekdays">
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("firstDepositBonusWeekends")} name="firstDepositBonusWeekends">
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("everyDayBonusWeekday")} name="everyDayBonusWeekday">
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("weekendBonus")} name="weekendBonus">
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("signUpFirstDepositBonus")} name="signUpFirstDepositBonus">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("maximumBonusMoney(1time)")} name="maximumBonusMoney(1time)">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("p")}</span>} />
                    </Form.Item>
                    <Form.Item label={t("maximumBonusMoney(1day)")} name="maximumBonusMoney(1day)">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("p")}</span>} />
                    </Form.Item>
                    <Form.Item label={t("referralBonus")} name="referralBonus">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("depositPlusPriorityApplicationForFirstDepositUponSigningUp")} name="depositPlusPriorityApplicationForFirstDepositUponSigningUp">   
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("depositPlusPriorityApplicationForEachDeposit")} name="depositPlusPriorityApplicationForEachDeposit">   
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("rechargeBonusLimitMaximumAmountOfMoneyHeldPoints")} name="rechargeBonusLimitMaximumAmountOfMoneyHeldPoints">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("won")}</span>} />
                    </Form.Item>
                    <Form.Item label={t("sameDayFirstDepositBonusLimit(AfterWithdrawal)")} name="sameDayFirstDepositBonusLimit(AfterWithdrawal)">   
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("sameDayReplenishmentBonusLimit(AfterWithdrawal)")} name="sameDayReplenishmentBonusLimit(AfterWithdrawal)">   
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("replenishmentBonusLimit(AfterWithdrawal)")} name="replenishmentBonusLimit(AfterWithdrawal)">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("min")}</span>} />
                    </Form.Item>
                    <Form.Item label={t("sameDayRepleishmentBonus%(afterWithdrawal)")} name="sameDayRepleishmentBonus%(afterWithdrawal)">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("restrictionsApplyAfterWithdrawalOfSurpriseBonus")} name="restrictionsApplyAfterWithdrawalOfSurpriseBonus">   
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("maximumNumberOfDailySurpriseBonusPayments")} name="maximumNumberOfDailySurpriseBonusPayments">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>{t("times")}</span>} />
                    </Form.Item>
                    <Form.Item label={t("maximumNumberOfSurpriseBonusPaymentsPerTimePeriod")} name="maximumNumberOfSurpriseBonusPaymentsPerTimePeriod">   
                        <InputNumber min={0} addonAfter={<span style={{ display: 'inline-block', width: '40px', textAlign: 'center' }}>%</span>} />
                    </Form.Item>
                    <Form.Item label={t("changeIndividualGameUsageStatus")} name="changeIndividualGameUsageStatus">   
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t("gameSpecificSettings")} name="gameSpecificSettings">   
                        <Checkbox.Group options={applicabliltyByGameOptions} />
                    </Form.Item>
                </Form>
            </Card>
        </div>
  </Card>;
}
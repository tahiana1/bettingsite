"use client";
import React, { useState } from "react";
import { Button, Input, Layout, message, Select } from "antd";
import { Content } from "antd/lib/layout/layout";
import { ReloadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

// Mock API call function
const mockApiCall = (field: string, value: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${field} updated: ${value}`);
    }, 1000);
  });
};

type UserInfoFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonLabel: string;
  onButtonClick: () => void;
  loading: boolean;
};

type UserInfoFieldStyle1Props = {
  label: string;
  placeholder: string;
  value: string;
};

type UserInfoFieldStyle2Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClickPayment: () => void;
  onButtonClickCollect: () => void;
  loading: boolean;
};

type UserInfoFieldStyle3Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  loading: boolean;
  buttonLabel: string;
};

type GameUsageInfoFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  loading: boolean;
  buttonLabel: string;
}


type SlotcityPriorityUseFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  loading: boolean;
  buttonLabel: string;
}

type UserInfoFieldStyle4Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  loading: boolean;
  buttonLabel: string;
  type: any;
}

type UserInfoFieldStyle5Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  loading: boolean;
  buttonLabel: string;
}

type UserInfoFieldStyle6Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  loading: boolean;
  buttonLabel: string;
  type: any;
}

type UserInfoFieldStyle7Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
  loading: boolean;
  buttonLabel: string;
  type: any;
}

const levelOption = [
    {label: "Level 1", value: "1"},
    {label: "Level 2", value: "2"},
    {label: "Level 3", value: "3"},
    {label: "Level 4", value: "4"},
    {label: "Level 5", value: "5"},
    {label: "Level 6", value: "6"},
    {label: "Level 7", value: "7"},
    {label: "Level 8", value: "8"},
    {label: "Level 9", value: "9"},
    {label: "Level 10", value: "10"},
    {label: "Level 11", value: "11"},
    {label: "Level 12", value: "12"},
    {label: "VIP 1", value: "13"},
    {label: "VIP 2", value: "14"},
    {label: "Premium", value: "15"},
]

const memberType = [
    {label: 'Genearl Member', value: '1'},
    {label: 'Test Member', value: '2'},
    {label: 'Interested Member', value: '3'},
    {label: 'Working Member', value: '4'},
]

const onoffType = [
    {label: 'Off', value: '1'},
    {label: 'On', value: '2'},
]

const currencyRolloverType = [
    {label: 'live', value: '12%'},
    {label: 'slot', value: '10%'},
    {label: "Hold'em", value: '10%'},
    {label: 'mini', value: '10%'},
    {label: 'sports', value: '10%'},
    {label: 'Virtual game', value: '10%'},
    {label: 'Lotus', value: '10%'},
    {label: 'MGM', value: '10%'},
    {label: 'touch', value: '10%'},
]

const rollingPercentyType = [
    {label: 'live', value: '12%'},
    {label: 'slot', value: '10%'},
    {label: "Hold'em", value: '10%'},
    {label: 'Virtual game', value: '10%'},
    {label: 'Lotus hole', value: '10%'},
    {label: 'Lotus Baccara', value: '10%'},
    {label: 'MGM Halljak', value: '10%'},
    {label: 'MGM Baccarat', value: '10%'},
    {label: 'MGM Go-Stop', value: '10%'},
    {label: 'Dice-Green', value: '10%'},
    {label: 'Dice-Red', value: '10%'},
    {label: 'Dice-Blue', value: '10%'},
    {label: 'Touch Game-Card', value: '10%'},
    {label: 'Sports single pole', value: '10%'},
    {label: 'Sports Dupol', value: '10%'},
    {label: 'Sports 3 pole', value: '10%'},
    {label: 'Sports 4 pole', value: '10%'},
    {label: 'Sports 5 pole', value: '10%'},
    {label: 'Sports Dapol', value: '10%'},
]

const gameUsageType = [
  {label: 'live', value: '12%'},
  {label: 'slot', value: '10%'},
  {label: "mini", value: '10%'},
  {label: "Hold'em", value: '10%'},
  {label: 'sports', value: '10%'},
  {label: 'Virtualga', value: '10%'},
  {label: 'Lotus', value: '10%'},
  {label: 'MGM', value: '10%'},
  {label: 'touch', value: '10%'},
]

const gameDetailList = [
  {label: 'Live Game Details', value: '12%'},
  {label: 'Slot Game Details', value: '10%'},
  {label: "Minigame Details", value: '10%'},
  {label: "Sports use Details", value: '10%'},
  {label: "Sports Folder Details", value: '10%'},
]

const slotcityPriorityUseType = [
  {label: 'Not in use', value: false},
  {label: 'In use', value: true},
]

const distributorType = [
  {label: 'member', value: '1'},
  {label: 'distributor', value: '2'}
]

const distributorPropertiesType = [
  {label: 'online distributor', value: '1'},
  {label: 'offline distributor', value: '2'},
]

const cutBettingHistoryType = [
  {label: 'Live', value: '1'},
  {label: 'Slot', value: '2'},
]

const codeSignupAvailableType = [
  {label: 'code signup available', value: '1'},
  {label: 'code registration not possible', value: '2'},
]

const UserInfoField: React.FC<UserInfoFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  buttonLabel,
  onButtonClick,
  loading,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Input placeholder={placeholder} value={value} onChange={onChange} />
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);

const UserInfoStyle1Field: React.FC<UserInfoFieldStyle1Props> = ({
  label,
  placeholder,
  value,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Input readOnly placeholder={placeholder} value={value} />
    </div>
  </div>
);

const UserInfoStyle2Field: React.FC<UserInfoFieldStyle2Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClickPayment,
  onButtonClickCollect,
  loading,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Input type="number" placeholder={placeholder} value={value} onChange={onChange} />
      <Button type="primary" onClick={onButtonClickPayment} loading={loading} disabled={loading}>
        Payment
      </Button>
      <Button type="primary" danger onClick={onButtonClickCollect} loading={loading} disabled={loading}>
        Collect
      </Button>
    </div>
  </div>
);

const UserInfoStyle3Field: React.FC<UserInfoFieldStyle3Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClick,
  loading,
  buttonLabel,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Input type="text" placeholder={placeholder} value={value} onChange={onChange} />
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);

const UserInfoStyle4Field: React.FC<UserInfoFieldStyle4Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClick,
  loading,
  buttonLabel,
  type,
}) => ( 
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Select placeholder={placeholder} options={type} className="w-full"/>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);

const UserInfoStyle6Field: React.FC<UserInfoFieldStyle6Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClick,
  loading,
  buttonLabel,
  type,
}) => ( 
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Select placeholder={placeholder} options={type} className="w-full"/>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        Blank Change
      </Button>
    </div>
  </div>
);

const UserInfoStyle7Field: React.FC<UserInfoFieldStyle7Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClick,
  loading,
  buttonLabel,
  type,
}) => ( 
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <div>
        {
          type?.map((item: any, index: number) => (
            <Button key={index} className="flex flex-col gap-2">
              <div className="text-[10px]">{item.label}</div>
            </Button>
          ))
        }
      </div>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        Blank Change
      </Button>
    </div>
  </div>
);

const UserInfoStyle8Field: React.FC<UserInfoFieldStyle7Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClick,
  loading,
  buttonLabel,
  type,
}) => ( 
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <div className="flex flex-row">
        {
          type?.map((item: any, index: number) => (
            <Input key={index} className="flex flex-col gap-2" />
          ))
        }
      </div>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        Blank Change
      </Button>
    </div>
  </div>
);

const UserInfoStyle5Field: React.FC<UserInfoFieldStyle5Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClick,
  loading,
  buttonLabel,
}) => ( 
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Input type="text" placeholder={placeholder} value={value} onChange={onChange} />
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        Duplicate Check
      </Button>
    </div>
  </div>
);

const SlotcityPriorityUseField: React.FC<SlotcityPriorityUseFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  onButtonClick,
  loading,
  buttonLabel,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Select placeholder={placeholder} options={slotcityPriorityUseType} className="w-full"/>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        Blank Change
      </Button>
    </div>
  </div>
);

const DateInfoField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-column gap-2 justify-start items-center">
      <div className="text-xm w-[150px]">{label}</div>
      <div className="flex flex-row gap-2 w-[250px]">
        <Input type="date" placeholder={placeholder} value={value} onChange={onChange} />
        <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );

  const NumberInfoField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-column gap-2 justify-start items-center">
      <div className="text-xm w-[150px]">{label}</div>
      <div className="flex flex-row gap-2 w-[250px]">
        <Input type="number" placeholder={placeholder} value={value} onChange={onChange} />
        <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );

  const DisabledInfoField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-column gap-2 justify-start items-center">
      <div className="text-xm w-[150px]">{label}</div>
      <div className="flex flex-row gap-2 w-[250px]">
        <Input type="number" readOnly placeholder={placeholder} value={value} onChange={onChange} />
      </div>
    </div>
  );

  const DisabledRollingPercentyInfoField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-row gap-2 justify-start items-center">
        <div className="flex flex-col gap-2 justify-start items-center">
            <div className="text-xm w-[150px]">{label}</div>
        </div>
        
        <div className="flex flex-row justify-between wrap max-w-[250px]" style={{flexWrap: 'wrap'}}>
        {
            rollingPercentyType.map((item, index) => (
               <div className="flex flex-col mb-2 justify-start items-center w-[80px]" key={index}>
                <div className="text-[10px] w-[80px]">{item.label}</div>
                <div className="flex flex-row gap-2 w-full">
                    <Input type="number" readOnly value={item.value} onChange={onChange} />
                </div>
               </div>
            ))  
        }
        </div>
       
    </div>
  );

  const GameUsageInfoField: React.FC<GameUsageInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-row gap-2 justify-start items-center">
        <div className="flex flex-col gap-2 justify-start items-center">
            <div className="text-xm w-[150px]">{label}</div>
        </div>
        
        <div className="flex flex-row justify-start wrap max-w-[250px]" style={{flexWrap: 'wrap'}}>
        {
            gameUsageType.map((item, index) => (
               <div className="flex flex-col mb-2 justify-start items-center" key={index}>
                {/* <div className="text-[10px] w-[80px]">{item.label}</div> */}
                <div className="flex flex-row w-full">
                   <Button type="primary">{item.label}</Button>
                </div>
               
               </div>
            ))  
        }
        <div className="flex gap-2 mb-3 justify-start w-full">
          <Button>apply</Button>
          <Button>Apply all sub-includes</Button>
        </div>
        <div className="flex gap-3" style={{flexWrap:'wrap'}}>
          {
            gameDetailList.map((item, index) => (
                <Button className="px-3 py-2 " key={index}>
                  <div className="text-[10px]">{item.label}</div>
                </Button>
            ))  
          }
        </div>
        
        </div>
       
    </div>
  );

  const DisabledCurrencyInfoField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-row gap-2 justify-start items-center">
        <div className="flex flex-col gap-2 justify-start items-center">
            <div className="text-xm w-[150px]">{label}</div>
            <div className="flex flex-row gap-2 w-[150px]">
                <Button type="primary">
                    <ReloadOutlined /> 
                </Button>
            </div>
        </div>
        
        <div className="flex flex-row justify-between wrap max-w-[250px]" style={{flexWrap: 'wrap'}}>
        {
            currencyRolloverType.map((item, index) => (
               <div className="flex flex-col mb-2 justify-start items-center w-[60px]" key={index}>
                <div className="text-[10px] w-[60px]">{item.label}</div>
                <div className="flex flex-row gap-2 w-full">
                    <Input type="number" readOnly value={item.value} onChange={onChange} />
                </div>
               </div>
            ))  
        }
        </div>
       
    </div>
  );

  const LevelInfoField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-column gap-2 justify-start items-center">
      <div className="text-xm w-[150px]">{label}</div>
      <div className="flex flex-row gap-2 w-[250px]">
        <Select placeholder={placeholder} onChange={onChange} options={levelOption} className="w-full"/>
        <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );

    const OnOffTypeField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
    }) => (
        <div className="flex flex-column gap-2 justify-start items-center">
            <div className="text-xm w-[150px]">{label}</div>
            <div className="flex flex-row gap-2 w-[250px]">
            <Select placeholder={placeholder} onChange={onChange} options={onoffType} className="w-full"/>
            <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
                {buttonLabel}
            </Button>
            </div>
        </div>
    );

  const MemberTypeField: React.FC<UserInfoFieldProps> = ({
    label,
    placeholder,
    value,
    onChange,
    buttonLabel,
    onButtonClick,
    loading,
  }) => (
    <div className="flex flex-column gap-2 justify-start items-center">
      <div className="text-xm w-[150px]">{label}</div>
      <div className="flex flex-row gap-2 w-[250px]">
        <Select placeholder={placeholder} onChange={onChange} options={memberType} className="w-full"/>
        <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );

const ColorTypeField: React.FC<UserInfoFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  buttonLabel,
  onButtonClick,
  loading,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Input type="color" placeholder={placeholder} onChange={onChange} value={value} className="w-full"/>
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);

const MemoInputFiled: React.FC<UserInfoFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  buttonLabel,
  onButtonClick,
  loading,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[500px]">
      <Input type="text" placeholder={placeholder} onChange={onChange} value={value} className="w-full"/>
      <Button type="primary" onClick={onButtonClick} loading={loading} className="min-w-[150px]" disabled={loading}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);

const MemoInput1Filed: React.FC<UserInfoFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  buttonLabel,
  onButtonClick,
  loading,
}) => (
  <div className="flex flex-column gap-2 justify-start items-center">
    <div className="text-xm w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[500px]">
      <TextArea rows={4} placeholder={placeholder} value={value} className="w-ful l "/>
      <Button type="primary" onClick={onButtonClick} loading={loading} className="min-w-[150px]" disabled={loading}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);


const UserBasicInformation: React.FC = () => {
  const [fields, setFields] = useState({
    id: "",
    nickname: "",
    password: "",
    exchangePassword: "",
    allas: "",
    depositor: "",
    bankName: "",
    accountnumber: "",
    cellphonecarrier: "",
    cellphone: "",
    birthday: "",
    affiliation: "",
    topDistributor: "",
    recommender: "",
    level: "",
    memberType: "",
    color: "",
    onoff: "",
    accountblock: "",
    residentNumber: "",
    useUSDT: "",
    walletAddress: "",
    lastDeposit: "",
    currencyExchangeRolling: "",
    currencyExchnageRollingBonus: "",
    exchangeRollingBettingAmount: "",
    currencyRollover: "",
    amountHold: "",
    amountHoldPayment: "",
    amountHoldCollect: "",
    coupon: "",
    couponProcessing: "",
    totalLoss: "",
    totalLossProcessing: "",
    rollingGold: "",
    rollingGoldProcessing: "",
    sameIPCheck: "",
    rollingPercenty: "",
    slotcityPriorityUse: "",
    webLoginAvailable: "",
    changeOfDistributorProperties: "",
    delegationOfAdminstrator: "",
    signUpCode: "",
    codeSignupAvailable: "",
    displayMemberCode: "",
    initialLevelOfAcquaintanceRegistration: "",
    memberPageAlarmSound: "",
    useAttendanceCheck: "",
    useRoulette: "",
    customerCenterInquiryAvailable: "",
    createPost: "",
    whiteCommentOnPost: "",
    pointsAwardedForThePost: "",
    usingVirtualAccountApi: "",
    usingOfWinningPoints: "",
    usePaybackPayment: "",
    useRefundLimit: "",
    dailyFirstDepositBonusLimit: "",
    signUpFirstDepositBonusLimit: "",
    replenishmentBonusLimit: "",
    surpriseBonusLimit: "",
    ignoreOption: "",
    rollingConversionAutomaticApproval: "",
    cutBettingHistory: "",
    maximumAmountOfBettingHistoryReduction: "",
    percentageReductionInBettingAmount: "",
    waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted: "",
    waitingTimeForReApplicationAfterChargingIsCompleted: "",
    waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted: "",
    changeMemberProperties: "",
    distributor: "",
    changeOfMemberProperties: "",
    displayOfAdministrator: "",
    partnerButtonDisplay: "",
    partnerMultiAccessPossible: "",
    displayPartnerReductionDetail: "",
    displayPartnerRollingPaymentRecoveryHistory: "",
    createSubDistributor: "",
    createSubordinatorDirectMember: "",
    accessToSubDetails: "",
    accessToSubBankInformation: "",
    lowerConnectionCanBeKicked: "",
    subMoneyPayable: "",
    lowerMoneyRecoveryPossible: "",
    lowerLosingChangePossible: "",
    lowerRollingChangeable: "",
    referalBenefitsMember: "",
    referalBenefitsMini: "",
    referalBenefitsVirtual: "",
    referalBenefitsSportsSinglePoles: "",
    referalBenefitsSports2Poles: "",
    referalBenefitsSports3Poles: "",
    referalBenefitsSports4Poles: "",
    referalBenefitsSportsDapol: "",
    sportsBettingAllowed: "",
    minimumFolderForSportsBetting: "",
    accountMemo: "",
    adminNote: "",
    adminMemo2: "",
    xxx: "",
  });

  const [loading, setLoading] = useState({
    id: false,
    nickname: false,
    password: false,
    exchangePassword: false,
    allas: false,
    depositor: false,
    bankName: false,
    accountnumber: false,
    cellphonecarrier: false,
    cellphone: false,
    birthday: false,
    affiliation: false,
    topDistributor: false,
    recommender: false,
    level: false,
    memberType: false,
    color: false,
    onoff: false,
    accountblock: false,
    residentNumber: false,
    useUSDT: false,
    walletAddress: false,
    lastDeposit: false,
    currencyExchangeRolling: false,
    currencyExchnageRollingBonus: false,
    exchangeRollingBettingAmount : false,
    currencyRollover: false,
    amountHold: false,
    amountHoldPayment: false,
    amountHoldCollect: false,
    coupon: false,
    couponProcessing: false,
    totalLoss: false,
    totalLossProcessing: false,
    rollingGold: false,
    rollingGoldProcessing: false,
    sameIPCheck: false,
    rollingPercenty: false,
    slotcityPriorityUse: false,
    webLoginAvailable: false,
    changeOfDistributorProperties: false,
    delegationOfAdminstrator: false,
    signUpCode: false,
    codeSignupAvailable: false,
    displayMemberCode: false,
    initialLevelOfAcquaintanceRegistration: false,
    memberPageAlarmSound: false,
    useAttendanceCheck: false,
    useRoulette: false,
    customerCenterInquiryAvailable: false,
    createPost: false,
    whiteCommentOnPost: false,
    pointsAwardedForThePost: false,
    usingVirtualAccountApi: false,
    usePaybackPayment: false,
    useRefundLimit: false,
    usingOfWinningPoints: false,
    dailyFirstDepositBonusLimit: false,
    signUpFirstDepositBonusLimit: false,
    replenishmentBonusLimit: false,
    surpriseBonusLimit: false,
    ignoreOption: false,
    rollingConversionAutomaticApproval: false,
    cutBettingHistory: false,
    maximumAmountOfBettingHistoryReduction: false,
    percentageReductionInBettingAmount: false,
    waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted: false,
    waitingTimeForReApplicationAfterChargingIsCompleted: false,
    waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted: false,
    changeMemberProperties: false,
    distributor: false,
    changeOfMemberProperties: false,
    displayOfAdministrator: false,
    partnerButtonDisplay: false,
    partnerMultiAccessPossible: false,
    displayPartnerReductionDetail: false,
    displayPartnerRollingPaymentRecoveryHistory: false,
    createSubDistributor: false,
    createSubordinatorDirectMember: false,
    accessToSubDetails: false,
    accessToSubBankInformation: false,
    lowerConnectionCanBeKicked: false,
    subMoneyPayable: false,
    lowerMoneyRecoveryPossible: false,
    lowerLosingChangePossible: false,
    lowerRollingChangeable: false,
    referalBenefitsMember: false,
    referalBenefitsMini: false,
    referalBenefitsVirtual: false,
    referalBenefitsSportsSinglePoles: false,
    referalBenefitsSports2Poles: false,
    referalBenefitsSports3Poles: false,
    referalBenefitsSports4Poles: false,
    referalBenefitsSportsDapol: false,
    sportsBettingAllowed: false,
    minimumFolderForSportsBetting: false,
    accountMemo: false,
    adminNote: false,
    adminMemo2: false,
    xxx: false,
  });

  const handleChange = (field: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleButtonClick = (field: keyof typeof fields) => async () => {
    setLoading((prev) => ({ ...prev, [field]: true }));
    console.log(field, fields[field]);
    // try {
    //   // Replace mockApiCall with your real API call
    //   await mockApiCall(field, fields[field]);
    //   message.success(`${field} updated: ${fields[field]}`);
    // } catch (error) {
    //   message.error(`Failed to update ${field}`);
    // } finally {
    //   setLoading((prev) => ({ ...prev, [field]: false }));
    // }
  };

  return (
    <div className="max-h-[90vh] overflow-auto">
      <div className="bg-white">
        <div className="flex flex-column gap-4">
          <div className="flex flex-col gap-2 text-xm">Deposit</div>
          <div className="flex flex-col gap-2 text-xm text-[#71cb4a]">
            506,000
          </div>
          <div className="flex flex-col gap-2 text-xm justify-center items-center">
            -
          </div>
          <div className="flex flex-col gap-2 text-xm">Withdrawal</div>
          <div className="flex flex-col gap-2 text-xm text-[#71cb4a]">
            0
          </div>
          <div className="flex flex-col gap-2 text-xm">=</div>
          <div className="flex flex-col gap-2 text-xm text-[red]">
            506,000
          </div>
        </div>
        <div className="flex gap-20">
          <div className="flex flex-col gap-4 mt-10">
            <UserInfoField
              label="id"
              placeholder="id"
              value={fields.id}
              onChange={handleChange("id")}
              buttonLabel="Black Registration"
              onButtonClick={handleButtonClick("id")}
              loading={loading.id}
            />
            <UserInfoField
              label="nickname"
              placeholder="Nickname"
              value={fields.nickname}
              onChange={handleChange("nickname")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("nickname")}
              loading={loading.nickname}
            />
            <UserInfoField
              label="password"
              placeholder="Password"
              value={fields.password}
              onChange={handleChange("password")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("password")}
              loading={loading.password}
            />
            <UserInfoField
              label="exchange password"
              placeholder="Exchange Password"
              value={fields.exchangePassword}
              onChange={handleChange("exchangePassword")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("exchangePassword")}
              loading={loading.exchangePassword}
            />
            <UserInfoField
              label="allas"
              placeholder="Allas"
              value={fields.allas}
              onChange={handleChange("allas")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("allas")}
              loading={loading.allas}
            />
            <UserInfoField
              label="depositor"
              placeholder="depositor"
              value={fields.depositor}
              onChange={handleChange("depositor")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("depositor")}
              loading={loading.depositor}
            />
            <UserInfoField
              label="bankName"
              placeholder="bankName"
              value={fields.bankName}
              onChange={handleChange("bankName")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("bankName")}
              loading={loading.bankName}
            />
            <UserInfoField
              label="accountnumber"
              placeholder="accountnumber"
              value={fields.accountnumber}
              onChange={handleChange("accountnumber")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("accountnumber")}
              loading={loading.accountnumber}
            />
            <UserInfoField
              label="cellphonecarrier"
              placeholder="cellphonecarrier"
              value={fields.cellphonecarrier}
              onChange={handleChange("cellphonecarrier")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("cellphonecarrier")}
              loading={loading.cellphonecarrier}
            />
            <UserInfoField
              label="cellphone"
              placeholder="cellphone"
              value={fields.cellphone}
              onChange={handleChange("cellphone")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("cellphone")}
              loading={loading.cellphone}
            />

            <DateInfoField 
              label="birthday"
              placeholder="birthday"
              value={fields.cellphone}
              onChange={handleChange("birthday")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("birthday")}
              loading={loading.birthday}
            />

              <UserInfoField
                  label="affiliation"
                  placeholder="affiliation"
                  value={fields.affiliation}
                  onChange={handleChange("affiliation")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("affiliation")}
                  loading={loading.affiliation}
              />

              <DisabledInfoField
                  label="topDistributor"
                  placeholder="topDistributor"
                  value={fields.topDistributor}
                  onChange={handleChange("topDistributor")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("topDistributor")}
                  loading={loading.topDistributor}
              />

              <UserInfoField 
                  label="Resident registration number"
                  placeholder=""
                  value={fields.residentNumber}
                  onChange={handleChange("residentNumber")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("residentNumber")}
                  loading={loading.residentNumber}
              />

              <LevelInfoField
                  label="level"
                  placeholder="level"
                  value={fields.level}
                  onChange={handleChange("level")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("level")}
                  loading={loading.level}
              />

              <MemberTypeField
                  label="memberType"
                  placeholder="memberType"
                  value={fields.memberType}
                  onChange={handleChange("memberType")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("memberType")}
                  loading={loading.memberType}
              />

              <ColorTypeField
                  label="color"
                  placeholder="color"
                  value={fields.color}
                  onChange={handleChange("color")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("color")}
                  loading={loading.color}
              />

              <OnOffTypeField
                  label="Account Block"
                  placeholder="ON/OFF"
                  value={fields.onoff}
                  onChange={handleChange("onoff")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("onoff")}
                  loading={loading.onoff}
              />

              <UserInfoField
                  label="Resident registration number"
                  placeholder=""
                  value={fields.residentNumber}
                  onChange={handleChange("residentNumber")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("residentNumber")}
                  loading={loading.residentNumber}
              />

              <OnOffTypeField
                  label="Use USDT"
                  placeholder=""
                  value={fields.useUSDT}
                  onChange={handleChange("useUSDT")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("useUSDT")}
                  loading={loading.useUSDT}
              /> 

              <UserInfoField
                  label="Wallet Address"
                  placeholder=""
                  value={fields.walletAddress}
                  onChange={handleChange("walletAddress")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("walletAddress")}
                  loading={loading.walletAddress}
              />

              <DisabledInfoField
                  label="Last Deposit for currency exchange rolling"
                  placeholder=""
                  value={fields.lastDeposit}
                  onChange={handleChange("lastDeposit")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("lastDeposit")}
                  loading={loading.lastDeposit}
              />

              <DisabledInfoField
                  label="Currency exchange rolling"
                  placeholder=""
                  value={fields.currencyExchangeRolling}
                  onChange={handleChange("currencyExchangeRolling")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("currencyExchangeRolling")}
                  loading={loading.currencyExchangeRolling}
              />

              <DisabledInfoField
                  label="Currency exchange rolling bonus"
                  placeholder=""  
                  value={fields.currencyExchnageRollingBonus}
                  onChange={handleChange("currencyExchnageRollingBonus")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("currencyExchnageRollingBonus")}
                  loading={loading.currencyExchnageRollingBonus}
              />  

              <DisabledInfoField
                  label="Exchange rolling betting amount"
                  placeholder=""
                  value={fields.exchangeRollingBettingAmount}
                  onChange={handleChange("exchangeRollingBettingAmount")}
                  buttonLabel="Change"
                  onButtonClick={handleButtonClick("exchangeRollingBettingAmount")}
                  loading={loading.exchangeRollingBettingAmount}
              />

            <DisabledCurrencyInfoField
                label="Currency Rollover"   
                placeholder=""  
                value={fields.currencyRollover}
                onChange={handleChange("currencyRollover")}
                buttonLabel="Change"
                onButtonClick={handleButtonClick("currencyRollover")}
                loading={loading.currencyRollover}
            />  
          </div>
          <div className="flex flex-col gap-4 mt-10">
            <UserInfoStyle1Field
              label="Amount Hold"
              placeholder="Amount Hold"
              value={"1000000"}
            />
            <UserInfoStyle2Field
              label="Handing of balance"
              placeholder="Handing of balance"
              value={""}
              onChange={handleChange("amountHold")}
              onButtonClickPayment={handleButtonClick("amountHold")}
              onButtonClickCollect={handleButtonClick("amountHold")}
              loading={loading.amountHold}
            />
            <UserInfoStyle1Field
              label="Coupon (quantity)"
              placeholder="Coupon (quantity)"
              value={"1000000"}
            />
            <UserInfoStyle2Field
              label="Coupon processing"
              placeholder="Coupon processing"
              value={""}
              onChange={handleChange("amountHold")}
              onButtonClickPayment={handleButtonClick("amountHold")}
              onButtonClickCollect={handleButtonClick("amountHold")}
              loading={loading.amountHold}
            />
            <UserInfoStyle1Field
              label="Total loss"
              placeholder="Total loss"
              value={"1000000"}
            />
            <UserInfoStyle2Field
              label="Total loss processing"
              placeholder="Total loss processing"
              value={""}
              onChange={handleChange("amountHold")}
              onButtonClickPayment={handleButtonClick("amountHold")}
              onButtonClickCollect={handleButtonClick("amountHold")}
              loading={loading.amountHold}
            />
             <UserInfoStyle1Field
              label="Rolling gold"
              placeholder="Rolling gold"
              value={"1000000"}
            />
            <UserInfoStyle2Field
              label="Rolling gold processing"
              placeholder="Rolling gold processing"
              value={""}
              onChange={handleChange("amountHold")}
              onButtonClickPayment={handleButtonClick("amountHold")}
              onButtonClickCollect={handleButtonClick("amountHold")}
              loading={loading.amountHold}
            />
            <UserInfoStyle1Field
              label="Sign up path"
              placeholder="Sign up path"
              value={""}
            />
            <UserInfoStyle1Field
              label="Subscribed domain"
              placeholder="Subscribed domain"
              value={""}
            />
            <UserInfoStyle1Field
              label="Date of registered"
              placeholder="Date of registered"
              value={""}
            />
            <UserInfoStyle3Field
              label="Same IP Check"
              placeholder="Same IP Check"
              value={""}
              buttonLabel="Same IP Check"
              onChange={handleChange("sameIPCheck")}
              onButtonClick={handleButtonClick("sameIPCheck")}
              loading={loading.sameIPCheck}
            />
            <UserInfoStyle1Field
              label="Frequently used games"
              placeholder="Frequently used game"
              value={""}
            />
             <UserInfoStyle1Field
              label="Most recent IP"
              placeholder="Most recent IP"
              value={""}
            />
            <UserInfoStyle3Field
              label="Recently connected device"
              placeholder="Recently connected device"
              value={""}
              buttonLabel="Expulsion"
              onChange={handleChange("sameIPCheck")}
              onButtonClick={handleButtonClick("sameIPCheck")}
              loading={loading.sameIPCheck}
            />
            <DisabledRollingPercentyInfoField
              label="Rolling%"   
              placeholder=""  
              value={fields.rollingPercenty}
              onChange={handleChange("rollingPercenty")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("rollingPercenty")}
              loading={loading.rollingPercenty}
            />  
            <GameUsageInfoField
              label="Game usage"   
              placeholder=""  
              value={fields.rollingPercenty}
              onChange={handleChange("rollingPercenty")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("rollingPercenty")}
              loading={loading.rollingPercenty}
            />  
            <SlotcityPriorityUseField
              label="Slotcity Priority Use"   
              placeholder=""  
              value={fields.slotcityPriorityUse}
              onChange={handleChange("slotcityPriorityUse")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("slotcityPriorityUse")}
              loading={loading.slotcityPriorityUse}
            />  
          </div>
          <div className="flex flex-col gap-4 mt-10">
            <UserInfoStyle4Field
              label="Web login available"   
              placeholder=""  
              type={distributorType}
              value={fields.webLoginAvailable}
              onChange={handleChange("webLoginAvailable")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("webLoginAvailable")}
              loading={loading.webLoginAvailable}
            />
            <UserInfoStyle5Field
              label="Sign up code"   
              placeholder="" 
              value={fields.signUpCode}
              onChange={handleChange("signUpCode")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("signUpCode")}
              loading={loading.signUpCode}
            />
            <UserInfoStyle4Field
              label="Code signup available"   
              placeholder=""  
              type={codeSignupAvailableType}
              value={fields.codeSignupAvailable}
              onChange={handleChange("codeSignupAvailable")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("codeSignupAvailable")}
              loading={loading.codeSignupAvailable}
            />  
            <UserInfoStyle4Field
              label="Display member code"   
              placeholder=""  
              type={onoffType}
              value={fields.displayMemberCode}
              onChange={handleChange("displayMemberCode")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("displayMemberCode")}
              loading={loading.displayMemberCode}
            />  
            <UserInfoStyle6Field
              label="Initial level of acquaintance registration"   
              placeholder=""  
              type={levelOption}
              value={fields.initialLevelOfAcquaintanceRegistration}
              onChange={handleChange("initialLevelOfAcquaintanceRegistration")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("initialLevelOfAcquaintanceRegistration")}
              loading={loading.initialLevelOfAcquaintanceRegistration}
            />
            <UserInfoStyle6Field
              label="Member page alarm sound"   
              placeholder=""  
              type={onoffType}
              value={fields.memberPageAlarmSound}
              onChange={handleChange("memberPageAlarmSound")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("memberPageAlarmSound")}
              loading={loading.memberPageAlarmSound}
            />
            <UserInfoStyle4Field
              label="Use attendance check"   
              placeholder=""  
              type={onoffType}
              value={fields.useAttendanceCheck}
              onChange={handleChange("useAttendanceCheck")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("useAttendanceCheck")}
              loading={loading.useAttendanceCheck}
            />  
            <UserInfoStyle4Field
              label="Use the roulette"   
              placeholder=""  
              type={onoffType}
              value={fields.useRoulette}
              onChange={handleChange("useRoulette")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("useRoulette")}
              loading={loading.useRoulette}
            />  
            <UserInfoStyle4Field
              label="Customer center inquiry available"   
              placeholder=""  
              type={onoffType}
              value={fields.customerCenterInquiryAvailable}
              onChange={handleChange("customerCenterInquiryAvailable")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("customerCenterInquiryAvailable")}
              loading={loading.customerCenterInquiryAvailable}
            />  
            <UserInfoStyle4Field
              label="Create post"   
              placeholder=""  
              type={onoffType}
              value={fields.createPost}
              onChange={handleChange("createPost")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("createPost")}
              loading={loading.createPost}
            />  
            <UserInfoStyle4Field
              label="White a comment on the post"   
              placeholder=""  
              type={onoffType}
              value={fields.whiteCommentOnPost}
              onChange={handleChange("whiteCommentOnPost")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("whiteCommentOnPost")}
              loading={loading.whiteCommentOnPost}
            />  
            <UserInfoStyle4Field
              label="Points awarded for the post"   
              placeholder=""  
              type={onoffType}
              value={fields.pointsAwardedForThePost}
              onChange={handleChange("pointsAwardedForThePost")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("pointsAwardedForThePost")}
              loading={loading.pointsAwardedForThePost}
            />  
            <UserInfoStyle6Field
              label="Using virtualAccount api"   
              placeholder=""  
              type={onoffType}
              value={fields.usingVirtualAccountApi}
              onChange={handleChange("usingVirtualAccountApi")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("usingVirtualAccountApi")}
              loading={loading.usingVirtualAccountApi}
            /> 
            <UserInfoStyle6Field
              label="Using of winning points"   
              placeholder=""  
              type={onoffType}
              value={fields.usingOfWinningPoints}
              onChange={handleChange("usingOfWinningPoints")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("usingOfWinningPoints")}
              loading={loading.usingOfWinningPoints}
            />  
            <UserInfoStyle6Field
              label="Use payback payment"   
              placeholder=""  
              type={onoffType}
              value={fields.usePaybackPayment}
              onChange={handleChange("usePaybackPayment")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("usePaybackPayment")}
              loading={loading.usePaybackPayment}
            />  
            <UserInfoStyle6Field
              label="Use the refund limit"   
              placeholder=""  
              type={onoffType}
              value={fields.useRefundLimit}
              onChange={handleChange("useRefundLimit")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("useRefundLimit")}
              loading={loading.useRefundLimit}
            />  
            <UserInfoStyle4Field
              label="Daily first deposit bonus limit"   
              placeholder=""  
              type={onoffType}
              value={fields.dailyFirstDepositBonusLimit}
              onChange={handleChange("dailyFirstDepositBonusLimit")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("dailyFirstDepositBonusLimit")}
              loading={loading.dailyFirstDepositBonusLimit}
            />  
            <UserInfoStyle4Field
              label="SignUp first deposit bonus limit"   
              placeholder=""  
              type={onoffType}
              value={fields.signUpFirstDepositBonusLimit}
              onChange={handleChange("signUpFirstDepositBonusLimit")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("signUpFirstDepositBonusLimit")}
              loading={loading.signUpFirstDepositBonusLimit}
            />  
            <UserInfoStyle4Field
              label="Replenishment Bonus Limit"   
              placeholder=""  
              type={onoffType}
              value={fields.replenishmentBonusLimit}
              onChange={handleChange("replenishmentBonusLimit")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("replenishmentBonusLimit")}
              loading={loading.replenishmentBonusLimit}
            />
            <UserInfoStyle4Field
              label="Surprise Bonus Limit"   
              placeholder=""  
              type={onoffType}
              value={fields.surpriseBonusLimit}
              onChange={handleChange("surpriseBonusLimit")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("surpriseBonusLimit")}
              loading={loading.surpriseBonusLimit}
            />  
            <UserInfoStyle4Field
              label="[Apply rolling to members only] Ignore option"   
              placeholder=""  
              type={onoffType}
              value={fields.ignoreOption}
              onChange={handleChange("ignoreOption")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("ignoreOption")}
              loading={loading.ignoreOption}
            />  
            <UserInfoStyle6Field
              label="Rolling conversion automatic approval"   
              placeholder=""  
              type={onoffType}
              value={fields.rollingConversionAutomaticApproval}
              onChange={handleChange("rollingConversionAutomaticApproval")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("rollingConversionAutomaticApproval")}
              loading={loading.rollingConversionAutomaticApproval}
            />  
            <UserInfoStyle7Field
              label="Cut betting history"   
              placeholder=""  
              type={cutBettingHistoryType}
              value={fields.cutBettingHistory}
              onChange={handleChange("cutBettingHistory")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("cutBettingHistory")}
              loading={loading.cutBettingHistory}
            />  
            <UserInfoStyle8Field
              label="Cut betting history"   
              placeholder=""  
              type={cutBettingHistoryType}
              value={fields.cutBettingHistory}
              onChange={handleChange("cutBettingHistory")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("cutBettingHistory")}
              loading={loading.cutBettingHistory}
            />  
            <UserInfoStyle8Field
              label="Maximum amount of betting history reduction"   
              placeholder=""  
              type={cutBettingHistoryType}
              value={fields.maximumAmountOfBettingHistoryReduction}
              onChange={handleChange("maximumAmountOfBettingHistoryReduction")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("maximumAmountOfBettingHistoryReduction")}
              loading={loading.maximumAmountOfBettingHistoryReduction}
            /> 
            <UserInfoStyle8Field
              label="% reduction in betting amount"   
              placeholder=""  
              type={cutBettingHistoryType}
              value={fields.percentageReductionInBettingAmount}
              onChange={handleChange("percentageReductionInBettingAmount")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("percentageReductionInBettingAmount")}
              loading={loading.percentageReductionInBettingAmount}
            /> 
            <UserInfoStyle4Field
              label="Waiting time for re-application after currency exchange is completed"   
              placeholder=""  
              type={onoffType}
              value={fields.waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted}
              onChange={handleChange("waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted")}
              loading={loading.waitingTimeForReApplicationAfterCurrencyExchangeIsCompleted}
            />
            <UserInfoStyle4Field
              label="Waiting time for re-application after charging is completed"   
              placeholder=""  
              type={onoffType}
              value={fields.waitingTimeForReApplicationAfterChargingIsCompleted}
              onChange={handleChange("waitingTimeForReApplicationAfterChargingIsCompleted")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("waitingTimeForReApplicationAfterChargingIsCompleted")}
              loading={loading.waitingTimeForReApplicationAfterChargingIsCompleted}
            />
            <UserInfoStyle4Field
              label="Waiting time for currency exchange request after charging is completed"   
              placeholder=""  
              type={onoffType}
              value={fields.waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted}
              onChange={handleChange("waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted")}
              loading={loading.waitingTimeForCurrencyExchangeRequestAfterChargingIsCompleted}
            />  
            <UserInfoStyle4Field
              label="Change member properties"   
              placeholder=""  
              type={onoffType}
              value={fields.changeMemberProperties}
              onChange={handleChange("changeMemberProperties")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("changeMemberProperties")}
              loading={loading.changeMemberProperties}
            />  
            
          </div>
          <div className="flex flex-col gap-4 mt-10">
            <UserInfoStyle4Field
              label="Change of member properties"   
              placeholder=""  
              type={onoffType}
              value={fields.changeOfMemberProperties}
              onChange={handleChange("changeOfMemberProperties")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("changeOfMemberProperties")}
              loading={loading.changeOfMemberProperties}
            />  
            <UserInfoStyle4Field
              label="Change of distributor properties"   
              placeholder=""  
              type={onoffType}
              value={fields.changeOfDistributorProperties}
              onChange={handleChange("changeOfDistributorProperties")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("changeOfDistributorProperties")}
              loading={loading.changeOfDistributorProperties}
            />  
            <UserInfoStyle4Field
              label="Delegation of Adminstrator"   
              placeholder=""  
              type={onoffType}
              value={fields.delegationOfAdminstrator}
              onChange={handleChange("delegationOfAdminstrator")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("delegationOfAdminstrator")}
              loading={loading.delegationOfAdminstrator}
            /> 
            <UserInfoStyle4Field
              label="Display of Administrator"   
              placeholder=""  
              type={onoffType}
              value={fields.displayOfAdministrator}
              onChange={handleChange("displayOfAdministrator")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("displayOfAdministrator")}
              loading={loading.displayOfAdministrator}
            />
            <UserInfoStyle4Field
              label="Partner button display"   
              placeholder=""  
              type={onoffType}
              value={fields.partnerButtonDisplay}
              onChange={handleChange("partnerButtonDisplay")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("partnerButtonDisplay")}
              loading={loading.partnerButtonDisplay}
            /> 
            <UserInfoStyle4Field
              label="Partner multi-access possible"   
              placeholder=""  
              type={onoffType}
              value={fields.partnerMultiAccessPossible}
              onChange={handleChange("partnerMultiAccessPossible")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("partnerMultiAccessPossible")}
              loading={loading.partnerMultiAccessPossible}
            /> 
            <UserInfoStyle4Field
              label="Display partner reduction details"   
              placeholder=""  
              type={onoffType}
              value={fields.displayPartnerReductionDetail}
              onChange={handleChange("displayPartnerReductionDetail")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("displayPartnerReductionDetail")}
              loading={loading.displayPartnerReductionDetail}
            /> 
            <UserInfoStyle4Field
              label="Display of Partner Rolling Payment/Recovery History"   
              placeholder=""  
              type={onoffType}
              value={fields.displayPartnerRollingPaymentRecoveryHistory}
              onChange={handleChange("displayPartnerRollingPaymentRecoveryHistory")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("displayPartnerRollingPaymentRecoveryHistory")}
              loading={loading.displayPartnerRollingPaymentRecoveryHistory}
            /> 
            <UserInfoStyle6Field
              label="Create a sub-distributor"   
              placeholder=""  
              type={onoffType}
              value={fields.createSubDistributor}
              onChange={handleChange("createSubDistributor")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("createSubDistributor")}
              loading={loading.createSubDistributor}
            /> 
            <UserInfoStyle6Field
              label="Create a subordinator direct member"   
              placeholder=""  
              type={onoffType}
              value={fields.createSubordinatorDirectMember}
              onChange={handleChange("createSubordinatorDirectMember")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("createSubordinatorDirectMember")}
              loading={loading.createSubordinatorDirectMember}
            /> 
            <UserInfoStyle6Field
              label="Access to sub-details"   
              placeholder=""  
              type={onoffType}
              value={fields.accessToSubDetails}
              onChange={handleChange("accessToSubDetails")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("accessToSubDetails")}
              loading={loading.accessToSubDetails}
            /> 
            <UserInfoStyle6Field
              label="Access to sub-bank information"   
              placeholder=""  
              type={onoffType}
              value={fields.accessToSubBankInformation}
              onChange={handleChange("accessToSubBankInformation")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("accessToSubBankInformation")}
              loading={loading.accessToSubBankInformation}
            />
            <UserInfoStyle6Field
              label="Lower connection can be kicked"   
              placeholder=""  
              type={onoffType}
              value={fields.lowerConnectionCanBeKicked}
              onChange={handleChange("lowerConnectionCanBeKicked")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("lowerConnectionCanBeKicked")}
              loading={loading.lowerConnectionCanBeKicked}
            />
            <UserInfoStyle6Field
              label="Sub-money payable"   
              placeholder=""  
              type={onoffType}
              value={fields.subMoneyPayable}
              onChange={handleChange("subMoneyPayable")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("subMoneyPayable")}
              loading={loading.subMoneyPayable}
            />
            <UserInfoStyle6Field
              label="Lower money recovery possible"   
              placeholder=""  
              type={onoffType}
              value={fields.lowerMoneyRecoveryPossible}
              onChange={handleChange("lowerMoneyRecoveryPossible")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("lowerMoneyRecoveryPossible")}
              loading={loading.lowerMoneyRecoveryPossible}
            />
            <UserInfoStyle6Field
              label="Lower losing change possible"   
              placeholder=""  
              type={onoffType}
              value={fields.lowerLosingChangePossible}
              onChange={handleChange("lowerLosingChangePossible")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("lowerLosingChangePossible")}
              loading={loading.lowerLosingChangePossible}
            />
            <UserInfoStyle6Field
              label="Lower rolling changeable"   
              placeholder=""  
              type={onoffType}
              value={fields.lowerRollingChangeable}
              onChange={handleChange("lowerRollingChangeable")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("lowerRollingChangeable")}
              loading={loading.lowerRollingChangeable}
            />
            <UserInfoStyle6Field
              label="Referal Benefits (Mini)"   
              placeholder=""  
              type={onoffType}
              value={fields.referalBenefitsMini}
              onChange={handleChange("referalBenefitsMini")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("referalBenefitsMini")}
              loading={loading.referalBenefitsMini}
            />
            <UserInfoStyle6Field
              label="Referal Benefits (Virtual)"   
              placeholder=""  
              type={onoffType}
              value={fields.referalBenefitsVirtual}
              onChange={handleChange("referalBenefitsVirtual")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("referalBenefitsVirtual")}
              loading={loading.referalBenefitsVirtual}
            />
            <UserInfoStyle6Field
              label="Referal Benefits (Sports Single Poles)"   
              placeholder=""  
              type={onoffType}
              value={fields.referalBenefitsSportsSinglePoles}
              onChange={handleChange("referalBenefitsSportsSinglePoles")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("referalBenefitsSportsSinglePoles")}
              loading={loading.referalBenefitsSportsSinglePoles}
            />
            <UserInfoStyle6Field
              label="Referal Benefits (Sports 2-Poles)"   
              placeholder=""  
              type={onoffType}
              value={fields.referalBenefitsSports2Poles}
              onChange={handleChange("referalBenefitsSports2Poles")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("referalBenefitsSports2Poles")}
              loading={loading.referalBenefitsSports2Poles}
            />
            <UserInfoStyle6Field
              label="Referal Benefits (Sports 3-Poles)"   
              placeholder=""  
              type={onoffType}
              value={fields.referalBenefitsSports3Poles}
              onChange={handleChange("referalBenefitsSports3Poles")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("referalBenefitsSports3Poles")}
              loading={loading.referalBenefitsSports3Poles}
            />
            <UserInfoStyle6Field
              label="Referal Benefits (Sports 4-Poles)"   
              placeholder=""  
              type={onoffType}
              value={fields.referalBenefitsSports4Poles}
              onChange={handleChange("referalBenefitsSports4Poles")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("referalBenefitsSports4Poles")}
              loading={loading.referalBenefitsSports4Poles}
            />
            <UserInfoStyle6Field
              label="Referal Benefits (Sports Dapol)"   
              placeholder=""  
              type={onoffType}
              value={fields.referalBenefitsSportsDapol}
              onChange={handleChange("referalBenefitsSportsDapol")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("referalBenefitsSportsDapol")}
              loading={loading.referalBenefitsSportsDapol}
            />

            <UserInfoStyle4Field
              label="Sports betting allowed"   
              placeholder=""  
              type={onoffType}
              value={fields.sportsBettingAllowed}
              onChange={handleChange("sportsBettingAllowed")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("sportsBettingAllowed")}
              loading={loading.sportsBettingAllowed}
            />
            <UserInfoStyle4Field
              label="Minimum folder for sports betting"   
              placeholder=""  
              type={onoffType}
              value={fields.minimumFolderForSportsBetting}
              onChange={handleChange("minimumFolderForSportsBetting")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("minimumFolderForSportsBetting")}
              loading={loading.minimumFolderForSportsBetting}
            />
          </div>
        </div>
        <div className="flex flex-row gap-4 mt-10 min-w-[1200px]">
          <div className="flex flex-col gap-2 text-xm">
            <MemoInputFiled 
              label="Account memo"
              placeholder="Account memo"
              value={fields.accountMemo}
              onChange={handleChange("accountMemo")}
              buttonLabel="Change account memo"
              onButtonClick={handleButtonClick("accountMemo")}
              loading={loading.accountMemo}
            />
            <MemoInput1Filed 
              label="Admin Note"
              placeholder="Admin Note"
              value={fields.adminNote}
              onChange={handleChange("adminNote")}
              buttonLabel="Change admin note"
              onButtonClick={handleButtonClick("adminNote")}
              loading={loading.adminNote}
            />
            <MemoInput1Filed 
              label="Admin Memo2"
              placeholder="Admin Memo2"
              value={fields.adminMemo2}
              onChange={handleChange("adminMemo2")}
              buttonLabel="Change admin memo2"
              onButtonClick={handleButtonClick("adminMemo2")}
              loading={loading.adminMemo2}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-10 min-w-[1200px]">
          <div className="flex flex-col gap-2 text-xm">
            <MemoInput1Filed 
              label="Allowed IP address"
              placeholder="xxx.xxx.xxx.xxx"
              value={fields.xxx}
              onChange={handleChange("xxx")}
              buttonLabel="Change"
              onButtonClick={handleButtonClick("xxx")}
              loading={loading.xxx}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBasicInformation;
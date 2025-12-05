"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Layout, message, Select } from "antd";
import { Content } from "antd/lib/layout/layout";
import { ReloadOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { useTranslations } from "next-intl";
import api from "@/api";
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
  options?: any[];
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
    {label: "Level 1", value: 1},
    {label: "Level 2", value: 2},
    {label: "Level 3", value: 3},
    {label: "Level 4", value: 4},
    {label: "Level 5", value: 5},
    {label: "Level 6", value: 6},
    {label: "Level 7", value: 7},
    {label: "Level 8", value: 8},
    {label: "Level 9", value: 9},
    {label: "Level 10", value: 10},
    {label: "Level 11", value: 11},
    {label: "Level 12", value: 12},
    {label: "VIP 1", value: 13},
    {label: "VIP 2", value: 14},
    {label: "Premium", value: 15},
]

const memberType = [
    {label: 'Genearl Member', value: 'G'},
    {label: 'Test Member', value: 'T'},
    {label: 'Interested Member', value: 'I'},
    {label: 'Working Member', value: 'W'},
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

const webLoginAvailableType = [
  {label: 'web login available', value: '1'},
  {label: 'pc only', value: '2'},
  {label: 'mobile only', value: '3'},
  {label: 'web login unavailable', value: '4'},
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

const displayMemberCodeType = [
  {label: 'Registration code not displayed', value: '1'},
  {label: 'Display membership code', value: '2'},
]

const initialLevelOfAcquaintanceRegistrationType = [
  {label: 'Basic method', value: '1'},
  {label: 'Top member level', value: '2'},
  {label: 'Level 1', value: '3'},
  {label: 'Level 2', value: '4'},
  {label: 'Level 3', value: '5'},
  {label: 'Level', value: '6'},
  {label: 'Level 5', value: '7'},
  {label: 'Level 6', value: '8'},
  {label: 'Level 7', value: '9'},
  {label: 'Level 8', value: '10'},
  {label: 'Level 9', value: '11'},
  {label: 'Level 10', value: '12'},
  {label: 'Level 11', value: '13'},
  {label: 'Level 12', value: '14'},
  {label: 'VIP 1', value: '15'},
  {label: 'VIP 2', value: '16'},
  {label: 'Premium', value: '17'},
]

const memberPageAlarmSoundType = [
  {label: 'Turn on', value: '1'},
  {label: 'Turn off', value: '2'},
]

const useAttendanceCheckType = [
  {label: 'Use', value: '1'},
  {label: 'Do not use', value: '2'},
]

const useTheRouletteType = [
  {label: 'Use', value: '1'},
  {label: 'Do not use roulette', value: '2'},
]

const customCenterInquiryAvailableType = [
  {label: 'allowance', value: '1'},
  {label: 'not allowed', value: '2'},
]

const createPostType = [
  {label: 'allowance', value: '1'},
  {label: 'not allowed', value: '2'},
]

const whiteCommentOnPostType = [
  {label: 'allowance', value: '1'},
  {label: 'not allowed', value: '2'},
]

const allowanceType = [
  {label: 'allowance', value: '1'},
  {label: 'not allowed', value: '2'},
]

const useOnOffType = [
  {label: 'use', value: '1'},
  {label: 'Not in use', value: '2'},
]

const restrictionType = [
  {label: 'No restrictions', value: '1'},
  {label: 'Limits', value: '2'},
]

const onlineOfflinedistributorType = [
  {label: "Online distributor", value: '1'},
  {label: "Offline distributor", value: '2'}
]

const currentType = [
  {label: "Current", value: '1'},
  {label: "Non-presentation", value: '2'}
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
      <Select 
        placeholder={placeholder} 
        options={type} 
        value={value} 
        onChange={(val) => onChange({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)}
        className="w-full"
      />
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
      <Select 
        placeholder={placeholder} 
        options={type} 
        value={value}
        onChange={(val) => onChange({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)}
        className="w-full"
      />
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
      <Select 
        placeholder={placeholder} 
        options={slotcityPriorityUseType} 
        value={value === 'true' ? true : value === 'false' ? false : Boolean(value)}
        onChange={(val) => onChange({ target: { value: String(val) } } as React.ChangeEvent<HTMLInputElement>)}
        className="w-full"
      />
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
        <Select 
          placeholder={placeholder} 
          onChange={(val) => onChange({ target: { value: String(val) } } as React.ChangeEvent<HTMLInputElement>)} 
          value={value ? Number(value) : undefined} 
          options={levelOption} 
          className="w-full"
        />
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
    options,
    loading,
    }) => (
        <div className="flex flex-column gap-2 justify-start items-center">
            <div className="text-xm w-[150px]">{label}</div>
            <div className="flex flex-row gap-2 w-[250px]">
            <Select 
              placeholder={placeholder} 
              onChange={(val) => onChange({ target: { value: String(val) } } as React.ChangeEvent<HTMLInputElement>)} 
              value={value} 
              options={options} 
              className="w-full"
            />
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
        <Select 
          placeholder={placeholder} 
          onChange={(val) => onChange({ target: { value: String(val) } } as React.ChangeEvent<HTMLInputElement>)} 
          value={value} 
          options={memberType} 
          className="w-full"
        />
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
      <TextArea rows={4} placeholder={placeholder} value={value} onChange={(e) => onChange(e as any)} className="w-full"/>
      <Button type="primary" onClick={onButtonClick} loading={loading} className="min-w-[150px]" disabled={loading}>
        {buttonLabel}
      </Button>
    </div>
  </div>
);


interface UserBasicInformationProps {
  userid?: string;
}

const UserBasicInformation: React.FC<UserBasicInformationProps> = ({ userid = "testuser" }) => {
  const [fields, setFields] = useState({
    id: "",
    nickname: "",
    password: "",
    passwordSpell: "",
    exchangePassword: "",
    allas: "",
    depositor: "",
    bankName: "",
    accountnumber: "",
    cellphone: "",
    birthday: "",
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
    os: "",
    device: "",
    fingerPrint: "",
    ip: "",
    live: "",
    slot: "",
    hold: "",
    entireLosing: "",
    liveLosingBeDang: "",
    slotLosingBeDang: "",
    holdLosingBeDang: "",
    losingMethod: "",
    membershipDeposit: "",
    membershipWithdrawal: "",
    totalWithdrawal: "",
    numberOfMembers: "",
    rollingHoldings: "",
    liveBetting: "",
    liveWinning: "",
    slotBetting: "",
    slotJackpot: "",
    rollingRate: "",
    rollingTransition: "",
    losingRate: "",
    losingSettlement: "",
    partnershipRolling: "",
    partnershipMoneyInHand: "",
    createdAt: "",
    updatedAt: "",
    currentIP: "",
    cellphoneCarrier: "",
    recentlyAccessedDomains: "",
    lastAccessDate: "",
    affiliation: "",
    signUpPath: "",
    registrationDomain: "",
    subscriptionIP: "",
    point: "",
    losingMoney: "",
    rollingPercentyLive: "",
    rollingPercentySlot: "",
    rollingPercentyHoldem: "",
    rollingPercentySportsSinglePole: "",
    rollingPercentySportsDupol: "",
    rollingPercentySports3Pole: "",
    rollingPercentySports4Pole: "",
    rollingPercentySports5Pole: "",
    rollingPercentySportsDapol: "",
    rollingPercentyVirtualGame: "",
  });

  const [loading, setLoading] = useState({
    id: false,
    nickname: false,
    password: false,
    passwordSpell: false,
    exchangePassword: false,
    allas: false,
    depositor: false,
    bankName: false,
    accountnumber: false,
    cellphone: false,
    birthday: false,
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
    os: false,
    device: false,
    fingerPrint: false,
    ip: false,
    live: false,
    slot: false,
    hold: false,
    entireLosing: false,
    liveLosingBeDang: false,
    slotLosingBeDang: false,
    holdLosingBeDang: false,
    losingMethod: false,
    membershipDeposit: false,
    membershipWithdrawal: false,
    totalWithdrawal: false,
    numberOfMembers: false,
    rollingHoldings: false,
    liveBetting: false,
    liveWinning: false,
    slotBetting: false,
    slotJackpot: false,
    rollingRate: false,
    rollingTransition: false,
    losingRate: false,
    losingSettlement: false,
    partnershipRolling: false,
    partnershipMoneyInHand: false,
    createdAt: false,
    updatedAt: false,
    currentIP: false,
    cellphoneCarrier: false,
    recentlyAccessedDomains: false,
    lastAccessDate: false,
    affiliation: false,
    signUpPath: false,
    registrationDomain: false,
    subscriptionIP: false,
    point: false,
    losingMoney: false,
    rollingPercentyLive: false,
    rollingPercentySlot: false,
    rollingPercentyHoldem: false,
    rollingPercentySportsSinglePole: false,
    rollingPercentySportsDupol: false,
    rollingPercentySports3Pole: false,
    rollingPercentySports4Pole: false,
    rollingPercentySports5Pole: false,
    rollingPercentySportsDapol: false,
    rollingPercentyVirtualGame: false,
  });

  const t = useTranslations();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api(`partner/user-basic-information/${userid}`, {
          method: "GET",
        });
        
        if (response) {
          setFields({
            id: response.id || "",
            nickname: response.nickname || "",
            password: "",
            passwordSpell: "",
            exchangePassword: "",
            allas: "",
            depositor: response.depositor || "",
            bankName: "",
            accountnumber: response.accountNumber || "",
            cellphone: response.cellphone || "",
            birthday: response.birthday || "",
            topDistributor: "",
            recommender: "",
            level: response.level || "",
            memberType: "",
            color: "",
            onoff: "",
            accountblock: "",
            residentNumber: response.residentNumber || "",
            useUSDT: "",
            walletAddress: "",
            lastDeposit: "",
            currencyExchangeRolling: "",
            currencyExchnageRollingBonus: "",
            exchangeRollingBettingAmount: "",
            currencyRollover: "",
            amountHold: response.amountHold || "",
            amountHoldPayment: "",
            amountHoldCollect: "",
            coupon: "",
            couponProcessing: "",
            totalLoss: "",
            totalLossProcessing: "",
            rollingGold: response.rollingGold || "",
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
            distributor: response.distributor || "",
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
            os: "",
            device: "",
            fingerPrint: "",
            ip: "",
            live: "",
            slot: "",
            hold: "",
            entireLosing: "",
            liveLosingBeDang: "",
            slotLosingBeDang: "",
            holdLosingBeDang: "",
            losingMethod: "",
            membershipDeposit: "",
            membershipWithdrawal: "",
            totalWithdrawal: "",
            numberOfMembers: "",
            rollingHoldings: "",
            liveBetting: "",
            liveWinning: "",
            slotBetting: "",
            slotJackpot: "",
            rollingRate: "",
            rollingTransition: "",
            losingRate: "",
            losingSettlement: "",
            partnershipRolling: "",
            partnershipMoneyInHand: "",
            createdAt: response.dateOfRegistration || "",
            updatedAt: "",
            currentIP: response.currentIP || "",
            // New fields from API response
            cellphoneCarrier: response.cellphoneCarrier || "",
            recentlyAccessedDomains: response.recentlyAccessedDomains || "",
            lastAccessDate: response.lastAccessDate || "",
            affiliation: response.affiliation || "",
            signUpPath: response.signUpPath || "",
            registrationDomain: response.registrationDomain || "",
            subscriptionIP: response.subscriptionIP || "",
            point: response.point || "",
            losingMoney: response.losingMoney || "",
            rollingPercentyLive: response.rollingPercentyLive || "",
            rollingPercentySlot: response.rollingPercentySlot || "",
            rollingPercentyHoldem: response.rollingPercentyHoldem || "",
            rollingPercentySportsSinglePole: response.rollingPercentySportsSinglePole || "",
            rollingPercentySportsDupol: response.rollingPercentySportsDupol || "",
            rollingPercentySports3Pole: response.rollingPercentySports3Pole || "",
            rollingPercentySports4Pole: response.rollingPercentySports4Pole || "",
            rollingPercentySports5Pole: response.rollingPercentySports5Pole || "",
            rollingPercentySportsDapol: response.rollingPercentySportsDapol || "",
            rollingPercentyVirtualGame: response.rollingPercentyVirtualGame || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        message.error("Failed to fetch user data");
      }
    };

    if (userid) {
      fetchUserData();
    }
  }, [userid]);     


  return (
    <div className="max-h-[90vh] overflow-auto p-4">
      <div className="bg-white">
        <div className="flex gap-8">
          {/* Left Column - Personal Information */}
          <div className="flex flex-col gap-4 flex-1">
            <UserInfoStyle1Field
              label="id"
              placeholder="id"
              value={fields.id}
            />
            <UserInfoStyle1Field
              label="nickname"
              placeholder="Nickname"
              value={fields.nickname}
            />
            <UserInfoStyle1Field
              label="Depositor"
              placeholder="Depositor"
              value={fields.depositor}
            />
            <UserInfoStyle1Field
              label="account number"
              placeholder="account number"
              value={fields.accountnumber}
            />
            <div className="flex flex-column gap-2 justify-start items-center">
              <div className="text-xm w-[150px]">Resident registration number (first digits)</div>
              <div className="flex flex-row gap-2 w-[250px]">
                <Input readOnly placeholder="" value={fields.residentNumber} />
                <Button type="default">Minimize</Button>
              </div>
            </div>
            <UserInfoStyle1Field
              label="birth date"
              placeholder="birth date"
              value={fields.birthday}
            />
            <UserInfoStyle1Field
              label="mobile phone carrier"
              placeholder="mobile phone carrier"
              value={fields.cellphoneCarrier}
            />
            <UserInfoStyle1Field
              label="cell phone"
              placeholder="cell phone"
              value={fields.cellphone}
            />
            <UserInfoStyle1Field
              label="Member level"
              placeholder="Member level"
              value={fields.level}
            />
            <UserInfoStyle1Field
              label="Most recent IP address"
              placeholder="Most recent IP address"
              value={fields.currentIP}
            />
            <UserInfoStyle1Field
              label="Recently accessed domains"
              placeholder="Recently accessed domains"
              value={fields.recentlyAccessedDomains}
            />
            <UserInfoStyle1Field
              label="Last access date"
              placeholder="Last access date"
              value={fields.lastAccessDate}
            />
          </div>

          {/* Middle Column - Registration and Affiliation Details */}
          <div className="flex flex-col gap-4 flex-1">
            <UserInfoStyle1Field
              label="Affiliation"
              placeholder="Affiliation"
              value={fields.affiliation}
            />
            <UserInfoStyle1Field
              label="Distributor"
              placeholder="Distributor"
              value={fields.distributor}
            />
            <UserInfoStyle1Field
              label="Sign-up path"
              placeholder="Sign-up path"
              value={fields.signUpPath}
            />
            <UserInfoStyle1Field
              label="Registration domain"
              placeholder="Registration domain"
              value={fields.registrationDomain}
            />
            <UserInfoStyle1Field
              label="Date of registration"
              placeholder="Date of registration"
              value={fields.createdAt}
            />
            <UserInfoStyle1Field
              label="Subscription IP"
              placeholder="Subscription IP"
              value={fields.subscriptionIP}
            />
          </div>

          {/* Right Column - Financial and Rolling Percentage Details */}
          <div className="flex flex-col gap-4 flex-1">
            <UserInfoStyle1Field
              label="Amount held"
              placeholder="Amount held"
              value={fields.amountHold}
            />
            <UserInfoStyle1Field
              label="point"
              placeholder="point"
              value={fields.point}
            />
            <UserInfoStyle1Field
              label="Losing money"
              placeholder="Losing money"
              value={fields.losingMoney}
            />
            <UserInfoStyle1Field
              label="Rolling gold"
              placeholder="Rolling gold"
              value={fields.rollingGold}
            />
            <UserInfoStyle1Field
              label="Rolling% (Live)"
              placeholder="Rolling% (Live)"
              value={fields.rollingPercentyLive}
            />
            <UserInfoStyle1Field
              label="Rolling% (slot)"
              placeholder="Rolling% (slot)"
              value={fields.rollingPercentySlot}
            />
            <UserInfoStyle1Field
              label="Rolling% (Hold'em)"
              placeholder="Rolling% (Hold'em)"
              value={fields.rollingPercentyHoldem}
            />
            <UserInfoStyle1Field
              label="Rolling% (Sports Single Pole)"
              placeholder="Rolling% (Sports Single Pole)"
              value={fields.rollingPercentySportsSinglePole}
            />
            <UserInfoStyle1Field
              label="Rolling% (Sports Dupol)"
              placeholder="Rolling% (Sports Dupol)"
              value={fields.rollingPercentySportsDupol}
            />
            <UserInfoStyle1Field
              label="Rolling% (Sports 3-pole)"
              placeholder="Rolling% (Sports 3-pole)"
              value={fields.rollingPercentySports3Pole}
            />
            <UserInfoStyle1Field
              label="Rolling% (Sports 4-pole)"
              placeholder="Rolling% (Sports 4-pole)"
              value={fields.rollingPercentySports4Pole}
            />
            <UserInfoStyle1Field
              label="Rolling% (Sports 5-pole)"
              placeholder="Rolling% (Sports 5-pole)"
              value={fields.rollingPercentySports5Pole}
            />
            <UserInfoStyle1Field
              label="Rolling% (Sports Dapol)"
              placeholder="Rolling% (Sports Dapol)"
              value={fields.rollingPercentySportsDapol}
            />
            <UserInfoStyle1Field
              label="Rolling% (virtual game)"
              placeholder="Rolling% (virtual game)"
              value={fields.rollingPercentyVirtualGame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBasicInformation;
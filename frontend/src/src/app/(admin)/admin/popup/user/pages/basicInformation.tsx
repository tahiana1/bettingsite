"use client";
import React, { useState } from "react";
import { Button, Input, Layout, message, Select } from "antd";
import { Content } from "antd/lib/layout/layout";
import { ReloadOutlined } from "@ant-design/icons";

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

const levelOption = [
    {label: "1", value: "1"},
    {label: "2", value: "2"},
    {label: "3", value: "3"},
    {label: "4", value: "4"},
    {label: "5", value: "5"},
    {label: "6", value: "6"},
    {label: "7", value: "7"},
    {label: "8", value: "8"},
    {label: "9", value: "9"},
    {label: "10", value: "10"},
    {label: "11", value: "11"},
    {label: "12", value: "12"},
    {label: "13", value: "13"},
    {label: "14", value: "14"},
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
    {label: 'sports', value: '10%'},
    {label: 'virtual games', value: '10%'},
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
    <div className="text-sm font-bold w-[150px]">{label}</div>
    <div className="flex flex-row gap-2 w-[250px]">
      <Input placeholder={placeholder} value={value} onChange={onChange} />
      <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
        {buttonLabel}
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
      <div className="text-sm font-bold w-[150px]">{label}</div>
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
      <div className="text-sm font-bold w-[150px]">{label}</div>
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
      <div className="text-sm font-bold w-[150px]">{label}</div>
      <div className="flex flex-row gap-2 w-[250px]">
        <Input type="number" disabled placeholder={placeholder} value={value} onChange={onChange} />
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
            <div className="text-sm font-bold w-[150px]">{label}</div>
            <div className="flex flex-row gap-2 w-[150px]">
                <Button type="primary">
                    <ReloadOutlined /> 
                </Button>
            </div>
        </div>
        
        <div className="flex gap-3" style={{flexDirection: 'column'}}>
        {
            currencyRolloverType.map((item, index) => (
               <div className="flex flex-row gap-2 justify-start items-center w-[250px]" key={index}>
                <div className="text-sm font-bold w-[50px]">{item.label}</div>
                <div className="flex flex-row gap-2 w-full">
                    <Input type="number" disabled value={item.value} onChange={onChange} />
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
      <div className="text-sm font-bold w-[150px]">{label}</div>
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
            <div className="text-sm font-bold w-[150px]">{label}</div>
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
      <div className="text-sm font-bold w-[150px]">{label}</div>
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
      <div className="text-sm font-bold w-[150px]">{label}</div>
      <div className="flex flex-row gap-2 w-[250px]">
        <Input type="color" placeholder={placeholder} onChange={onChange} value={value} className="w-full"/>
        <Button type="primary" onClick={onButtonClick} loading={loading} disabled={loading}>
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
    currencyRollover: ""
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
    currencyRollover: false
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
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="bg-white p-4">
        <div className="flex flex-column gap-4">
          <div className="flex flex-col gap-2 text-sm font-bold">Deposit</div>
          <div className="flex flex-col gap-2 text-sm font-bold text-[#71cb4a]">
            506,000
          </div>
          <div className="flex flex-col gap-2 text-sm justify-center items-center font-bold">
            -
          </div>
          <div className="flex flex-col gap-2 text-sm font-bold">Withdrawal</div>
          <div className="flex flex-col gap-2 text-sm font-bold text-[#71cb4a]">
            0
          </div>
          <div className="flex flex-col gap-2 text-sm font-bold">=</div>
          <div className="flex flex-col gap-2 text-sm font-bold text-[red]">
            506,000
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default UserBasicInformation;
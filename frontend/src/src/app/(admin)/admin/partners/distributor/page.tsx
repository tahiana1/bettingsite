"use client";
import React, { useEffect, useState } from "react";

import {
  Layout,
  Space,
  Card,
  Table,
  Button,
  Popconfirm,
  Input,
  Radio,
  Select,
  Modal,
  Form,
  Checkbox,
  Switch,
  InputNumber,
  Tabs,
} from "antd";
import { FilterDropdown } from "@refinedev/antd";
import type { RadioChangeEvent, TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import {
  APPROVE_USER,
  BLOCK_USER,
  CREATE_USER,
  GET_DISTRIBUTORS,
} from "@/actions/user";
import { BiBlock, BiTrash } from "react-icons/bi";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { RxLetterCaseToggle } from "react-icons/rx";
import { buildTree, parseTableOptions } from "@/lib";
import { USER_STATUS } from "@/constants";
import { GiNightSleep } from "react-icons/gi";
import { GET_DOMAINS } from "@/actions/domain";
import { FILTER_BANK } from "@/actions/bank";
import BasicInformation from "@/components/Admin/Distributor/Basic";
import LosingSettingPage from "./pages/losingSetting/page";
import "./index.css";
import RollingCasinoPage from "./pages/rollingCasino/page";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const PartnerPage: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [form] = Form.useForm();
  const [tableOptions, setTableOptions] = useState<any>({
    filters: [
      {
        or: [
          {
            field: "role",
            value: "P",
            op: "eq",
          },
          {
            field: "role",
            value: "A",
            op: "eq",
          },
        ],
      },
    ],
  });

  const [, contextHolder] = Modal.useModal();
  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<any[]>([]);
  const [treeUsers, setTreeUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null);
  const [currentUserChildren, setCurrentUserChildren] = useState<any[]>([]);
  const { loading, data, refetch } = useQuery(GET_DISTRIBUTORS);

  const { data: bankData } = useQuery(FILTER_BANK);
  const { data: childrenData, refetch: refetchChildren } =
    useQuery(GET_DISTRIBUTORS);

  const { data: domainData } = useQuery(GET_DOMAINS);
  const [domains, setDomains] = useState<any[]>([]);

  const [regModal, setRegModal] = useState<boolean>(false);
  const [domainModal, setDomainModal] = useState<boolean>(false);
  const [moneyModal, setMoneyModal] = useState<boolean>(false);
  const [userModal, setUserModal] = useState<boolean>(false);
  const [losingRollingModal, setLosingRollingModal] = useState<boolean>(false);
  const [selectedLosingRollingTab, setSelectedLosingRollingTab] = useState<string>("losingSetting");

  const [createUser] = useMutation(CREATE_USER);
  const [approveUser] = useMutation(APPROVE_USER);
  const [blockUser] = useMutation(BLOCK_USER);

  const onBlockUser = (user: User) => {
    blockUser({ variables: { id: user.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch(tableOptions);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onApproveUser = (user: User) => {
    approveUser({ variables: { id: user.id } })
      .then((res) => {
        if (res.data?.success) {
        }
        refetch();
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const onDomainRegister = (record: User) => {
    setCurrentUser(record);
    setDomainModal(true);
  };

  const onUpdateDomain = (v: any) => {
    console.log({ v });

    setDomainModal(false);
  };

  const onRegisterUser = (v: any) => {
    console.log({ v });
    createUser({
      variables: {
        input: { ...v, role: "P", type: "G", status: "P" },
      },
    }).then((result) => {
      console.log({ result });
    });
    setRegModal(false);
  };

  const onPayment = (record: User) => {
    setCurrentUser(record);
    setMoneyModal(true);
  };

  const onLosingRollingSetting = (record: User) => {
    setCurrentUser(record);
    setLosingRollingModal(true);
    
    // Fetch child data for the current user
    refetchChildren({
      filters: [
        {
          field: "parent_id",
          value: record.id,
          op: "eq",
        },
      ],
    }).then(() => {
      setCurrentUserChildren(
        childrenData?.response?.users?.map((u: any) => {
          return { ...u, key: u.id };
        }) ?? []
      );
    });
  };

  const onAmountChange = (e: RadioChangeEvent) => {
    if (e.target.value == "max") {
      form.setFieldValue("amount", 232323);
    } else {
      form.setFieldValue("amount", parseInt(e.target.value));
    }
  };
  const onChange: TableProps<User>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    setTableOptions(parseTableOptions(pagination, filters, sorter, extra));
  };

  const updateFilter = (field: string, v: string, op: string = "eq") => {
    let filters: { field: string; value: string; op: string }[] =
      tableOptions?.filters ?? [];
    filters = filters.filter((f) => f.field !== field);
    if (v) {
      filters = [
        ...filters,
        {
          field: field,
          value: v,
          op: op,
        },
      ];
    }
    setTableOptions({ ...tableOptions, filters });
  };

  const onBlackMemoChange = (v: string) => {
    updateFilter("black_memo", v, "eq");
  };

  const onMemberStatusChange = (v: string) => {
    updateFilter("status", v, "eq");
  };

  const onLevelChange = (v: string = "") => {
    updateFilter(`"Profile"."level"`, v, "eq");
  };

  const onExpand = (expanded: boolean, record: User) => {
    if (expanded) {
      refetchChildren({
        filters: [
          {
            field: "parent_id",
            value: record.id,
            op: "eq",
          },
        ],
      }).then(() => {
        setUsers([
          ...(users ?? []),
          ...(childrenData?.response?.users?.map((u: any) => {
            return { ...u, key: u.id };
          }) ?? []),
        ]);
      });
    }
  };

  const onViewCurrentMember = (u: User) => {
    console.log({ u });
    setCurrentUser(u);
    setUserModal(true);
  };

  const columns: TableProps<User>["columns"] = [
    {
      title: "ID",
      dataIndex: "userid",
      key: "userid",
      fixed: "left",
      sorter: {
        compare: (a, b) => {
          return a.userid > b.userid ? -1 : 1;
        },
        multiple: 1,
      },
      render: (text, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => onViewCurrentMember(record)}
        >
          {text}
        </Button>
      ),
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("site"),
      dataIndex: "site",
      key: "site",
      render: (text) => text ?? "site",
    },
    {
      title: t("root_dist"),
      dataIndex: "root.userid",
      key: "root.userid",
      render(_, record) {
        return record.root?.userid;
      },
    },
    {
      title: t("member_count"),
      dataIndex: "member_count",
      key: "member_count",
      render: (_, { profile }) => profile.comp,
    },
    {
      title: t("nickname"),
      dataIndex: "profile.nickname",
      key: '"Profile"."nickname"',
      render: (_, { profile }) => 
        profile.nickname,
      filterDropdown: (props) => (
        <FilterDropdown {...props}>
          <Input className="w-full" />
        </FilterDropdown>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => USER_STATUS[text],
    },
    {
      title: t("entry/exit"),
      dataIndex: "status",
      key: "status",
      render: (_, record) => [
        <Button
          title={t("deposit/withdraw")}
          variant="outlined"
          color="blue"
          key={"deposit"}
          onClick={() => onPayment(record)}
        >
          {t("deposit/withdraw")}
        </Button>,
        <Button
          title={t("points") + "+"}
          variant="outlined"
          color="blue"
          key={"point"}
        >
          {t("points") + "+"}
        </Button>,
      ],
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      key: "balance",
      render: (_, { profile }) => profile.balance,
    },
    {
      title: t("point"),
      dataIndex: "point",
      key: "point",
      render: (_, { profile }) => profile.point,
    },
    {
      title: t("settlementType"),
      dataIndex: "settlementType",
      key: "settlementType",
      render: (_, { profile }) => profile.comp,
    },
    {
      title: t("rollingRate"),
      dataIndex: "rollingRate",
      key: "rollingRate",
    },
    {
      title: t("rolling"),
      dataIndex: "rolling",
      key: "rolling",
    },
    {
      title: t("losingRate"),
      dataIndex: "losingRate",
      key: "losingRate",
    },
    {
      title: t("losing"),
      dataIndex: "losing",
      key: "losing",
    },

    {
      title: t("membership"),
      dataIndex: "membership",
      key: "membership",
      render: (_, record) => [
        <Button
          title={t("domainRegistration")}
          variant="outlined"
          color="blue"
          key={"domainRegistration"}
          onClick={() => onDomainRegister(record)}
        >
          {t("domainRegistration")}
        </Button>,
        <Button
          title={t("losingRollingSetting")}
          variant="outlined"
          color="blue"
          key={"losingRollingSetting"}
          onClick={() => onLosingRollingSetting(record)}
        >
          {t("losingRollingSetting")}
        </Button>,
        <Button title={t("move")} variant="outlined" color="blue" key={"move"}>
          {t("move")}
        </Button>,
        <Button
          title={t("lower")}
          variant="outlined"
          color="blue"
          key={"lower"}
        >
          {t("lower")}
        </Button>,
      ],
    },
    {
      title: t("shortcut"),
      dataIndex: "shortcut",
      key: "shortcut",
      render: () => [
        <Button title={t("money")} variant="outlined" color="red" key={"money"}>
          {t("money")}
        </Button>,
        <Button title={t("bet")} variant="outlined" color="blue" key={"bet"}>
          {t("bet")}
        </Button>,
      ],
    },
    {
      title: t("action"),
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space.Compact size="small" className="gap-2">
          <Popconfirm
            title={t("confirmSure")}
            onConfirm={
              record.status
                ? () => onBlockUser(record)
                : () => onApproveUser(record)
            }
            description={
              record.status ? t("blockMessage") : t("approveMessage")
            }
          >
            {record.status ? (
              <Button
                title={t("block")}
                icon={<BiBlock />}
                variant="outlined"
                color="orange"
              />
            ) : (
              <Button
                title={t("approve")}
                variant="outlined"
                color="red"
                icon={<PiUserCircleCheckLight />}
              />
            )}
          </Popconfirm>

          <Button
            title={t("dormancy")}
            variant="outlined"
            color="red"
            icon={<GiNightSleep />}
          />
          <Button
            title={t("delete")}
            variant="outlined"
            color="red"
            icon={<BiTrash />}
          />
        </Space.Compact>
      ),
    },
  ];

  const tabItems = [
    {
      label: t("basicInformation"),
      key: "basic",
      children: <BasicInformation user={currentUser!} />,
    },
    {
      label: t("blackSearch"),
      key: "blackSearch",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("bettingSettings"),
      key: "bettingSettings",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("deposit/withdraw"),
      key: "deposit/withdraw",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("noteList"),
      key: "noteList",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("serviceCenter"),
      key: "serviceCenter",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("accountInquirySetting"),
      key: "accountInquirySetting",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("subscriptionSetting"),
      key: "subscriptionSetting",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("directMemberList"),
      key: "directMemberList",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("recommendedMembers"),
      key: "recommendedMembers",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("subMembers"),
      key: "subMembers",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("integratedMoneyDetail"),
      key: "integratedMoneyDetail",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("pointDetail"),
      key: "pointDetail",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("couponDetail"),
      key: "couponDetail",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("losingHistory"),
      key: "losingHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("rollingHistory"),
      key: "rollingHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("bettingHistory"),
      key: "bettingHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("activityHistory"),
      key: "activityHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("informationChangeHistory"),
      key: "informationChangeHistory",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
    {
      label: t("generalStatistics"),
      key: "generalStatistics",
      children: (
        <div>
          <Input />
        </div>
      ),
    },
  ];

  const losingRollingTabItems = [
    // Main categories
    { label: t("losingSetting"), key: "losingSetting" },
    // { label: t("losingSetting(Lotus/MGM)"), key: "losingSetting(Lotus/MGM)" },
    // { label: t("losingSetting(Touch/Game)"), key: "losingSetting(Touch/Game)" },
    { label: t("rolling(Casino/Slots/Hold'em)"), key: "rolling(Casino/Slots/Hold'em)" },
    // { label: t("rolling(Sports/VirtualGame)"), key: "rolling(Sports/VirtualGame)" },
    // { label: t("rolling(Lotus/MGM)"), key: "rolling(Lotus/MGM)" },
    // { label: t("rolling(Touch/Game)"), key: "rolling(Touch/Game)" },
    // { label: t("rollingOption(Video)"), key: "rollingOption(Video)" },
    // Game providers and platforms (partial, rest will be added in next edit)
    // { label: t("algCasino"), key: "algCasino" },
    // { label: t("ejugi"), key: "ejugi" },
    // { label: t("TVBet"), key: "TVBet" },
    // { label: t("AsiaGaming"), key: "AsiaGaming" },
    // { label: t("Vegas"), key: "Vegas" },
    // { label: t("7Mjobs"), key: "7Mjobs" },
    // { label: t("WMCasino"), key: "WMCasino" },
    // { label: t("oneTouch"), key: "oneTouch" },
    // { label: t("midas"), key: "midas" },
    // { label: t("pragmatic"), key: "pragmatic" },
    // { label: t("mtvGaming"), key: "mtvGaming" },
    // { label: t("oriental"), key: "oriental" },
    // { label: t("vivienne"), key: "vivienne" },
    // { label: t("taishan"), key: "taishan" },
    // { label: t("secuNine"), key: "secuNine" },
    // { label: t("Evolution"), key: "Evolution" },
    // { label: t("Allbet"), key: "Allbet" },
    // { label: t("Hilton Casino"), key: "Hilton Casino" },
    // { label: t("UIG Casino"), key: "UIG Casino" },
    // { label: t("Playtech"), key: "Playtech" },
    // { label: t("Bombay Casino"), key: "Bombay Casino" },
    // { label: t("Dream Gaming"), key: "Dream Gaming" },
    // { label: t("Lucky Streak"), key: "Lucky Streak" },
    // { label: t("XPro Gaming"), key: "XPro Gaming" },
    // { label: t("Royal Casino"), key: "Royal Casino" },
    // { label: t("sexy casino"), key: "sexy casino" },
    // { label: t("Gameplay"), key: "Gameplay" },
    // { label: t("Skywind"), key: "Skywind" },
    // { label: t("88 Casino"), key: "88 Casino" },
    // { label: t("Bota Casino"), key: "Bota Casino" },
    // { label: t("Dowin"), key: "Dowin" },
    // { label: t("Portomaso"), key: "Portomaso" },
    // { label: t("Micro"), key: "Micro" },
    // { label: t("Cagayan"), key: "Cagayan" },
    // { label: t("Vivogaming"), key: "Vivogaming" },
    // { label: t("BetgamesTV"), key: "BetgamesTV" },
    // { label: t("Big Casino"), key: "Big Casino" },
    // { label: t("Vivitek"), key: "Vivitek" },
    // { label: t("Wazdan"), key: "Wazdan" },
    // { label: t("Gameplay Slots"), key: "Gameplay Slots" },
    // { label: t("Platypus"), key: "Platypus" },
    // { label: t("Lucky Games"), key: "Lucky Games" },
    // { label: t("Bungo"), key: "Bungo" },
    // { label: t("Playtech slots"), key: "Playtech slots" },
    // { label: t("Real-time gaming"), key: "Real-time gaming" },
    // { label: t("lightning box"), key: "lightning box" },
    // { label: t("Playful"), key: "Playful" },
    // { label: t("August"), key: "August" },
    // { label: t("Pop okay"), key: "Pop okay" },
    // { label: t("iron dog"), key: "iron dog" },
    // { label: t("TomHonGaming"), key: "TomHonGaming" },
    // { label: t("Quick Spin"), key: "Quick Spin" },
    // { label: t("Gemjix"), key: "Gemjix" },
    // { label: t("mascot"), key: "mascot" },
    // { label: t("Omi Gaming"), key: "Omi Gaming" },
    // { label: t("Habanero"), key: "Habanero" },
    // { label: t("GMW slot"), key: "GMW slot" },
    // { label: t("Igrosoft"), key: "Igrosoft" },
    // { label: t("BTG Slots"), key: "BTG Slots" },
    // { label: t("Aspect Gaming"), key: "Aspect Gaming" },
    // { label: t("Onlyplay"), key: "Onlyplay" },
    // { label: t("Slot mill"), key: "Slot mill" },
    // { label: t("Live22"), key: "Live22" },
    // { label: t("Phoenix"), key: "Phoenix" },
    // { label: t("boomerang"), key: "boomerang" },
    // { label: t("1x2 Gaming"), key: "1x2 Gaming" },
    // { label: t("Snowborne"), key: "Snowborne" },
    // { label: t("Betrade"), key: "Betrade" },
    // { label: t("B Gaming"), key: "B Gaming" },
    // { label: t("Gaming Soft"), key: "Gaming Soft" },
    // { label: t("Lilkingdom"), key: "Lilkingdom" },
    // { label: t("Smart Soft"), key: "Smart Soft" },
    // { label: t("Dream Tech"), key: "Dream Tech" },
    // { label: t("Thunder Kick"), key: "Thunder Kick" },
    // { label: t("WACS"), key: "WACS" },
    // { label: t("Spike Games"), key: "Spike Games" },
    // { label: t("Genesis"), key: "Genesis" },
    // { label: t("Evoplay"), key: "Evoplay" },
    // { label: t("Red Tiger"), key: "Red Tiger" },
    // { label: t("Kagaming"), key: "Kagaming" },
    // { label: t("ELK"), key: "ELK" },
    // { label: t("Fugaso"), key: "Fugaso" },
    // { label: t("Skywind Slots"), key: "Skywind Slots" },
    // { label: t("Play and Go"), key: "Play and Go" },
    // { label: t("Lady Luck"), key: "Lady Luck" },
    // { label: t("Concept Gaming"), key: "Concept Gaming" },
    // { label: t("Booming"), key: "Booming" },
    // { label: t("Jilli"), key: "Jilli" },
    // { label: t("Netgaming"), key: "Netgaming" },
    // { label: t("Net game"), key: "Net game" },
    // { label: t("Classic Casino"), key: "Classic Casino" },
    // { label: t("Elysium"), key: "Elysium" },
    // { label: t("Nolimit City"), key: "Nolimit City" },
    // { label: t("Spinominal"), key: "Spinominal" },
    // { label: t("Relax"), key: "Relax" },
    // { label: t("Micro Slot"), key: "Micro Slot" },
    // { label: t("scrap paper"), key: "scrap paper" },
    // { label: t("Amatik"), key: "Amatik" },
    // { label: t("Dragonsoft"), key: "Dragonsoft" },
    // { label: t("Evolution Slots"), key: "Evolution Slots" },
    // { label: t("Yggdrasil"), key: "Yggdrasil" },
    // { label: t("Pachai"), key: "Pachai" },
    // { label: t("Speedo"), key: "Speedo" },
    // { label: t("Flow"), key: "Flow" },
    // { label: t("revolver"), key: "revolver" },
    // { label: t("Ejugi slot"), key: "Ejugi slot" },
    // { label: t("Aristo Slots"), key: "Aristo Slots" },
    // { label: t("7Mojos Slots"), key: "7Mojos Slots" },
    // { label: t("Spearhead"), key: "Spearhead" },
    // { label: t("Push Gaming"), key: "Push Gaming" },
    // { label: t("Expanse"), key: "Expanse" },
    // { label: t("Betsoft"), key: "Betsoft" },
    // { label: t("Bellatra"), key: "Bellatra" },
    // { label: t("Woohoo Games"), key: "Woohoo Games" },
    // { label: t("Star Games"), key: "Star Games" },
    // { label: t("Secure Nine Slots"), key: "Secure Nine Slots" },
    // { label: t("Folder Player"), key: "Folder Player" },
    // { label: t("AvatarUX"), key: "AvatarUX" },
    // { label: t("Patagonia"), key: "Patagonia" },
    // { label: t("Bifigames"), key: "Bifigames" },
    // { label: t("Novomatic"), key: "Novomatic" },
    // { label: t("Nextspin"), key: "Nextspin" },
    // { label: t("One Touch Slot"), key: "One Touch Slot" },
    // { label: t("Play line"), key: "Play line" },
    // { label: t("Red Lake"), key: "Red Lake" },
    // { label: t("NetEnt"), key: "NetEnt" },
    // { label: t("Asian Slots"), key: "Asian Slots" },
    // { label: t("Split Rock"), key: "Split Rock" },
    // { label: t("Paris Play"), key: "Paris Play" },
    // { label: t("Punta Gaming"), key: "Punta Gaming" },
    // { label: t("Platin Gaming"), key: "Platin Gaming" },
    // { label: t("The Slot Show"), key: "The Slot Show" },
    // { label: t("Man collar"), key: "Man collar" },
    // { label: t("Game Art"), key: "Game Art" },
    // { label: t("Triple Profit"), key: "Triple Profit" },
    // { label: t("Just Play"), key: "Just Play" },
    // { label: t("Retro Gaming"), key: "Retro Gaming" },
    // { label: t("Spade Gaming"), key: "Spade Gaming" },
    // { label: t("World Match"), key: "World Match" },
    // { label: t("Caleta Gaming"), key: "Caleta Gaming" },
    // { label: t("Interch"), key: "Interch" },
    // { label: t("Playstar"), key: "Playstar" },
    // { label: t("Oriental Slots"), key: "Oriental Slots" },
    // { label: t("Pragmatic Slots"), key: "Pragmatic Slots" },
    // { label: t("Hacksogaming"), key: "Hacksogaming" },
    // { label: t("iSoftBet"), key: "iSoftBet" },
    // { label: t("Mabrik"), key: "Mabrik" },
    // { label: t("Vivienne slot"), key: "Vivienne slot" },
    // { label: t("Fijisoft"), key: "Fijisoft" },
    // { label: t("Calamba"), key: "Calamba" },
    // { label: t("Fields Game"), key: "Fields Game" },
    // { label: t("Chiron"), key: "Chiron" },
    // { label: t("Eurasia Gaming"), key: "Eurasia Gaming" },
    // { label: t("jenny"), key: "jenny" },
    // { label: t("Blueprint"), key: "Blueprint" },
    // { label: t("Games Lab"), key: "Games Lab" },
    // { label: t("Vivigames"), key: "Vivigames" },
    // { label: t("Phantasma"), key: "Phantasma" },
    // { label: t("Mobilat"), key: "Mobilat" },
    // { label: t("Reelplay"), key: "Reelplay" },
    // { label: t("7777gaming"), key: "7777gaming" },
    // { label: t("Gamefish Global"), key: "Gamefish Global" },
    // { label: t("Chance"), key: "Chance" },
    // { label: t("Top Trend"), key: "Top Trend" },
    // { label: t("Linder"), key: "Linder" },
    // { label: t("SVR Gaming"), key: "SVR Gaming" },
    // { label: t("Nagagames"), key: "Nagagames" },
    // { label: t("Sure Powerball 3 minutes (Sureman)"), key: "Sure Powerball 3 minutes (Sureman)" },
    // { label: t("Sure Powerball 2 minutes (Sureman)"), key: "Sure Powerball 2 minutes (Sureman)" },
    // { label: t("N Powerball 3 minutes (named)"), key: "N Powerball 3 minutes (named)" },
    // { label: t("Sure Powerball 1 minute (Sureman)"), key: "Sure Powerball 1 minute (Sureman)" },
    // { label: t("N Powerball 5 minutes (named)"), key: "N Powerball 5 minutes (named)" },
    // { label: t("Entry Speed ​​Kino (Entry)"), key: "Entry Speed ​​Kino (Entry)" },
    // { label: t("Ripple Ball 3 minutes (Bepick)"), key: "Ripple Ball 3 minutes (Bepick)" },
    // { label: t("Ripple Ball 5 minutes (Bepick)"), key: "Ripple Ball 5 minutes (Bepick)" },
    // { label: t("Netball 5 Minute Powerball (Bepick)"), key: "Netball 5 Minute Powerball (Bepick)" },
    // { label: t("Donghaeng Powerball (Entry)"), key: "Donghaeng Powerball (Entry)" },
    // { label: t("Netball 1 Minute Powerball (Bepick)"), key: "Netball 1 Minute Powerball (Bepick)" },
    // { label: t("Netball 2 Minute Powerball (Bepick)"), key: "Netball 2 Minute Powerball (Bepick)" },
    // { label: t("Netball 3 Minute Powerball (Bepick)"), key: "Netball 3 Minute Powerball (Bepick)" },
    // { label: t("Netball 4 Minute Powerball (Bepick)"), key: "Netball 4 Minute Powerball (Bepick)" },
    // { label: t("Mega Ball (Mega)"), key: "Mega Ball (Mega)" },
    // { label: t("PBG (Private Powerball)"), key: "PBG (Private Powerball)" },
    // { label: t("EVO Powerball 1 turn (EVO)"), key: "EVO Powerball 1 turn (EVO)" },
    // { label: t("EVO Powerball 2 Turns (EVO)"), key: "EVO Powerball 2 Turns (EVO)" },
    // { label: t("EVO Powerball 3 Turns (EVO)"), key: "EVO Powerball 3 Turns (EVO)" },
    // { label: t("EVO Powerball 4 Turns (EVO)"), key: "EVO Powerball 4 Turns (EVO)" },
    // { label: t("EVO Powerball 5 Turns (EVO)"), key: "EVO Powerball 5 Turns (EVO)" },
    // { label: t("W Powerball (Bepick)"), key: "W Powerball (Bepick)" },
    // { label: t("Coin Powerball 3 minutes (Bepick)"), key: "Coin Powerball 3 minutes (Bepick)" },
    // { label: t("Coin Powerball 5 minutes (Bepick)"), key: "Coin Powerball 5 minutes (Bepick)" },
    // { label: t("Running Ball Space 8 (Named)"), key: "Running Ball Space 8 (Named)" },
    // { label: t("EuroMillions 1 Minute Powerball (BePick)"), key: "EuroMillions 1 Minute Powerball (BePick)" },
    // { label: t("EuroMillions 5 Minute Powerball (BePick)"), key: "EuroMillions 5 Minute Powerball (BePick)" },
    // { label: t("EuroMillions 3 Minute Powerball (BePick)"), key: "EuroMillions 3 Minute Powerball (BePick)" },
    // { label: t("Running Ball Maze 2 (Named)"), key: "Running Ball Maze 2 (Named)" },
    // { label: t("Europa Powerball (Europa)"), key: "Europa Powerball (Europa)" },
    // { label: t("Red Powerball (Named)"), key: "Red Powerball (Named)" },
    // { label: t("Next Powerball (Next)"), key: "Next Powerball (Next)" },
    // { label: t("Gaepan Powerball 1 (One Line)"), key: "Gaepan Powerball 1 (One Line)" },
    // { label: t("Donghaeng Powerball - Random Ball (Donghaeng)"), key: "Donghaeng Powerball - Random Ball (Donghaeng)" },
    // { label: t("Ripple Ball (Ripple)"), key: "Ripple Ball (Ripple)" },
    // { label: t("Coin Powerball 1 minute (play score)"), key: "Coin Powerball 1 minute (play score)" },
    // { label: t("Coin Powerball 2 minutes (Play Score)"), key: "Coin Powerball 2 minutes (Play Score)" },
    // { label: t("Running Ball Speed ​​4 (Named)"), key: "Running Ball Speed ​​4 (Named)" },
    // { label: t("Running Ball Speed ​​6 (Named)"), key: "Running Ball Speed ​​6 (Named)" },
    // { label: t("SK Powerball (SK)"), key: "SK Powerball (SK)" },
    // { label: t("PBG Powerball (Bepick)"), key: "PBG Powerball (Bepick)" },
    // { label: t("Europa Speed ​​Kino (Europa)"), key: "Europa Speed ​​Kino (Europa)" },
    // { label: t("EOS5 Minute Powerball (Entry)"), key: "EOS5 Minute Powerball (Entry)" },
    // { label: t("EOS3 Minute Powerball (Entry)"), key: "EOS3 Minute Powerball (Entry)" },
    // { label: t("EOS4 Minute Powerball (Entry)"), key: "EOS4 Minute Powerball (Entry)" },
    // { label: t("EOS1 Minute Powerball (Entry)"), key: "EOS1 Minute Powerball (Entry)" },
    // { label: t("EOS2 Minute Powerball (Entry)"), key: "EOS2 Minute Powerball (Entry)" },
    // { label: t("Japan Lotto (Bepick)"), key: "Japan Lotto (Bepick)" },
    // { label: t("Bogle Powerball (Bepick)"), key: "Bogle Powerball (Bepick)" },
    // { label: t("Donghaeng Powerball (Donghaeng)"), key: "Donghaeng Powerball (Donghaeng)" },
    // { label: t("Donghaeng Speed ​​Kino (Bepick)"), key: "Donghaeng Speed ​​Kino (Bepick)" },
    // { label: t("Random Powerball 5 minutes (Bepick)"), key: "Random Powerball 5 minutes (Bepick)" },
    // { label: t("Token Powerball (Token)"), key: "Token Powerball (Token)" },
    // { label: t("Random Powerball 3 minutes (Bepick)"), key: "Random Powerball 3 minutes (Bepick)" },
    // { label: t("Jumanji (Score 888)"), key: "Jumanji (Score 888)" },
    // { label: t("Donghaeng Kinosadari (Bepic)"), key: "Donghaeng Kinosadari (Bepic)" },
    // { label: t("Next Baccarat (Next)"), key: "Next Baccarat (Next)" },
    // { label: t("Bat and Wolf (Lucky Seven)"), key: "Bat and Wolf (Lucky Seven)" },
    // { label: t("Dragon Tiger (Sky Park)"), key: "Dragon Tiger (Sky Park)" },
    // { label: t("Odd or Even (Sky Park)"), key: "Odd or Even (Sky Park)" },
    // { label: t("Nine Ball (Crown)"), key: "Nine Ball (Crown)" },
    // { label: t("N Power Ladder 3 minutes (named)"), key: "N Power Ladder 3 minutes (named)" },
    // { label: t("N Power Ladder 5 minutes (named)"), key: "N Power Ladder 5 minutes (named)" },
    // { label: t("The flatbed truck ladder (score 888)"), key: "The flatbed truck ladder (score 888)" },
    // { label: t("Bogle Ladder 1 minute (one line)"), key: "Bogle Ladder 1 minute (one line)" },
    // { label: t("Bogle Ladder 3 minutes (one line)"), key: "Bogle Ladder 3 minutes (one line)" },
    // { label: t("Spear and Shield (Sporup)"), key: "Spear and Shield (Sporup)" },
    // { label: t("Europakinosadder (Europa)"), key: "Europakinosadder (Europa)" },
    // { label: t("Nine (Jolly)"), key: "Nine (Jolly)" },
    // { label: t("Next Ladder (Next)"), key: "Next Ladder (Next)" },
    // { label: t("Speed ​​Baccarat (Sky Park)"), key: "Speed ​​Baccarat (Sky Park)" },
    // { label: t("Open Baccarat (One Line)"), key: "Open Baccarat (One Line)" },
    // { label: t("Split Casino (Split)"), key: "Split Casino (Split)" },
    // { label: t("Sun & Moon (Game Zone)"), key: "Sun & Moon (Game Zone)" },
    // { label: t("Star Bridge 1 minute (Bosscore)"), key: "Star Bridge 1 minute (Bosscore)" },
    // { label: t("Heat Ladder 1 minute (Sporup)"), key: "Heat Ladder 1 minute (Sporup)" },
    // { label: t("Star Bridge 2 minutes (Bosscore)"), key: "Star Bridge 2 minutes (Bosscore)" },
    // { label: t("Penalty Kick (Lucky Seven)"), key: "Penalty Kick (Lucky Seven)" },
    // { label: t("Gaepansutda 3 (one line)"), key: "Gaepansutda 3 (one line)" },
    // { label: t("Star Bridge 3 minutes (Bosscore)"), key: "Star Bridge 3 minutes (Bosscore)" },
    // { label: t("Heat Ladder 3 minutes (Sporup)"), key: "Heat Ladder 3 minutes (Sporup)" },
    // { label: t("Seotda (Crown)"), key: "Seotda (Crown)" },
    // { label: t("New Zealand Ladder 3 minutes (one line)"), key: "New Zealand Ladder 3 minutes (one line)" },
    // { label: t("New Zealand Ladder 5 minutes (one line)"), key: "New Zealand Ladder 5 minutes (one line)" },
    // { label: t("Europa Power Ladder (Europa)"), key: "Europa Power Ladder (Europa)" },
    // { label: t("Ripple Ladder 5 minutes (Bepick)"), key: "Ripple Ladder 5 minutes (Bepick)" },
    // { label: t("Ripple Ladder 3 minutes (Bepick)"), key: "Ripple Ladder 3 minutes (Bepick)" },
    // { label: t("New Zealand Ladder 1 minute (one line)"), key: "New Zealand Ladder 1 minute (one line)" },
    // { label: t("SK Ladder 3 minutes (SK)"), key: "SK Ladder 3 minutes (SK)" },
    // { label: t("Spider (Jolly)"), key: "Spider (Jolly)" },
    // { label: t("Dragon & Tiger (Jolly)"), key: "Dragon & Tiger (Jolly)" },
    // { label: t("Gold Pig Ladder (Game Star)"), key: "Gold Pig Ladder (Game Star)" },
    // { label: t("Dice (Skypark)"), key: "Dice (Skypark)" },
    // { label: t("Coin Ladder 2 minutes (Play Score)"), key: "Coin Ladder 2 minutes (Play Score)" },
    // { label: t("Coin Ladder 1 minute (Play Score)"), key: "Coin Ladder 1 minute (Play Score)" },
    // { label: t("Dog and Cat (Lucky Seven)"), key: "Dog and Cat (Lucky Seven)" },
    // { label: t("Next Ring (Next)"), key: "Next Ring (Next)" },
    // { label: t("Ladder 7 (Lucky Seven)"), key: "Ladder 7 (Lucky Seven)" },
    // { label: t("Companion ladder (companion)"), key: "Companion ladder (companion)" },
    // { label: t("Entry Keyno Ladder (Entry)"), key: "Entry Keyno Ladder (Entry)" },
    // { label: t("Timo (Jolly)"), key: "Timo (Jolly)" },
    // { label: t("Dog board hole (one line)"), key: "Dog board hole (one line)" },
    // { label: t("Mini Baccarat (Crown)"), key: "Mini Baccarat (Crown)" },
    // { label: t("Odd or Even (Crown)"), key: "Odd or Even (Crown)" },
    // { label: t("Power Ladder (Entry)"), key: "Power Ladder (Entry)" },
    // { label: t("Darts (Game Zone)"), key: "Darts (Game Zone)" },
    // { label: t("Coin Ladder 5 minutes (Bepick)"), key: "Coin Ladder 5 minutes (Bepick)" },
    // { label: t("Coin Ladder 3 minutes (Bepick)"), key: "Coin Ladder 3 minutes (Bepick)" },
    // { label: t("Ryan Muji (Game Star)"), key: "Ryan Muji (Game Star)" },
    // { label: t("Power Kino Ladder (Entry)"), key: "Power Kino Ladder (Entry)" },
    // { label: t("Dice game (score 888)"), key: "Dice game (score 888)" },
    // { label: t("Sure Ladder 3 minutes (Sure Man)"), key: "Sure Ladder 3 minutes (Sure Man)" },
    // { label: t("Sure Ladder 2 minutes (Sureman)"), key: "Sure Ladder 2 minutes (Sureman)" },
    // { label: t("Sure Ladder 1 Minute (Sure Man)"), key: "Sure Ladder 1 Minute (Sure Man)" },
    // { label: t("Bogle Ladder (Bepic)"), key: "Bogle Ladder (Bepic)" },
    // { label: t("Sky Park Baccarat (Sky Park)"), key: "Sky Park Baccarat (Sky Park)" },
  ];

  useEffect(() => {
    setUsers(
      data?.response?.users?.map((u: any) => {
        return { ...u, key: u.id };
      }) ?? []
    );
    setTotal(data?.response?.total);
  }, [data]);

  useEffect(() => {
    setTreeUsers(buildTree(users ?? []));
    // setTotal(data?.response?.total);
  }, [users]);

  useEffect(() => {
    setDomains(
      domainData?.response?.domains?.map((d: Domain) => ({
        ...d,
        key: d.id,
        label: d.name,
        value: d.id,
      }))
    );
  }, [domainData]);

  return (
    <Layout>
      {contextHolder}
      <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
        <Card
          title={t("admin/menu/partners")}
          classNames={{
            body: "!p-0",
          }}
        >
          <Space className="p-2 !w-full" direction="vertical">
            <Radio.Group
              size="small"
              optionType="button"
              buttonStyle="solid"
              options={[
                {
                  label: t("all"),
                  value: "",
                },
                {
                  label: t("site"),
                  value: "site",
                },
              ]}
              defaultValue={""}
            />
            <Space wrap>
              <Radio.Group
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: t("all"),
                    value: "",
                  },
                  {
                    label: t("blackMemo") + " O",
                    value: "true",
                  },
                  {
                    label: t("blackMemo") + " X",
                    value: "false",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onBlackMemoChange(e.target.value)}
              />

              <Radio.Group
                className="flex-nowrap"
                size="small"
                optionType="button"
                buttonStyle="solid"
                options={[
                  {
                    label: t("all"),
                    value: "",
                  },
                  {
                    label: t("approved"),
                    value: "A",
                  },
                  {
                    label: t("suspened"),
                    value: "S",
                  },
                  {
                    label: t("deleted"),
                    value: "D",
                  },
                  {
                    label: t("blocked"),
                    value: "B",
                  },
                  {
                    label: t("inactive"),
                    value: "I",
                  },
                ]}
                defaultValue={""}
                onChange={(e) => onMemberStatusChange(e.target.value)}
              />
            </Space>
            <Space className="!w-full justify-between">
              <Space>
                <Select
                  size="small"
                  placeholder="By Level"
                  className="min-w-28"
                  allowClear
                  onClear={onLevelChange}
                  options={[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101, 102, 100,
                  ].map((i) => ({
                    value: i,
                    label:
                      i == 100 ? "Premium" : (i > 100 ? "VIP " : "Level ") + i,
                  }))}
                  onChange={onLevelChange}
                />
                <Select
                  size="small"
                  placeholder="By Field"
                  className="min-w-28"
                  allowClear
                  options={[
                    { label: t("all"), value: "" },
                    { label: t("userid"), value: "id" },
                    { label: t("nickname"), value: `"Profile"."nickname"` },
                    { label: t("phone"), value: `"Profile"."phone"` },
                    { label: t("holderName"), value: `"Profile"."holderName"` },
                    {
                      label: t("accountNumber"),
                      value: `"Profile"."accountNumber"`,
                    },
                    { label: t("usdtAddress"), value: `usdtAddress` },
                  ]}
                />
                <Input.Search
                  size="small"
                  placeholder="ID,Nickname,AccountHolder,Phone"
                  suffix={
                    <Button
                      size="small"
                      type="text"
                      icon={<RxLetterCaseToggle />}
                    />
                  }
                  enterButton={t("search")}
                />
                <Button size="small">{t("only_root_distributor")}</Button>
                <Checkbox> {t("only_direct_member")}</Checkbox>
              </Space>
              <Button size="small" onClick={() => setRegModal(true)}>
                {t("register")}
              </Button>
            </Space>
          </Space>
          <Table<User>
            columns={columns}
            loading={loading}
            dataSource={treeUsers ?? []}
            className="w-full"
            size="small"
            scroll={{ x: "max-content" }}
            expandable={{
              onExpand,
            }}
            onChange={onChange}
            pagination={{
              showTotal(total, range) {
                return t("paginationLabel", {
                  from: range[0],
                  to: range[1],
                  total,
                });
              },
              total: total,
              showSizeChanger: true,
              defaultPageSize: 25,
              pageSizeOptions: [25, 50, 100, 250, 500, 1000],
            }}
          />

          <Modal
            title={t("register")}
            open={regModal}
            onCancel={() => setRegModal(false)}
            width={800}
            footer={null}
          >
            <Space direction="vertical" className="gap-2 w-full">
              <Form {...formItemLayout} onFinish={onRegisterUser}>
                <Form.Item name="domainId" label={t("domain")}>
                  <Select options={domains} />
                </Form.Item>
                <Form.Item name="settlementId" label={t("settlementMethod")}>
                  <Select
                    options={[
                      {
                        label: "(Be-Dang)*Rate%-Rolling-Rolling Conversion",
                        value: 1,
                      },
                      {
                        label: "(Be-Dang-Rolling-Rolling Conversion)*Rate%",
                        value: 2,
                      },
                      {
                        label:
                          "[(input-output)-(current money previous money)]*rate%-rolling",
                        value: 3,
                      },
                      {
                        label:
                          "[(deposit-withdrawal)-(current money-previous money)-rolling]*rate%",
                        value: 4,
                      },
                      {
                        label: "(input-output)*rate%",
                        value: 5,
                      },
                      {
                        label:
                          "[(input-output)-(current money-previous money)]*rate%",
                        value: 6,
                      },
                      {
                        label: "(Be-dang-Total Rolling)*Rate%",
                        value: 7,
                      },
                      {
                        label: "(B-Dang-orignal Rollling)*Rate%",
                        value: 8,
                      },
                      {
                        label:
                          "[(Be-dang)*Rate%-Rolling-RollingConversion]*0.9",
                        value: 9,
                      },
                    ]}
                  />
                </Form.Item>{" "}
                <Form.Item name="name" label={t("name")}>
                  <Input />
                </Form.Item>
                <Form.Item name="userid" label={t("userid")}>
                  <Input />
                </Form.Item>
                <Form.Item name="password" label={t("password")}>
                  <Input.Password />
                </Form.Item>
                <Form.Item name={"nickname"} label={t("nickname")}>
                  <Input />
                </Form.Item>
                <Form.Item name={"phone"} label={t("contact")}>
                  <Input />
                </Form.Item>
                <Form.Item name={"holderName"} label={t("holderName")}>
                  <Input />
                </Form.Item>
                <Form.Item name={"bankId"} label={t("bank")}>
                  <Select
                    options={bankData?.response?.banks?.map((b: Bank) => ({
                      label: b.name,
                      value: b.id,
                    }))}
                  />
                </Form.Item>
                <Form.Item label={t("accountNumber")}>
                  <Input />
                </Form.Item>
                <Form.Item label={t("secPassword")}>
                  <Input.Password />
                </Form.Item>
                <Form.Item label={t("bettingHistoryReductionApplied")}>
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    options={[
                      {
                        label: t("live"),
                        value: "live",
                      },
                      {
                        label: t("slot"),
                        value: "slot",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label={t("rollingConversionAutoApprove")}>
                  <Switch />
                </Form.Item>
                <Form.Item label={t("virtualAccountAPI")}>
                  <Switch />
                </Form.Item>
                <Form.Item label={t("allowCreationSubDealers")}>
                  <Switch />
                </Form.Item>
                <Form.Item label={t("allowCreationLowerLevelDirectMembers")}>
                  <Switch />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    {t("register")}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Modal>

          <Modal
            title={t("domain")}
            open={domainModal}
            onCancel={() => setDomainModal(false)}
            footer={null}
          >
            <Space direction="vertical" className="gap-2 w-full">
              <Form
                initialValues={{
                  userId: currentUser?.userid,
                }}
                onFinish={onUpdateDomain}
              >
                <Form.Item label={t("site")}>
                  <Select
                    options={[
                      {
                        label: "site2",
                        value: "site2",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item name={"userId"} label={t("domain")}>
                  <Input disabled />
                </Form.Item>
                <Form.Item name={"domainId"} label={t("domain")}>
                  <Select mode="multiple" options={domains} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {t("register")}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Modal>

          <Modal
            title={t("payment")}
            open={moneyModal}
            onCancel={() => setMoneyModal(false)}
            footer={null}
          >
            <Space direction="vertical" className="gap-2 w-full">
              <Form
                initialValues={{
                  userId: currentUser?.userid,
                  balance: currentUser?.profile?.balance,
                }}
                form={form}
                onFinish={() => {
                  setMoneyModal(false);
                }}
              >
                <Form.Item name={"balance"} label={t("balance")}>
                  <Input disabled />
                </Form.Item>
                <Space>
                  <Form.Item
                    name={"amount"}
                    label={t("amount")}
                    className="!flex !w-full !p-0 !m-0"
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                  <Button type="primary">{t("pay")}</Button>
                  <Button color="danger" variant="outlined">
                    {t("cancel")}
                  </Button>
                </Space>

                <Form.Item>
                  <Radio.Group
                    buttonStyle="solid"
                    className="w-full "
                    onChange={onAmountChange}
                  >
                    <Space.Compact className="w-full mt-4 flex flex-wrap gap-2">
                      <Radio.Button value={1000}>
                        {f.number(1000, { style: "currency", currency: "USD" })}
                      </Radio.Button>
                      <Radio.Button value={5000}>
                        {f.number(5000, { style: "currency", currency: "USD" })}
                      </Radio.Button>
                      <Radio.Button value={10000}>
                        {f.number(10000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={50000}>
                        {f.number(50000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={100000}>
                        {f.number(100000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={500000}>
                        {f.number(500000, {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Radio.Button>
                      <Radio.Button value={"max"}>MAX</Radio.Button>
                    </Space.Compact>
                  </Radio.Group>
                </Form.Item>
                <Form.Item>
                  <Button type="default" htmlType="submit">
                    {t("close")}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          </Modal>

          <Modal
            title={t("user")}
            open={userModal}
            onCancel={() => setUserModal(false)}
            footer={null}
            width={"98%"}
          >
            {/* <Tabs items={tabItems} /> */}
          </Modal>

          <Modal
            open={losingRollingModal}
            onCancel={() => {
              setLosingRollingModal(false);
              setCurrentUserChildren([]);
            }}  
            footer={null}
            width={"98%"}
          >
            <Card
              title={currentUser?.profile?.name + " " + "[ " + currentUser?.profile?.nickname + " ]" + " " + t("losingRollingSetting")}
              styles={{
                header: {
                  backgroundColor: '#000',
                  color:'#fff',
                  borderBottom: '1px solid #d9d9d9'
                }
              }}
            >
              <Space direction="vertical" className="gap-4 w-full">
                <div className="flex flex-wrap gap-2">
                  {losingRollingTabItems.map((item, index) => (
                    <Button
                      key={item.key}
                      type={selectedLosingRollingTab === item.key ? "primary" : "default"}
                      size="small"
                      onClick={() => {
                        setSelectedLosingRollingTab(item.key);
                        console.log(`Clicked: ${item.label}`);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedLosingRollingTab === "losingSetting" && <LosingSettingPage data={{ currentUser }}/>}
                  {selectedLosingRollingTab === "rolling(Casino/Slots/Hold'em)" && <RollingCasinoPage data={{ currentUser }}/>}
                </div>
              </Space>
            </Card>
          </Modal>
        </Card>
      </Content>
    </Layout>
  );
};

export default PartnerPage;

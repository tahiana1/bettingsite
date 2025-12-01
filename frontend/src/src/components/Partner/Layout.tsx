"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ApolloProvider } from "@apollo/client";
import client from "@/api/apollo-client-ws";

import {
  ConfigProvider,
  Layout,
  Menu,
  Avatar,
  Button,
  theme,
  Flex,
  Dropdown,
  Space,
  notification,
  Breadcrumb,
  Tag,
} from "antd";
import { List, MenuProps } from "antd";

import {
  MoonOutlined,
  SunOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  CalculatorOutlined,
  InboxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { GrUserAdmin } from "react-icons/gr";
import LayoutContext from "@/contexts/LayoutContextProvider";
import RouteTracker from "@/components/Common/RouteTracker";

import { useLocale, useTranslations } from "next-intl";
import LangSwitcher from "../Common/LangSwitcher";
import { breadcrumbState, currentAdminTheme, userState } from "@/state/state";
import { useAtom } from "jotai";
import api from "@/api";
import { ROUTES } from "@/routes";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";
import { FaFootball, FaUsersGear } from "react-icons/fa6";
import { MdAnnouncement } from "react-icons/md";
import { SiDistrokid } from "react-icons/si";
import { BiDiamond, BiSupport } from "react-icons/bi";

import Image from "next/image";
import Loading from "@/assets/img/main/loader.png";
import Logo from "@/assets/img/logo.png";

const { Header, Sider } = Layout;

export default function PartnerRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [mounted, setMount] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [selectedkeys, setSelectedkeys] = useState<string[]>(["home"]);
  const [isDarkTheme, setDarkTheme] = useAtom<boolean>(currentAdminTheme);
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const [isPartner, setPartner] = useState<boolean>(false);
  const [currentMenuItems, setCurrentMenuItems] = useState<any[]>([]);
  const [notiApi, contextHolder] = notification.useNotification();
  const [breadcrumbMenu] = useAtom<string[]>(breadcrumbState);
  const t = useTranslations();
  const locale = useLocale();

  const [currentUser, setUser] = useAtom<any>(userState);
  const [pathname, setPathname] = useState<string>('');
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    setPathname(window.location.pathname);
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    api("admin/dashboard/get-data", {
      method: "GET",
    }).then((res) => {
      if (res) {
        setInfo(res.stats);
        setTimeout(() => {
          fetchInfo();
        }, 15000);
      }
    });
  };

  const data = [
    {
      label: t("depositToday"),
      value: info.depositToday,
      color: "steelblue",
    },
    {
      label: t("withdrawlToday"),
      value: info.withdrawToday,
      color: "crimson",
    },
    {
      label: t("bettingToday"),
      value: info.bettingToday,
      color: "mediumseagreen",
    },
    {
      label: t("todaysWinner"),
      value: info.todayWinners,
      color: "gold",
    },
    {
      label: t("lowerHoldingAmount"),
      value : 0,
      color: "slateblue",
    },
    {
      label : t("myBalance"),
      value : 0,
      color: "teal",
    },
    {
      label: t("point"),
      value : 0,
      color: "orchid",
    },
    {
      label: t("today'sLossingMoney"),
      value : 0,
      color: "salmon",
    },
    {
      label: t("today'sRollingFee"),
      value : 0,
      color: "cornflowerblue",
    }
  ];

  const onLogout = () => {
    api("auth/logout", { method: "POST" }).then(() => {
      setUser({});
      localStorage.removeItem("token");
      router.push(ROUTES.partner.login);
    });
  };

  const sideBarItems: MenuProps["items"] = [
    {
      key: "home",
      label: (
        <List
          className="!text-white"
          style={{
            borderRadius: '10px',
            border: '1px solid #09188962',
            padding: '10px',
            backgroundColor:'#002140'
          }}
          header={""}
          dataSource={data}
          renderItem={(item: any) => {
            return (
              <List.Item className={`!p-0 flex justify-between !items-end`}>
                <div style={{ color: item.color }}>{item.label}</div>
                <div style={{ color: item.color }}>{item.value}</div>
              </List.Item>
            );
          }}
        />
      ),
      type: "group",
    },
    {
      key: "manage",
      label: t("partner/menu/manage"),
      style: {
        borderRadius: '10px',
        border: '1px solid #09188962',
        paddingLeft: '0px',
        paddingRight: '10px',
        marginLeft: '16px',
        marginRight: "16px",
        marginTop: '10px',
        backgroundColor:'#002140'
      },
      type: "group",
    },
    {
      key: "partner/mySettlementManagement",
      label: t("partner/menu/mySettlementManagement"),
      icon: <CalculatorOutlined />,
      children: [
        {
          key: "partner/mySettlementManagement/myDepositWidthdrawal",
          label: t(`partner/menu/mySettlementManagement/myDepositWidthdrawal`),
        },
        {
          key: "partner/mySettlementManagement/rollingTransaction",
          label: t(`partner/menu/mySettlementManagement/rollingTransaction`),
        },
        {
          key: "partner/mySettlementManagement/pointConversion",
          label: t(`partner/menu/mySettlementManagement/pointConversion`),
        },
        {
          key: "partner/mySettlementManagement/settlementDetails",
          label: t(`partner/menu/mySettlementManagement/settlementDetails`),
        },
        {
          key: "partner/mySettlementManagement/moneyHistory",
          label: t(`partner/menu/mySettlementManagement/moneyHistory`),
        },
        {
          key: "partner/mySettlementManagement/pointDetails",
          label: t(`partner/menu/mySettlementManagement/pointDetails`),
        },
        {
          key: "partner/mySettlementManagement/rollingHistory",
          label: t(`partner/menu/mySettlementManagement/rollingHistory`),
        }
      ],
    },
    {
      key: "partner/sub-management",
      label: t("partner/menu/sub-management"),
      icon: <SiDistrokid />,
      children: [
        {
          key: "partner/sub-management/sub-member-list",
          label: t("partner/menu/sub-member-list"),
        },
        {
          key: "partner/sub-management/sub-distributor",
          label: t("partner/menu/sub-distributor"),
        },
      ],
    },
    {
      key: "partner/member-management",
      label: t("partner/menu/member-management"),
      icon: <FaUsersGear />,
      children: [
        {
          key: "partner/member-management/directMemberList",
          label: t("partner/menu/directMemberList"),
        },
        {
          key: "partner/member-management/directMemberDepositWithdrawal",
          label: t(`partner/menu/directMemberDepositWithdrawal`),
        },
        {
          key: "partner/member-management/entireMemberDepositWithdrawal",
          label: t(`partner/menu/entireMemberDepositWithdrawal`),
        },
        {
          key: "partner/member-management/directMemberPointsDetails",
          label: t(`partner/menu/directMemberPointsDetails`),
        },
        {
          key: "partner/member-management/integratedMoneyTransferHistory",
          label: t(`partner/menu/integratedMoneyTransferHistory`),
        },
        {
          key: "partner/member-management/connectedMember",
          label: t(`partner/menu/connectedMember`),
        },
        {
          key: "partner/member-management/waitingForMemberApproval",
          label: t(`partner/menu/waitingForMemberApproval`),
        },
      ],
    },
    {
      key: "game",
      label: t("partner/menu/game"),
      type: "group",
      style: {
        borderRadius: '10px',
        border: '1px solid #09188962',
        paddingLeft: '0px',
        paddingRight: '10px',
        marginLeft: '16px',
        marginRight: "16px",
        marginTop: '10px',
        backgroundColor:'#002140'
      },
    },
    {
      key: "partner/game/bettingstatus",
      label: t("partner/menu/bettingStatus"),
      icon: <FaFootball />,
      children: [
        {
          key: "partner/game/bettingstatus/casino",
          label: t("partner/menu/casinoStatus"),
        },
        {
          key: "partner/game/bettingstatus/slot",
          label: t("partner/menu/slotStatus"),
        },
        {
          key: "partner/game/bettingstatus/miniGame",
          label: t("partner/menu/miniGameStatus"),
        },
      ],
    },
    {
      key: "board",
      label: t("partner/menu/board"),
      type: "group",
      style: {
        borderRadius: '10px',
        border: '1px solid #09188962',
        paddingLeft: '0px',
        paddingRight: '10px',
        marginLeft: '16px',
        marginRight: "16px",
        marginTop: '10px',
        backgroundColor:'#002140'
      },
    },
    {
      key: "partner/support",
      label: t("partner/menu/customSupport"),
      icon: <BiSupport />,
      children: [
        {
          key: "partner/support/center",
          label: t("partner/menu/customServiceCenter"),
        },
        {
          key: "partner/support/sample",
          label: t("partner/menu/serviceCenterSample"),
        },
      ],
    },
    {
      key: "partner/inbox",
      label: t("partner/menu/inbox"),
      icon: <InboxOutlined />,
      children: [
        {
          key: "partner/inbox/custom",
          label: t("partner/menu/inbox"),
        },
      ],
    },
    {
      key: "partner/statistical",
      label: t("partner/menu/statistical"),
      icon: <InboxOutlined />,
      children: [
        {
          key: "partner/statistical/custom",
          label: t("partner/menu/statistical"),
        },
      ],
    },
  ];

  const profileItems: MenuProps["items"] = [
    {
      key: "myprofile",
      icon: <UserOutlined />,
      label: t(`profile`),
    },
    {
      key: "setting",
      icon: <SettingOutlined />,
      label: t(`setting`),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t(`logout`),
      onClick: onLogout,
    },
  ];

  const onThemeChange = () => {
    if (!isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setDarkTheme(!isDarkTheme);
  };
  const onMenuClick = (e: MenuInfo) => {
    setSelectedkeys(e.keyPath);
    router.push("/" + e.key);
    // router.push("/" + e.keyPath.reverse().join("/"));
  };

  // Recursive search for current item
  const findActiveMenuItem: any = (items: any[], pathname: string) => {
    for (const item of items) {
      if (item.key === pathname) {
        return item;
      }

      if (item.children) {
        const found = findActiveMenuItem(item.children, pathname);
        if (found) return found;
      }
    }

    return null;
  };

  useEffect(() => {
    api("user/me")
      .then((result) => {
        if (result.data.role === "A") {
          setAdmin(true);
          setPartner(false);
          setUser(result.data);
          // router.push(ROUTES.admin.home);
        } else if (result.data.role == "P") {
          setAdmin(false);
          setPartner(true);
          setUser(result.data);
        } else {
          setAdmin(false);
          setPartner(false);
          router.push(ROUTES.partner.login);
          notiApi.error({
            message: "Error",
            description: "You are not able to access to Partner page!",
          });
        }
        localStorage.setItem("token", result.token);
      })
      .catch(() => {
        router.push(ROUTES.partner.login);
      });
    return () => {};
  }, []);

  useEffect(() => {
    setMount(true);
    setDarkTheme(false);
    document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (currentUser?.role === "A") {
      setAdmin(true);
      setPartner(false);
    } else if (currentUser?.role === "P") {
      setAdmin(false);
      setPartner(true);
    } else {
      setAdmin(false);
      setPartner(false);
    }
  }, [currentUser]);
  useEffect(() => {
    setSelectedkeys(breadcrumbMenu);
    const d = breadcrumbMenu
      ?.map((b) => findActiveMenuItem(sideBarItems, b))
      .filter(Boolean);
    setCurrentMenuItems(d);
  }, [breadcrumbMenu, locale]);
  return mounted ? (
    <ApolloProvider client={client}>
      <ConfigProvider
        componentSize="small"
        theme={{
          token: {
            borderRadius: 0,
            motion: false,
            fontSize: 12,
          },
          components: {
            Card: {
              headerHeight: 40,
              bodyPadding: 16,
            },
          },
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        {contextHolder}

        {
          pathname.includes('/partner/popup') || pathname.includes('/partner/auth/login') ? (
            <>{children}</>
          ) : (
            <LayoutContext.Provider
          value={{ isDarkTheme, collapsed, setCollapsed }}
        >
          <Layout>
            <RouteTracker />
            {isPartner ? (
              <Sider
                className="h-screen !absolute md:!relative z-50 top-0"
                style={{
                  borderTopRightRadius: '25px',
                }}
                breakpoint="md"
                collapsedWidth="0"
                collapsed={collapsed}
                // onBreakpoint={(broken) => {
                //   console.log(broken);
                // }}
                onCollapse={(collapsed) => {
                  setCollapsed(collapsed);
                }}
              >
                <Space
                  direction="vertical"
                  className="w-full h-screen overflow-y-auto hide-scrollbar"
                  style={{
                    borderTopRightRadius: '25px',
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none', /* IE and Edge */
                  }}
                >
                  <div
                    className="h-10 justify-center items-center text-center p-6 cursor-pointer flex"
                    onClick={() => {
                      setSelectedkeys(["partner"]);
                      router.push("/partner");
                    }}
                  >
                    <Image src={Logo} height={50} className="mt-3" alt="Toto Admin" />
                  </div>

                  <div className="px-4 py-3 text-center border-b border-white/10">
                    <p className="text-xs text-white/70 uppercase tracking-wider mb-1.5">
                      {t("onlinePartner")}
                    </p>
                    <p className="text-sm text-white font-medium">
                      {currentUser.name} <span className="text-white/60">({currentUser.name})</span>
                    </p>
                  </div>
                  <p className="text-white px-6 mt-3">{t("home")}</p>
                  <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["home"]}
                    selectedKeys={selectedkeys}
                    items={sideBarItems}
                    onClick={onMenuClick}
                    defaultOpenKeys={selectedkeys}
                    className="!text-white"
                    style={{
                      marginTop: '-10px'
                    }}
                  />
                </Space>
              </Sider>
            ) : null}
            <Layout className="min-h-screen">
              {isPartner ? (
                <Header
                  className="w-full !px-2 flex !h-12 items-center !leading-10"
                  style={{ background: isDarkTheme ? "" : colorBgContainer }}
                >
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    className="!w-10 !h-10 !hidden lg:!block"
                  />
                  <Flex className="px-2 overflow-x-auto w-full">
                    <Space.Compact
                      direction="vertical"
                      className="gap-0.5 text-center"
                    >
                      <Space.Compact className="justify-center">
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/member-join', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>{t("membership")}:0</Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/member-deposit', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>
                          {t("membershipDeposit")}:0
                        </Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/member-withdraw', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>
                          {t("membershipWithdraw")}:0
                        </Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/member-support', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>
                          {t("membershipInquiry")}:0
                        </Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/rolling-conversation', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>
                          {t("rollingTransition")}:0
                        </Tag>
                        {/* <Tag className="!me-0.5 cursor-pointer">{t("nonMember")}:0</Tag> */}
                      </Space.Compact>
                      <Space.Compact className="justify-center">
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/partner-deposit', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>{t("totalDeposit")}:0</Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/partner-withdraw', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>{t("totalWithdraw")}: 0</Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/distributor-inquiry', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>
                          {t("distributorInquiry")} :0
                        </Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/total-settlement', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>{t("totalSettlement")} :0</Tag>
                      </Space.Compact>
                    </Space.Compact>
                    <Space.Compact direction="vertical" className="gap-0.5">
                      <Space.Compact className="justify-center">
                        <Tag className="!me-0.5">
                          {t("notificationLive")}:0/0
                        </Tag>
                        <Tag className="!me-0.5">
                          {t("notificationMini")}:0/0
                        </Tag>
                        <Tag className="!me-0.5">
                          {t("notificationVirtual")}:0/0
                        </Tag>
                        <Tag className="!me-0.5">
                          {t("notificationMGM")}:0/0
                        </Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/sports-bet-alert', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>
                          {t("notificationSportsLive")}:0
                        </Tag>
                        <Tag className="!me-0.5">{t("sportRebateList")}:0</Tag>
                      </Space.Compact>
                      <Space.Compact className="justify-center">
                        <Tag className="!me-0.5">
                          {t("notificationSlot")}:0/0
                        </Tag>
                        <Tag className="!me-0.5 cursor-pointer" onClick={() => window.open('/partner/popup/sports-bet-alert', '_blank', 'width=screen.width,height=screen.height,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no')}>
                          {t("notificationSport")}:0/0
                        </Tag>
                        <Tag className="!me-0.5">
                          {t("notificationLotus")}:0/0
                        </Tag>
                        <Tag className="!me-0.5">
                          {t("notificationTouch")}:0/0
                        </Tag>
                        <Tag className="!me-0.5">
                          {t("interestedMemberBetting")}:0/0
                        </Tag>
                      </Space.Compact>
                    </Space.Compact>
                  </Flex>
                  <Flex
                    align="flex-end"
                    justify="space-between"
                    className="gap-2 items-center"
                  >
                    <LangSwitcher locale={locale} />
                    <Button
                      type="text"
                      icon={isDarkTheme ? <SunOutlined /> : <MoonOutlined />}
                      onClick={onThemeChange}
                      className="!w-10 !h-10"
                    />
                    <Dropdown
                      className="flex gap-2 items-center"
                      menu={{ items: profileItems }}
                      placement="bottomRight"
                      trigger={["click"]}
                    >
                      <Button type="text" className="!h-10">
                        <Avatar icon={<UserOutlined />} className="w-8 h-8" />
                        <span className="hidden lg:block">
                          {currentUser.name}
                        </span>
                      </Button>
                    </Dropdown>
                  </Flex>
                </Header>
              ) : null}
              {isPartner ? (
                <>
                  <Breadcrumb
                    className="!p-2 shadow flex w-full items-center breadcrumb-home"
                    items={[
                      {
                        title: (
                          <Link
                            href="/partner"
                            className="flex justify-center items-center gap-2"
                          >
                            <HomeOutlined /> {t("home")}
                          </Link>
                        ),
                      },
                      ...(currentMenuItems?.map((c: any) => ({
                        title: c.label,
                      })) ?? []),
                    ]}
                  />
                </>
              ) : null}
              <Content className="p-2">{children}</Content>
            </Layout>
          </Layout>
        </LayoutContext.Provider>
          )
        }
        
      </ConfigProvider>
    </ApolloProvider>
  ) : (
    <div className="flex justify-center bg-[#0b0600] items-center h-screen">
      <Image src={Loading} alt="Toto Admin" width={70} height={70} className="animate-spin" />
    </div>
  );
}

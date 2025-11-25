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
import Loading from "@/assets/img/loading.gif";
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
      label: t("honorLink"),
      value: 0,
      color: "cyan",
    },
    {
      label: t("depositToday"),
      value: info.depositToday,
      color: "lightgreen",
    },
    {
      label: t("withdrawlToday"),
      value: info.withdrawToday,
      color: "tomato",
    },
    {
      label: t("bettingToday"),
      value: info.bettingToday,
      color: "lightgreen",
    },
    {
      label: t("todaysWinner"),
      value: info.todayWinners,
      color: "yellow",
    },
    {
      label: t("userAmount"),
      value: info.totalBalance,
      color: "tomato",
    },
    {
      label: t("userPoints"),
      value: info.totalPoints,
      color: "lightgreen",
    },
    {
      label: t("totalAmountOfDistributionReserves"),
      value: 0,
      color: "yellow",
    },
    {
      label: t("totalPoints"),
      value: info.totalPoints,
      color: "yellow",
    },
    {
      label: t("totalLoss"),
      value: info.totalLoss,
      color: "yellow",
    },
    {
      label: t("rollingTheTotal"),
      value: 0,
      color: "yellow",
    },
    {
      label: t("totalSalesLossToday"),
      value: info.totalSalesLossToday,
      color: "tomato",
    },
    {
      label: t("todaysDistributionRolling"),
      value: 0,
      color: "tomato",
    },
    {
      label: t("sportsPendingBetting"),
      value: info.sportsPendingBetting,
      color: "lightgreen",
    },

    {
      label: t("sportsRebateBetting"),
      value: info.sportsRebateBetting,
      color: "lightgreen",
    },
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
          header={t("home")}
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
      type: "group",
    },
    {
      key: "partner/accountManagement",
      label: t("partner/menu/myAccountManagement"),
      icon: <CalculatorOutlined />,
      children: [
        {
          key: "partner/accountManagement/myDepositWidthdrawal",
          label: t(`partner/menu/myDepositWidthdrawal`),
        },
        {
          key: "partner/accountManagement/rollingTransaction",
          label: t(`partner/menu/rollingTransaction`),
        },
        {
          key: "partner/accountManagement/pointConversion",
          label: t(`partner/menu/pointConversion`),
        },
        {
          key: "partner/accountManagement/settlementDetails",
          label: t(`partner/menu/settlementDetails`),
        },
        {
          key: "partner/accountManagement/moneyHistory",
          label: t(`partner/menu/moneyHistory`),
        },
        {
          key: "partner/accountManagement/pointDetails",
          label: t(`partner/menu/pointDetails`),
        },
        {
          key: "partner/accountManagement/rollingHistory",
          label: t(`partner/menu/rollingHistory`),
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
    },
    {
      key: "partner/game/bettingstatus",
      label: t("partner/menu/bettingStatus"),
      icon: <FaFootball />,
      children: [
        {
          key: "partner/game/bettingstatus/sports",
          label: t("partner/menu/bettingStatus"),
        },
      ],
    },
    {
      key: "board",
      label: t("partner/menu/board"),
      type: "group",
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
                  className="w-full h-screen overflow-y-auto"
                >
                  <div
                    className="h-10 justify-center items-center text-center p-6 cursor-pointer flex"
                    onClick={() => {
                      setSelectedkeys(["partner"]);
                      router.push("/partner");
                    }}
                  >
                    <Image src={Logo} height={40} alt="Toto Admin" />
                  </div>

                  <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["home"]}
                    selectedKeys={selectedkeys}
                    items={sideBarItems}
                    onClick={onMenuClick}
                    defaultOpenKeys={selectedkeys}
                    className="!text-white"
                  />
                </Space>
              </Sider>
            ) : null}
            <Layout className="min-h-screen">
              {isPartner ? (
                <Header
                  className="w-full !px-2 flex !h-10 items-center !leading-10"
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
                <Breadcrumb
                  className="!p-2 shadow"
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
    <div className="flex justify-center items-center h-screen">
      <Image src={Loading} alt="Toto Admin" width={100} height={100} />
    </div>
  );
}

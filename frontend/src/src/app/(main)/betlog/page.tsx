"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import html2canvas from 'html2canvas-pro';
import { useRouter } from 'next/navigation';

import {
  Layout,
  Space,
  Card,
  Table,
  Button,   
  Input,
  DatePicker,
  Radio,
  Select,
  Modal,
  Form,
  Descriptions,
  Checkbox,
} from "antd";
import type { TableProps } from "antd";

import { Content } from "antd/es/layout/layout";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQuery } from "@apollo/client";
import {
  FILTER_TRANSACTIONS,
} from "@/actions/transaction";
import { isValidDate, parseTableOptions } from "@/lib";
import api from "@/api";
import { useAtom } from "jotai";
import { userState } from "@/state/state";
import Login from "@/components/Auth/Login";

const BettingLog: React.FC = () => {
  const t = useTranslations();
  const f = useFormatter();
  const [tableOptions, setTableOptions] = useState<any>(null);
  const [selectedBetGroup, setSelectedBetGroup] = useState<string | null>(null);
  const [selectedBetGroups, setSelectedBetGroups] = useState<string[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [modal, contextHolder] = Modal.useModal();
  const [range, setRange] = useState<any[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [bets, setBets] = useState<any[]>([]);
  // const { loading, data, refetch } = useQuery(FILTER_TRANSACTIONS);
  const [colorModal, setColorModal] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    api("user/me").then((res) => {
      fetchBets(res.data.profile);
      setProfile(res.data.profile);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const fetchBets = async (profile: any) => {
    const userid = Number(profile.userId);
    const response = await api("bets/get-betting", {
      method: "POST",
      data: {
        user_id: userid,
      }
    });
    if (response.status) {
      setBets(response.data); 
    } else {
      setBets([]);
    }
  };
  
  const onTransactionTypeChange = (v: string = "") => {
    updateFilter("transactions.type", v, "eq");
  };

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: t("gameTime"),
      dataIndex: "placedAt",
      key: "placedAt",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: t("leagueName"),
      dataIndex: "Fixture",
      key: "Fixture",
      render: (value) => value?.league?.name || "-",
    },
    {
      title: t("homeTeam"),
      dataIndex: "Fixture",
      onCell: (record: any) => ({
        className: record.selection == "Under" || record.selection == "1" ? "bg-yellow-900" : ""
      }),
      key: "Fixture",
      render: (value) => value?.homeTeam?.name || "-",
    },
    {
      title: t("radish"),
      dataIndex: "radish",
      className: "text-center",
      key: "radish",
      render: (value) => value?.name || "VS",
    },
    {
      title: t("awayTeam"),
      dataIndex: "Fixture",
      key: "Fixture",
      onCell: (record: any) => ({
        className: record.selection == "Over" || record.selection == "2" ? "bg-yellow-900" : ""
      }),
      render: (value) => value?.awayTeam?.name || "-",
    },
    {
      title: t("type"),
      dataIndex: "Market",
      key: "Market",
      className: "text-center",
      render: (value) => value?.name || "-",
    },
    {
      title: t("result"),
      dataIndex: "selection",
      key: "selection",
      className: "text-center",
      render: (value) => "Home Win",
    },
    {
      title: t("periodScore"),
      dataIndex: "Fixture",
      key: "Fixture",
      render: (value) => (
        <p>{value.awayScore} : {value.homeScore}</p>
      ),
    },
    {
      title: t("matchScore"),
      dataIndex: "Fixture",
      key: "Fixture",
      render: (value) => (
        <p>{value.awayScore} : {value.homeScore}</p>
      ),
    },
    {
      title: t("allocation"),
      dataIndex: "odds",
      key: "odds",
      render: (value) => <>{value} <span>times</span></> || "-",
    },
    {
      title: t("situation"),
      dataIndex: "settledAt",
      key: "settledAt",
      render: (value) => <p className="text-green-500">Winner</p>,
    }
  ];

  const onChange: TableProps<Transaction>["onChange"] = (
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

  const [colorOption, setColorOptoin] = useState<any>("new");
  const onChangeColors = async () => {
    setColorModal(false);
  };



  const handleCaptureNoticeImage = async (betGroupId: string) => {
    const element = document.getElementById(`bet-group-${betGroupId}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#000",
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], `betting-log-${betGroupId}.png`, { type: 'image/png' });
          
          // Store the file in localStorage
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem('capturedBetImage', reader.result as string);
            // Navigate to QnA page
            router.push('/bulletin');
          };
          reader.readAsDataURL(file);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleCaptureImage = async (betGroupId: string) => {
    const element = document.getElementById(`bet-group-${betGroupId}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#000",
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], `betting-log-${betGroupId}.png`, { type: 'image/png' });
          
          // Store the file in localStorage
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem('capturedBetImage', reader.result as string);
            // Navigate to QnA page
            router.push('/qna');
          };
          reader.readAsDataURL(file);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleCaptureAllImage = async () => {
    if (selectedBetGroups.length === 0) return;

    try {
      // Create a container to hold all selected bet groups
      const container = document.createElement('div');
      container.style.backgroundColor = '#000';
      container.style.padding = '20px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '20px';
      document.body.appendChild(container);

      // Clone all selected bet groups into the container
      for (const betGroupId of selectedBetGroups) {
        const element = document.getElementById(`bet-group-${betGroupId}`);
        if (element) {
          const clone = element.cloneNode(true) as HTMLElement;
          container.appendChild(clone);
        }
      }

      // Capture the entire container
      const canvas = await html2canvas(container, {
        backgroundColor: "#000",
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], `betting-log-${new Date().getTime()}.png`, { type: 'image/png' });
          
          // Store the file in localStorage
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem('capturedBetImage', reader.result as string);
            // Navigate to QnA page
            router.push('/qna');
          };
          reader.readAsDataURL(file);
        }
      }, 'image/png');

      // Clean up the temporary container
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  const handleCaptureAllNoticeImage = async () => {
    if (selectedBetGroups.length === 0) return;

    try {
      // Create a container to hold all selected bet groups
      const container = document.createElement('div');
      container.style.backgroundColor = '#000';
      container.style.padding = '20px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '20px';
      document.body.appendChild(container);

      // Clone all selected bet groups into the container
      for (const betGroupId of selectedBetGroups) {
        const element = document.getElementById(`bet-group-${betGroupId}`);
        if (element) {
          const clone = element.cloneNode(true) as HTMLElement;
          container.appendChild(clone);
        }
      }

      // Capture the entire container
      const canvas = await html2canvas(container, {
        backgroundColor: "#000",
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
      });
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the blob
          const file = new File([blob], `betting-log-${new Date().getTime()}.png`, { type: 'image/png' });
          
          // Store the file in localStorage
          const reader = new FileReader();
          reader.onloadend = () => {
            localStorage.setItem('capturedBetImage', reader.result as string);
            // Navigate to QnA page
            router.push('/notice');
          };
          reader.readAsDataURL(file);
        }
      }, 'image/png');

      // Clean up the temporary container
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  return (
    <>
      {!profile?.userId ? (
        <Layout className="flex justify-center items-center h-[90vh]">
          <Login />
        </Layout>
       
      ) : (
        <Layout className="p-3">
          {contextHolder}
          <Content className="overflow-auto h-[calc(100vh-100px)] dark:bg-black">
            <Card
              title={t("user/menu/betlog")}
            >
              <Space className="mb-5" direction="vertical">
                <Space wrap>
                  <Radio.Group
                    size="small"
                    optionType="button"
                    buttonStyle="solid"
                    style={{ gap: '5px', display: 'flex', alignItems: 'center' }}
                    options={[
                      {
                        label: t("overseasType"),
                        value: "D",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("domesticType"),
                        value: "W",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("inPlay"),
                        value: "AP",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("realTime"),
                        value: "AR",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("special"),
                        value: "TR",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("minigame"),
                        value: "SP",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("virtualGame"),
                        value: "LR",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("touchGame"),
                        value: "R",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("lotusGame"),
                        value: "E",
                        className: "w-24 flex text-center py-1"
                      },
                      {
                        label: t("mgmGames"),
                        value: "C",
                        className: "w-24 flex text-center py-1"
                      }
                    ]}
                    defaultValue={""}
                    onChange={(e) => onTransactionTypeChange(e.target.value)}
                  />
                </Space>
              </Space>
              <div className="flex justify-end gap-1 mb-4">
                <button className="bg-gradient-to-r from-[#49aa19] to-[#237804] px-3 py-1 rounded-md text-white font-bold cursor-pointer">
                  {t("deleteAllHistory")}
                </button>
                <button onClick={() => handleCaptureAllImage()} className="bg-gradient-to-r from-[#49aa19] to-[#237804] px-3 py-1 rounded-md text-white font-bold cursor-pointer ">
                  {t("contactInquiry")}
                </button>
                <button 
                  className="bg-gradient-to-r from-[#49aa19] to-[#237804] px-3 py-1 rounded-md text-white font-bold cursor-pointer"
                  onClick={() => handleCaptureAllNoticeImage()}
                >
                  {t("writingInquiry")}
                </button>
              </div>
              {
                bets?.map((betGroup) => {
                  return (
                    <div key={betGroup.placedAt} className="" >
                      <div id={`bet-group-${betGroup.placedAt}`} >
                        <Table<Transaction>
                          columns={columns}
                          // loading={loading}
                          dataSource={betGroup.bets}
                          className="w-full text-center"
                          style={{borderTop: "1px solid rgba(255,255,255,0.2)", borderLeft: "1px solid rgba(255,255,255,0.2)", borderRight: "1px solid rgba(255,255,255,0.2)"}}
                          size="small"
                          scroll={{ x: "max-content" }}
                          onChange={onChange}
                          pagination={false}
                        />
                        <div className="flex items-center gap-2 mb-3 w-full py-1 px-1" style={{border: '1px solid rgba(255,255,255,0.2)'}}>
                          <Checkbox 
                            checked={selectedBetGroups.includes(betGroup.placedAt)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBetGroups([...selectedBetGroups, betGroup.placedAt]);
                              } else {
                                setSelectedBetGroups(selectedBetGroups.filter(id => id !== betGroup.placedAt));
                              }
                            }}
                          />
                          <p className="text-sm">{t("bettingAcceptanceTime")} {dayjs(betGroup.placedAt).format("YYYY-MM-DD HH:mm:ss")}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-1 mb-6">
                        <button className="bg-gradient-to-r from-[#49aa19] to-[#237804] px-3 py-1 rounded-md text-white font-bold cursor-pointer">
                          {t("deleteHistory")}
                        </button>
                        <button 
                          className="bg-gradient-to-r from-[#49aa19] to-[#237804] px-3 py-1 rounded-md text-white font-bold cursor-pointer"
                          onClick={() => handleCaptureImage(betGroup.placedAt)}
                          // disabled={selectedBetGroup !== betGroup.placedAt}
                        >
                          {t("contactInquiry")}
                        </button>
                        <button 
                          className="bg-gradient-to-r from-[#49aa19] to-[#237804] px-3 py-1 rounded-md text-white font-bold cursor-pointer"
                          onClick={() => handleCaptureNoticeImage(betGroup.placedAt)}
                        >
                          {t("writingInquiry")}
                        </button>
                      </div>
                    </div>
                  )
                })
              } 

              
              <Modal
                open={colorModal}
                onCancel={() => setColorModal(false)}
                onOk={onChangeColors}
              >
                <Space direction="vertical" className="gap-2">
                  <Radio.Group
                    onChange={(e) => setColorOptoin(e.target.value)}
                    className="!flex !flex-col gap-2"
                    defaultValue={"new"}
                  >
                    <Radio value={"new"}>New Search Criteria</Radio>
                    {colorOption == "new" ? (
                      <Form.Item>
                        <Input />
                      </Form.Item>
                    ) : null}
                    <Radio value={"list"}>
                      Apply the member list search conditions as is:
                    </Radio>
                    {colorOption == "list" ? (
                      <Form.Item>
                        <Select />
                      </Form.Item>
                    ) : null}
                  </Radio.Group>
                  <Form.Item label="Change Color">
                    <Select />
                  </Form.Item>
                </Space>
              </Modal>
            </Card>
          </Content>
        </Layout>
      )}
    </>
  );
};

export default BettingLog;
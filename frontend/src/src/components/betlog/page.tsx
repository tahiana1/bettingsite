"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import html2canvas from 'html2canvas-pro';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import modalImage from '@/assets/img/main/modal-head.png';

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

const BettingLog: React.FC<{checkoutModal: (modal: string) => void}> = (props) => {
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
        <div className="flex justify-center items-center h-[100vh] min-w-[400px] z-[100] bg-black">
          <Login />
        </div>
       
      ) : (
        <div className="flex justify-center items-center">
          <div className="pr-4" style={{ maxWidth: 1200, width: "100%" }}>
            {contextHolder}
            <Card
              title={
                <>
                  <h2 className="text-[#edd497] text-[40px] justify-center flex pt-10 font-bold">{t("BETTING LOG")}</h2>
                  <p className="text-white text-[16px] font-[400] justify-center pb-6 flex">{t("user/menu/betlog")}</p>
                </>
              }
              className="w-full login-card"
              classNames={{
                body: "px-6 py-6",
              }}
              styles={{
                header: {
                  backgroundImage: `url(${modalImage.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                },
                body: {
                  backgroundColor: '#160d0c',
                  borderTop: 'none',
                  padding: "0px 30px"
                }
              }}
            >
              <div className="flex w-full mb-6 bg-gradient-to-r from-[#2a1810] to-[#3e2a1f] rounded-lg overflow-hidden border border-[#5d4a3a]">
                <button
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors"
                  onClick={() => props.checkoutModal("profile")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512" ><path d="M238.6 58.1C248.4 48.9 263.6 48.9 273.4 58.1L345.6 125.0L345.6 115.2C345.6 101.0 357.0 89.6 371.2 89.6L396.8 89.6C411.0 89.6 422.4 101.0 422.4 115.2L422.4 196.4L452.6 224.5C460.3 231.7 462.9 242.8 459.0 252.6C455.2 262.3 446.0 268.8 435.2 268.8L422.4 268.8L422.4 409.6C422.4 438.6 399.4 461.6 370.4 461.6L141.6 461.6C112.6 461.6 89.6 438.6 89.6 409.6L89.6 268.8L76.8 268.8C66.0 268.8 56.8 262.3 53.0 252.6C49.1 242.8 51.7 231.7 59.4 224.5L238.6 58.1zM300.8 256.0C300.8 231.3 280.7 211.2 256.0 211.2C231.3 211.2 211.2 231.3 211.2 256.0C211.2 280.7 231.3 300.8 256.0 300.8C280.7 300.8 300.8 280.7 300.8 256.0zM166.4 396.8C166.4 403.8 172.2 409.6 179.2 409.6L332.8 409.6C339.8 409.6 345.6 403.8 345.6 396.8C345.6 361.4 317.4 332.8 282.0 332.8L230.4 332.8C195.0 332.8 166.4 361.4 166.4 396.8z"/></svg>
                  {t("profile")}
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors"
                  onClick={() => props.checkoutModal("letter")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512"  fill="white"  ><path d="M128 76.8C99.8 76.8 76.8 99.8 76.8 128L76.8 384C76.8 412.2 99.8 435.2 128 435.2L384 435.2C412.2 435.2 435.2 412.2 435.2 384L435.2 128C435.2 99.8 412.2 76.8 384 76.8L128 76.8zM244.1 265.5L163.5 217.1C157.4 213.4 153.6 206.8 153.6 199.6C153.6 188.3 162.7 179.2 174.0 179.2L337.9 179.2C349.2 179.2 358.3 188.3 358.3 199.6C358.3 206.8 354.5 213.4 348.4 217.1L267.9 265.5C264.3 267.7 260.3 268.8 256 268.8C251.7 268.8 247.7 267.7 244.1 265.5zM358.4 241.0L358.4 307.2C358.4 321.4 346.9 332.8 332.8 332.8L179.2 332.8C165.0 332.8 153.6 321.4 153.6 307.2L153.6 241.0L230.9 287.4C238.5 292.0 247.2 294.4 256 294.4C264.8 294.4 273.5 292.0 281.1 287.4L358.4 241.0z"/></svg>
                  {t("letter")}
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 text-white hover:bg-[#2a1810] transition-colors border-r border-[#5d4a3a]"
                  onClick={() => props.checkoutModal("qna")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="white" ><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>
                  {t("QNA")}
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer text-[15px] px-4 py-3 bg-[#4a3224] text-[#edd497] font-bold hover:bg-[#5a3a2a] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L274.7 256 217.4 313.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L320 301.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L365.3 256l57.4-57.4z"/></svg>
                  {t("user/menu/betlog")}
                </button>
              </div>
              <div className="mb-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Radio.Group
                    size="small"
                    optionType="button"
                    buttonStyle="solid"
                    className="flex flex-wrap gap-2"
                    options={[
                      {
                        label: t("overseasType"),
                        value: "D",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("domesticType"),
                        value: "W",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("inPlay"),
                        value: "AP",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("realTime"),
                        value: "AR",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("special"),
                        value: "TR",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("minigame"),
                        value: "SP",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("virtualGame"),
                        value: "LR",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("touchGame"),
                        value: "R",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("lotusGame"),
                        value: "E",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      },
                      {
                        label: t("mgmGames"),
                        value: "C",
                        className: "!bg-[#3e2a1f] !border-[#5d4a3a] !text-white hover:!bg-[#4a3224] hover:!border-[#edd497]"
                      }
                    ]}
                    defaultValue={""}
                    onChange={(e) => onTransactionTypeChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mb-4">
                <button className="btn-modal-auth px-4 py-2 text-sm">
                  {t("deleteAllHistory")}
                </button>
                <button onClick={() => handleCaptureAllImage()} className="btn-modal-auth px-4 py-2 text-sm">
                  {t("contactInquiry")}
                </button>
                <button 
                  className="btn-modal-auth px-4 py-2 text-sm"
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
                          className="w-full text-center custom-dark-table"
                          style={{
                            borderTop: "1px solid #5d4a3a", 
                            borderLeft: "1px solid #5d4a3a", 
                            borderRight: "1px solid #5d4a3a",
                            backgroundColor: '#2a1810'
                          }}
                          size="small"
                          scroll={{ x: "max-content" }}
                          onChange={onChange}
                          pagination={false}
                        />
                        <div className="flex items-center gap-2 mb-3 w-full py-2 px-3 bg-[#2a1810] border border-[#5d4a3a]">
                          <Checkbox 
                            checked={selectedBetGroups.includes(betGroup.placedAt)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBetGroups([...selectedBetGroups, betGroup.placedAt]);
                              } else {
                                setSelectedBetGroups(selectedBetGroups.filter(id => id !== betGroup.placedAt));
                              }
                            }}
                            className="custom-checkbox"
                          />
                          <p className="text-sm text-white">{t("bettingAcceptanceTime")} {dayjs(betGroup.placedAt).format("YYYY-MM-DD HH:mm:ss")}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mb-6">
                        <button className="btn-modal-auth px-3 py-1 text-sm">
                          {t("deleteHistory")}
                        </button>
                        <button 
                          className="btn-modal-auth px-3 py-1 text-sm"
                          onClick={() => handleCaptureImage(betGroup.placedAt)}
                          // disabled={selectedBetGroup !== betGroup.placedAt}
                        >
                          {t("contactInquiry")}
                        </button>
                        <button 
                          className="btn-modal-auth px-3 py-1 text-sm"
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
          </div>
        </div>
      )}
    </>
  );
};

export default BettingLog;
"use client";
import { useEffect, useState } from "react";

import { ConfigProvider, Layout, theme, Modal, Checkbox } from "antd";

import { ApolloProvider } from "@apollo/client";
import client from "@/api/apollo-client-ws";

import { Content } from "antd/es/layout/layout";
import WebSocketTracker from "./Common/WebSocketTracker";
import { currentTheme } from "@/state/state";
import { useAtom } from "jotai";
import Head from "./Header";
import Loading from "@/assets/img/main/loader.png";
import Image from "next/image";
import { useTranslations } from "next-intl";

function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMount] = useState<boolean>(false);
  const t = useTranslations();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [isDarkTheme] = useAtom<boolean>(currentTheme);
  const [popupsData, setPopupsData] = useState([]);
  const [closedPopups, setClosedPopups] = useState<Set<number>>(new Set());
  const [dontShowAgainPopups, setDontShowAgainPopups] = useState<Set<number>>(new Set());
  const [popupLoading, setPopupLoading] = useState(true);
  const [popupError, setPopupError] = useState<Error | null>(null);
  useEffect(() => {
    setMount(true);
    
    // Load only don't show again popups from localStorage (close button doesn't persist)
    const savedDontShowAgain = localStorage.getItem('dontShowAgainPopups');
    
    if (savedDontShowAgain) {
      const dontShowData = JSON.parse(savedDontShowAgain);
      const now = Date.now();
      const validDontShow = new Set<number>();
      
      // Check if 24 hours have passed for each popup
      Object.entries(dontShowData).forEach(([popupId, timestamp]) => {
        if (now - (timestamp as number) < 24 * 60 * 60 * 1000) {
          validDontShow.add(parseInt(popupId));
        }
      });
      
      setDontShowAgainPopups(validDontShow);
    }

    // Fetch popup data from REST API
    const fetchPopups = async () => {
      try {
        setPopupLoading(true);
        const response = await fetch('/api/v1/common/popups');
        if (!response.ok) {
          throw new Error('Failed to fetch popups');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setPopupsData(data.data);
        }
      } catch (error) {
        console.error('Error fetching popups:', error);
        setPopupError(error as Error);
      } finally {
        setPopupLoading(false);
      }
    };

    fetchPopups();
  }, []);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);


  // Handler for close button (temporary hide - no persistence)
  const handleClosePopup = (popupIndex: number) => {
    const newClosedPopups = new Set(closedPopups);
    newClosedPopups.add(popupIndex);
    setClosedPopups(newClosedPopups);
    // No localStorage persistence - popup will show again on page reload
  };

  // Handler for don't show again checkbox (24 hour persistence)
  const handleDontShowAgain = (popupIndex: number, checked: boolean) => {
    const newDontShowAgain = new Set(dontShowAgainPopups);
    
    if (checked) {
      newDontShowAgain.add(popupIndex);
      // Also add to closed popups for immediate hiding
      const newClosedPopups = new Set(closedPopups);
      newClosedPopups.add(popupIndex);
      setClosedPopups(newClosedPopups);
    } else {
      newDontShowAgain.delete(popupIndex);
    }
    
    setDontShowAgainPopups(newDontShowAgain);
    
    // Save to localStorage with timestamp for 24-hour persistence
    const dontShowData: { [key: string]: number } = {};
    newDontShowAgain.forEach(popupId => {
      dontShowData[popupId.toString()] = Date.now();
    });
    localStorage.setItem('dontShowAgainPopups', JSON.stringify(dontShowData));
  };

  return mounted ? (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 0,
          motion: false,
          fontSize: 12,
        },
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <WebSocketTracker />
      <div className="popup-container">
        {
          popupsData.map((popup: any, index:number) => {
            // Don't show popup if it's been closed or marked as don't show again
            if (closedPopups.has(index) || dontShowAgainPopups.has(index)) {
              return null;
            }
            
            return <div className="totoPopup-window" key={index}>
              <h2 className="popup-title px-4">{popup?.title}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: popup?.description
                }}
                className="popup-content max-h-[320px] overflow-y-auto px-4"
              />
              <button 
                className="popup-close-btn"
                onClick={() => handleClosePopup(index)}
              >
              <span role="img" aria-label="close" className="anticon anticon-close ant-modal-close-icon"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg></span>
              </button>
              <div className="absolute w-full bg-[rgba(0,0,0,0.9)] left-0 top-0 text-white flex items-center">
                <div className="px-4 py-[12px] gap-2 flex items-center">
                  <Checkbox 
                    className="relative bg-white w-4 h-4"
                    checked={dontShowAgainPopups.has(index)}
                    onChange={(e) => handleDontShowAgain(index, e.target.checked)}
                  /> 
                  {t("dontShowAgain")}
                </div>
               
              </div>
            </div>
          })
        }
      </div>
      
      <Head />
      <Layout hasSider={false} style={{background: 'transparent'}}>
        <Content>{children}</Content>
      </Layout>
    </ConfigProvider>
  ) : (
    <div className="flex justify-center bg-[#0b0600] items-center h-screen">
      <Image src={Loading} alt="Toto Admin" width={70} height={70} className="animate-spin" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider client={client}>
      <LayoutContent>{children}</LayoutContent>
    </ApolloProvider>
  );
}

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
import api from "@/api";

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
  const [profile, setProfile] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
  const [popupsLoaded, setPopupsLoaded] = useState<boolean>(false);

  // Fetch popups from backend API
  const fetchPopups = async (isLoggedIn: boolean) => {
    try {
      const response = await api("common/popups");
      
      if (response.success && response.data) {
        // Filter popups based on showOn field
        const filteredPopups = response.data.filter((popup: any) => {
          // Check showOn field
          if (popup.showOn === 'beforeLogin' && isLoggedIn) return false;
          if (popup.showOn === 'afterLogin' && !isLoggedIn) return false;
          // 'both' shows to everyone
          
          return true;
        });
        
        setPopupsData(filteredPopups);
        setPopupsLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching popups:", error);
      setPopupsLoaded(true);
    }
  };

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

    // Check if user is logged in FIRST, then fetch popups
    api("user/me")
      .then((res) => {
        setProfile(res.data.profile);
        setIsAuthChecked(true);
        // User is logged in - fetch popups for logged-in users
        fetchPopups(true);
      })
      .catch((err) => {
        console.log("User not logged in");
        setIsAuthChecked(true);
        // User not logged in - fetch popups for non-logged-in users
        fetchPopups(false);
      });
  }, []);

  // Refetch popups when profile changes (user logs in/out during session)
  useEffect(() => {
    if (isAuthChecked && profile !== null) {
      setPopupsLoaded(false);
      fetchPopups(!!profile?.id);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);


  // Handler for close button (temporary hide - no persistence)
  const handleClosePopup = (popupId: number) => {
    const newClosedPopups = new Set(closedPopups);
    newClosedPopups.add(popupId);
    setClosedPopups(newClosedPopups);
    // No localStorage persistence - popup will show again on page reload
  };

  // Handler for don't show again checkbox (24 hour persistence)
  const handleDontShowAgain = (popupId: number, checked: boolean) => {
    const newDontShowAgain = new Set(dontShowAgainPopups);
    
    if (checked) {
      newDontShowAgain.add(popupId);
      // Also add to closed popups for immediate hiding
      const newClosedPopups = new Set(closedPopups);
      newClosedPopups.add(popupId);
      setClosedPopups(newClosedPopups);
    } else {
      newDontShowAgain.delete(popupId);
    }
    
    setDontShowAgainPopups(newDontShowAgain);
    
    // Save to localStorage with timestamp for 24-hour persistence
    const dontShowData: { [key: string]: number } = {};
    newDontShowAgain.forEach(id => {
      dontShowData[id.toString()] = Date.now();
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
          // Only render popups after auth is checked and popups are loaded
          (isAuthChecked && popupsLoaded) && popupsData.map((popup: any, index:number) => {
            // Don't show popup if it's been closed or marked as don't show again
            if (closedPopups.has(popup.id) || dontShowAgainPopups.has(popup.id)) {
              return null;
            }
            
            // Apply width and height from database
            const popupStyle: React.CSSProperties = {};
            if (popup.width > 0) {
              popupStyle.minWidth = `${popup.width}px`;
              popupStyle.maxWidth = `${popup.width}px`;
              popupStyle.width = `${popup.width}px`;
            }
            if (popup.height > 0) {
              popupStyle.minHeight = `${popup.height}px`;
              popupStyle.maxHeight = `${popup.height}px`;
              popupStyle.height = `${popup.height}px`;
            }
            
            return <div 
              className="totoPopup-window" 
              key={popup.id}
              style={popupStyle}
            >
              <h2 className="popup-title px-4">{popup?.title}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: popup?.description
                }}
                className="popup-content overflow-y-auto px-4"
                style={{
                  maxHeight: popup.height > 0 ? `${popup.height - 100}px` : '320px',
                  minHeight: popup.height > 0 ? `${popup.height - 100}px` : 'auto'
                }}
              />
              
              <div className="absolute w-full flex pr-2 justify-between items-center bg-[rgba(0,0,0,0.9)] left-0 top-0 text-white flex items-center">
                <div className="px-4 py-[12px] gap-2 flex items-center">
                  <Checkbox 
                    className="relative bg-white w-4 h-4"
                    checked={dontShowAgainPopups.has(popup.id)}
                    onChange={(e) => handleDontShowAgain(popup.id, e.target.checked)}
                  /> 
                  {t("dontShowAgain")}
                </div>
                <button 
                  className="w-8 h-8 bg-gray-400 cursor-pointer rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  onClick={() => handleClosePopup(popup.id)}
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path 
                      d="M18 6L6 18M6 6L18 18" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
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

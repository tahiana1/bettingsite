"use client";

import api, { wsURL } from "@/api";
import { userState } from "@/state/state";
import { Badge } from "antd";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";

const WebSocketTracker: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState<number>(0);

  const [user, setUser] = useAtom<any>(userState);

  const ws = useRef<WebSocket | null>(null);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const retries = useRef(0);
  const maxRetries = 500;
  const connectStatus = ["red", "green", "yellow"];
  const connect = () => {
    cleanWS();
    if (retries.current >= maxRetries) return;

    // ws.current = new WebSocket(`${wsURL}`);
    console.log({ user });
    ws.current = new WebSocket(
      `${wsURL}${user?.id ? "/info?userId=" + user.id : ""}`
    );

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      retries.current = 0; // reset retry count
      setConnected(1);
    };

    ws.current.onmessage = (event) => {
      console.log({ event });
      try {
        const data = JSON.parse(event.data);
        data.data;
        setMessages(data);
      } catch (e) {}
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed. Reconnecting...");
      setConnected(0);
      retryReconnect();
    };

    ws.current.onerror = (err: any) => {
      console.error("WebSocket error", err);
      setConnected(0);
      retryReconnect();
    };
  };
  const cleanWS = () => {
    if (ws.current) {
      ws.current.onopen = null;
      ws.current.onmessage = null;
      ws.current.onclose = null;
      ws.current.onerror = null;
      ws.current.close();
      ws.current = null;
    }
  };
  const retryReconnect = () => {
    const delay = Math.min(1000 * 2 ** retries.current, 10000); // exponential backoff up to 10s
    retries.current += 1;
    console.log({ delay });
    retryTimeout.current = setTimeout(() => {
      connect();
    }, delay);
  };

  useEffect(() => {
    if (ws.current?.OPEN) {
      setConnected(1);
    } else {
      connect();
    }

    return () => {
      setConnected(0);
      if (ws.current) {
        ws.current.onopen = null;
        ws.current.onmessage = null;
        ws.current.onclose = null;
        ws.current.onerror = null;
        ws.current.close();
        ws.current = null;
      }
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
        retryTimeout.current = null;
      }
    };
  }, [user]);

  useEffect(() => {
    api("user/me").then((result) => {
      setUser(result.data);
      localStorage.setItem("token", result.token);
    });
  }, []);

  return (
    <Badge
      className="!fixed bottom-2 right-2"
      count={retries.current ?? messages.length}
      color={connectStatus[connected]}
      showZero
    />
  );
};

export default WebSocketTracker;

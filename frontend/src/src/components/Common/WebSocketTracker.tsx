"use client";

import api, { wsURL } from "@/api";
import { userState } from "@/state/state";
import { Badge } from "antd";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";

const WebSocketTracker: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState<number>(0);

  const [, setUser] = useAtom<any>(userState);

  const ws = useRef<WebSocket | null>(null);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const retries = useRef(0);
  const maxRetries = 500;
  const connectStatus = ["red", "green", "yellow"];
  const connect = () => {
    if (retries.current >= maxRetries) return;

    ws.current = new WebSocket(wsURL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      retries.current = 0; // reset retry count
      setConnected(1);
    };

    ws.current.onmessage = (event) => {
      console.log({ event });
      try {
        const data = JSON.parse(event.data);
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
      setConnected(2);
      ws.current?.close(); // close to trigger reconnect
    };
  };

  const retryReconnect = () => {
    const delay = Math.min(1000 * 2 ** retries.current, 10000); // exponential backoff up to 10s
    retries.current += 1;

    retryTimeout.current = setTimeout(() => {
      connect();
    }, delay);
  };

  useEffect(() => {
    if (ws.current?.OPEN || ws.current?.CONNECTING) {
      setConnected(1);
    } else {
      connect();
    }

    api("user/me", { method: "POST" })
      .then((result) => {
        setUser(result.data);
        localStorage.setItem("token", result.token);
      })
      .then((err) => {
        console.log({ err });
      });
    return () => {
      setConnected(0);
      ws.current?.close();
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
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

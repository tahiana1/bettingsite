"use client";

import { wsURL } from "@/api";
import { Button, Input, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useRef, useState } from "react";

const Index: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const retryTimeout = useRef<NodeJS.Timeout | null>(null);
  const retries = useRef(0);
  const maxRetries = 5;

  const connect = () => {
    if (retries.current >= maxRetries) return;

    ws.current = new WebSocket(wsURL);

    ws.current.onopen = () => {
      console.log("WebSocket connected");
      retries.current = 0; // reset retry count
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
      retryReconnect();
    };

    ws.current.onerror = (err: any) => {
      console.error("WebSocket error", err);
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
    } else {
      connect();
    }

    return () => {
      ws.current?.close();
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, []);

  const onSend = () => {
    ws.current?.send(text);
  };

  const onChangeText: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setText(e.target.value);
  };

  return (
    <Layout>
      <Content className="p-8">
        <Input.TextArea onChange={onChangeText}></Input.TextArea>
        <Button onClick={onSend}>Send</Button>
        <h2>Messages:</h2>
        <ul>
          {messages.map((m) => (
            <li key={m.id}>{m.sportsName}</li>
          ))}
        </ul>
      </Content>
    </Layout>
  );
};

export default Index;

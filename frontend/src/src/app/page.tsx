"use client";

import { useWebSocket } from "next-ws/client";
import React, { useEffect } from "react";

const Index: React.FC = () => {
  const [msg, setMsg] = React.useState("");
  const ws = useWebSocket(); 
  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        setMsg(event.data.toString() );
      };
    }
  }, []);
  return (
    <div className="w-full text-lg  h-96 text-center p-4">
      Index
      <div>{msg}</div>
    </div>
  );
};

export default Index;

"use client";

import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const DeviceTracker = () => {
  useEffect(() => {
    const run = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      localStorage.setItem("visitorID", visitorId);
      // Replace this URL with your actual Express backend URL or route
      //   await fetch("http://localhost:3001/api/device-log", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ visitorId }),
      //   });
    };

    run();
  }, []);

  return null;
};

export default DeviceTracker;

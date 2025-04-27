"use client";

import React from "react";
import { Provider } from "jotai";

const JotaiContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Provider>{children}</Provider>;
};

export default JotaiContextProvider;

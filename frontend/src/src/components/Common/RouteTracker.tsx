"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { breadcrumbState } from "@/state/state";
const RouteTracker = () => {
  const pathname = usePathname();
  const [, setBreadcrumb] = useAtom<string[]>(breadcrumbState);
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean); // ["admin", "financials", "deposit"]

    const cumulative: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      cumulative.push(parts.slice(0, i + 1).join("/"));
    }

    // You can add logic here (e.g. analytics, state reset, etc.)
    setBreadcrumb(cumulative);
  }, [pathname]);

  // 👇 You can put a progress bar or something here
  return <></>;
};

export default RouteTracker;

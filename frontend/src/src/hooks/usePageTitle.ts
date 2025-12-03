"use client";

import { useEffect } from "react";

/**
 * Hook to set the page title for client components
 * @param title - The title to set (will be prefixed with TOTOCLUB, Admin, or Partner based on path)
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}


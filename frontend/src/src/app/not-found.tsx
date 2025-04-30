"use client"; // Required!

import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    // Optional: log error to your monitoring service
    console.error(error);
  }, [error]);
  const goBack = () => {
    router.back();
  };
  return (
    <Result
      status="404"
      title={<h3 className="text-white ">404</h3>}
      subTitle={
        <h3 className="text-white ">
          Sorry, the page you visited does not exist.
        </h3>
      }
      extra={
        <Button type="primary" onClick={goBack}>
          Back Home
        </Button>
      }
    />
  );
}

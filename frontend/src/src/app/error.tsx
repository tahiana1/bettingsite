"use client"; // Required!

import React, { useEffect } from "react";
import { Button, Result } from "antd";

import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    // Optional: log error to your monitoring service
    console.log(error);
  }, [error]);

  const goBack = () => {
    router.back();
  };
  return (
    <Result
      status="500"
      title={<h3 className="dark:text-white ">500</h3>}
      subTitle={<h3 className="dark:text-white ">{error.message}</h3>}
      extra={
        <Button type="primary" onClick={goBack}>
          Back
        </Button>
      }
    />
  );
}

"use client"; // Required!

import React, { useEffect } from "react";
import { Button, Space, Card } from "antd";
import { HomeOutlined, ReloadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Optional: log error to your monitoring service
    console.error("Error:", error);
  }, [error]);

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0b0600" }}>
      <Card
        className="w-full max-w-2xl backdrop-blur-sm border-0 shadow-2xl"
        styles={{
          body: {
            padding: '4rem 3rem',
            background: 'linear-gradient(135deg, rgba(22, 13, 12, 0.95) 0%, rgba(26, 18, 15, 0.98) 100%)',
            border: '1px solid rgba(237, 212, 151, 0.1)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(237, 212, 151, 0.1) inset',
            textAlign: 'center',
          }
        }}
      >
        {/* Error Code */}
        <div className="mb-8">
          <h1 
            className="text-9xl font-bold mb-4"
            style={{
              fontFamily: "'Syne', sans-serif",
              background: 'linear-gradient(135deg, #edd497 0%, #e3b27f 50%, #c9a972 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(237, 212, 151, 0.3)',
            }}
          >
            500
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: '#edd497',
              fontWeight: 900,
            }}
          >
            Oops! Something went wrong
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: '#ffffff' }}>
            {error?.message || "An unexpected error occurred. Please try again later."}
          </p>
        </div>

        {/* Action Buttons */}
        <Space size="large" wrap className="justify-center">
          {reset && (
            <Button
              type="primary"
              size="large"
              icon={<ReloadOutlined />}
              onClick={reset}
              className="login-button-custom h-12 px-8 rounded-lg font-semibold shadow-lg shadow-[#edd497]/30 hover:shadow-xl hover:shadow-[#edd497]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Again
            </Button>
          )}
          <Button
            type="default"
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
            className="h-12 px-8 rounded-lg font-semibold transition-all duration-300"
            style={{
              background: 'rgba(237, 212, 151, 0.1)',
              border: '1px solid rgba(237, 212, 151, 0.3)',
              color: '#edd497',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(237, 212, 151, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(237, 212, 151, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(237, 212, 151, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(237, 212, 151, 0.3)';
            }}
          >
            Go Back
          </Button>
          <Button
            type="default"
            size="large"
            icon={<HomeOutlined />}
            onClick={goHome}
            className="h-12 px-8 rounded-lg font-semibold transition-all duration-300"
            style={{
              background: 'rgba(237, 212, 151, 0.1)',
              border: '1px solid rgba(237, 212, 151, 0.3)',
              color: '#edd497',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(237, 212, 151, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(237, 212, 151, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(237, 212, 151, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(237, 212, 151, 0.3)';
            }}
          >
            Go Home
          </Button>
        </Space>

        {/* Additional Help Text */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(237, 212, 151, 0.2)' }}>
          <p className="text-sm" style={{ color: 'rgba(237, 212, 151, 0.6)' }}>
            If this problem persists, please contact support with the error code:{" "}
            <span className="font-mono" style={{ color: 'rgba(237, 212, 151, 0.8)' }}>
              {error?.digest || "N/A"}
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}

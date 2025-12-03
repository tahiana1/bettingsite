"use client";
import Login from "@/components/Auth/Login";
import { usePageTitle } from "@/hooks/usePageTitle";

const SignIn = () => {
  usePageTitle("TOTOCLUB - Login Page");
  return (
    <div className=" flex justify-center items-center h-[100vh] min-w-[400px] z-[100] bg-black">
      <Login />
    </div>
  );
};

export default SignIn;
"use client";
import CreateUsername from "@/components/auth/register/verify-username";
import Loader from "@/components/loader";
import { parseJwt } from "@/lib/jwt";
import { JwtPayload } from "@/types/auth.types";
import { redirect } from "next/navigation";
import React from "react";

export default function Page() {
  const [payload, setPayload] = React.useState<JwtPayload>();
  React.useEffect(() => {
    const token = window?.localStorage.getItem("authToken");
    if (!token) {
      redirect("/register");
    } else {
      const data = parseJwt(token);
      if (data === null) {
        window?.localStorage.removeItem("authToken");
        redirect("/register");
      }
      setPayload(data);
    }
  }, []);
  const [isProcessing, setIsProcessing] = React.useState(false);
  if (isProcessing)
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <CreateUsername
        type="update"
        oldUsername={payload?.user.username || ""}
        email={payload?.user.email || ""}
        setIsProcessing={setIsProcessing}
      />
    </div>
  );
}

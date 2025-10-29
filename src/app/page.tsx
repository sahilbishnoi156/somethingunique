"use client";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  LANDING_PAGE_DESCRIPTION,
  LANDING_PAGE_HEADING,
} from "@/constants/sentences";
import { getRandomElement } from "@/lib/random-item";
import Link from "next/link";
import React, { useState } from "react";

const LandingPage = () => {
  const [HEADING, setHEADING] = useState("");
  const [DESCRIPTION, setDESCRIPTION] = useState("");
  const [authToken, setAuthToken] = React.useState<null | string>(null);
  React.useEffect(() => {
    setHEADING(getRandomElement(LANDING_PAGE_HEADING));
    setDESCRIPTION(getRandomElement(LANDING_PAGE_DESCRIPTION));
    const token = window?.localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center p-6">
      <div className="w-full">
        <Loader />
      </div>
      <div className="h-full sm:w-1/2 w-full flex-col flex justify-center items-center">
        <h1 className="text-3xl font-bold text-center mb-1">
          {HEADING || "..."}
        </h1>
        <p className="text-center text-primary/80">{DESCRIPTION || ""}</p>
        <div className="mt-10 flex items-center justify-center gap-5 w-full">
          {authToken ? (
            <Link href={"/app"} className="w-full">
              <Button className="w-full text-lg" variant="default">
                Continue the bullying
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col items-center justify-center sm:flex-row gap-5 w-full">
              <Link href={"/login"} className="w-full text-lg">
                <Button className="w-full" variant="default" size={"lg"}>
                  Login
                </Button>
              </Link>
              <Link href={"/register"} className="w-full">
                <Button
                  className="w-full text-lg"
                  variant="default"
                  size={"lg"}
                >
                  Register (It&apos;s Free! 🎉)
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { redirect } from "next/navigation";
import { parseJwt } from "@/lib/jwt";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { showSearch } from "@/app/store/view-slice";
import { ClubType } from "@/types/feed.types";
import { customFetch } from "@/lib/custom-fetch";
import { CLUB_COLORS } from "@/constants/clubs";
import { getRandomElement } from "@/lib/random-item";
import { Badge } from "./ui/badge";
import { JwtPayload } from "@/types/auth.types";
import { Search } from "lucide-react";
import { IDENTITIES } from "@/constants/sentences";

export default function DefaultSidebar() {
  const [payload, setPayload] = React.useState<JwtPayload>();
  const [IDENTITY, setIDENTITY] = React.useState<string>("");
  React.useEffect(() => {
    setIDENTITY(getRandomElement(IDENTITIES));
    if (window !== undefined) {
      const token = localStorage.getItem("authToken");
      if (token === "undefined" || !token) {
        redirect("/register");
      } else {
        const data = parseJwt(token);
        if (data === null) {
          window?.localStorage.removeItem("authToken");
          redirect("/register");
        }
        setPayload(data);
      }
    }
  }, []);
  const [clubs, setClubs] = React.useState<ClubType[]>([]);

  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    if (window) {
      setUrl(window.location.hostname);
    }
  }, []);

  React.useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await customFetch("/club/get-clubs", {
          method: "GET",
        });
        const data = await response.json();
        if (response?.ok) {
          const clubs = (data?.data?.data as ClubType[]) || [];
          clubs.map((club) => ({
            ...club,
            randomColor: getRandomElement(CLUB_COLORS),
          }));
          setClubs(clubs);
        } else throw new Error(data?.message || data?.data?.message);
      } catch (error) {
        console.error(error);
      }
    };
    if (!clubs.length) fetchClubs();
  }, [clubs.length]);

  const dispatch = useDispatch();
  return (
    <div className="md:p-6 p-3">
      <Link href={"/app/feed"} className="text-2xl ">
        {url === "somethingunique.vercel.app"
          ? "Something Unique"
          : url === "collegepoint.vercel.app"
          ? "College Point"
          : "Localhost"}
      </Link>
      <div className="space-y-3 flex flex-col mt-2">
        <div
          className="text-xl bg-secondary p-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-secondary/80"
          onClick={() => dispatch(showSearch())}
        >
          <Search className="h-5 w-5" />
          Search
        </div>
      </div>
      <h2 className="font-semibold text-xl mt-10">Profile</h2>
      <div className="flex items-center gap-2 mt-1">
        <Avatar>
          <AvatarImage
            src={
              payload?.user?.username || `/placeholder.svg?height=40&width=40`
            }
            alt={payload?.user.username}
          />
          <AvatarFallback>
            {payload?.user?.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={"/profile"} className="hover:underline cursor-pointer">
            <div className="text-lg font-medium">@{payload?.user.username}</div>
          </Link>
          <span className="text-xs relative bottom-1">{IDENTITY}</span>
        </div>
      </div>
      {clubs.length !== 0 && (
        <h2 className="font-semibold text-xl mt-10">Clubs</h2>
      )}
      <div className="flex flex-wrap gap-4 mt-2">
        {clubs.map((club) => {
          return (
            <Link href={"/clubs/" + club._id} key={club._id}>
              <Badge
                key={club._id}
                style={{
                  backgroundColor: club.randomColor,
                }}
                className="border text-sm font-medium py-1 text-black hover:shadow-md dark:shadow-black shadow-white transition duration-300 cursor-pointer"
              >
                {club.name}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

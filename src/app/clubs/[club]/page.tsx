"use client";
import { toggleEventPostBar } from "@/app/store/view-slice";
import BackButton from "@/components/back-button";
import CreatePost from "@/components/feed/create-post";
import PostItem from "@/components/feed/post-item";
import Loader from "@/components/loader";
import { UserToolTip } from "@/components/show-user-tooltip";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { customFetch } from "@/lib/custom-fetch";
import { parseJwt } from "@/lib/jwt";
import { JwtPayload } from "@/types/auth.types";
import { ClubType, PostType, UserType } from "@/types/feed.types";
import { X } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function Club() {
  const { club } = useParams();
  const [currClub, setCurrClub] = React.useState<ClubType>();
  const [posts, setPosts] = React.useState<PostType[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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
  const dispatch = useDispatch();
  const isClubAdmin = payload?.user?.id === (currClub?.admin as UserType)?._id;

  const [invalidClub, setInvalidClub] = React.useState(false);
  const [url, setUrl] = React.useState("");
  React.useEffect(() => {
    if (window) {
      setUrl(window.location.hostname);
    }
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await customFetch(
          `/club/get-club-posts?clubId=${club}`,
          { method: "GET" }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.message || errorData?.data || "Failed to fetch posts"
          );
        }
        const { data } = await response.json();
        setCurrClub(data?.data?.club);
        const newPosts = data?.data?.posts?.reverse() || [];
        setPosts(newPosts);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Club not found") {
            setInvalidClub(true);
          }
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [club]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (invalidClub) {
    return (
      <div className="text-center p-8 ">
        <p className="text-2xl font-semibold mb-4 ">
          Oops! Looks like this club doesn&apos;t exist
        </p>
        <Image
          alt="Club not found"
          src="/sad-anya.png"
          height={300}
          width={300}
          className=" mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="p-1 sm:p-3 h-screen w-screen overflow-x-hidden flex items-center justify-center gap-10 bg-background divide-x">
      <div className="lg:w-2/3 w-full h-full py-1 ">
        <div className="flex items-center gap-4 mb-4">
          <BackButton
            variant={"ghost"}
            className="bg-primary/10 hover:bg-primary/20"
          />
          <Link href={"/app/feed"}>
            {url === "somethingunique.vercel.app"
              ? "Something Unique"
              : url === "collegepoint.vercel.app"
              ? "College Point"
              : "Localhost"}
          </Link>
        </div>
        <div className="space-y-4 border p-4 rounded-xl bg-secondary/80">
          <div>
            <div className="flex items-end gap-1">
              <h1 className="text-3xl sm:text-4xl font-bold">
                {currClub?.name}
              </h1>
              {typeof currClub?.admin !== "string" && (
                <span className="text-xs relative bottom-1">
                  by{" "}
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href={"/profile/" + currClub?.admin.username}
                          className="flex items-start flex-col hover:underline text-blue-800"
                        >
                          @{currClub?.admin.username}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <UserToolTip user={currClub?.admin} />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              )}
            </div>
            <div className="text-xs divide-x-2 divide-primary">
              <span className="dark:text-foreground/50 text-foreground/70 font-medium pr-2">
                Since {moment(currClub?.createdAt).format("MMM")},{" "}
                {moment(currClub?.createdAt).format("YYYY")}
              </span>
              {typeof currClub?.college_id !== "string" && (
                <span className="dark:text-foreground/50 text-foreground/70 font-medium pl-2">
                  {currClub?.college_id.name}
                </span>
              )}
            </div>

            <p className="text-primary/90 text-md font-thin whitespace-pre-line mt-1">
              &ldquo;{currClub?.description}
              &rdquo;
            </p>
            {isClubAdmin && (
              <Button
                size={"sm"}
                className="lg:hidden block bg-primary/10 hover:bg-primary/20 text-primary mt-5"
                onClick={() => dispatch(toggleEventPostBar())}
              >
                Upload Activity
              </Button>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="flex items-center justify-center text-center">
            <p className="sm:text-2xl text-xl font-semibold my-4 ">
              There are no activies in this club currently.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4">Clubs Activities :</div>
            <div className="grid auto-rows-min lg:grid-cols-2 gap-4 ">
              {posts.map((post) => (
                <PostItem
                  key={post._id}
                  post={post}
                  userId={payload?.user?.id || ""}
                />
              ))}
            </div>
            <div className="text-primary/60 text-center py-2">
              That&apos;s it!
            </div>
          </>
        )}
      </div>

      {isClubAdmin && (
        <div
          className={`fixed top-0 left-0 inset-0 lg:relative lg:hover:bg-secondary/20 bg-background duration-150 flex-1 h-full lg:rounded-xl overflow-scroll scrollbar-hide`}
        >
          <Button
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
            }}
            size={"icon"}
            className="z-50"
            onClick={() => dispatch(toggleEventPostBar())}
          >
            <X />
          </Button>
          <CreatePost o_category="event" />
        </div>
      )}
    </div>
  );
}

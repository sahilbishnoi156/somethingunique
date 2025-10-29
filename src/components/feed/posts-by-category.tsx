import { customFetch } from "@/lib/custom-fetch";
import { PostCategory } from "@/types/post-category.types";
import React, { useEffect, useState } from "react";
import PostItem from "./post-item";
import Loader from "../loader";
import { getRandomElement } from "@/lib/random-item";
import { NO_POST_MESSAGES } from "@/constants/sentences";
import Image from "next/image";
import { parseJwt } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { setPosts } from "@/app/store/view-slice";
import { toast } from "sonner";
import { JwtPayload } from "@/types/auth.types";

export default function PostByCategory({
  category,
}: {
  category: PostCategory;
}) {
  const { posts } = useSelector((state: RootState) => state.view);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | {
    message: string;
    name: string;
  }>(null);
  const [payload, setPayload] = React.useState<JwtPayload>();
  const [NO_POST_MESSAGE, setNO_POST_MESSAGE] = useState("");
  const [RAN_IMAGE, setRAN_IMAGE] = useState("");
  React.useEffect(() => {
    setNO_POST_MESSAGE(getRandomElement(NO_POST_MESSAGES));
    setRAN_IMAGE(getRandomElement(["/sad-anya.png", "/sad-luffy.png"]));
    const token = window?.localStorage.getItem("authToken");
    if (!token) {
      redirect("/login");
    } else {
      const data = parseJwt(token);
      if (data === null) {
        window?.localStorage.removeItem("authToken");
        redirect("/register");
      }
      setPayload(data);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await customFetch(
          `/feed/get-by-category?category=${category}`,
          { method: "GET" }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.data || errorData.message || "Failed to fetch posts"
          );
        }
        const { data: fetchedPosts } = await response.json();
        const newPosts = fetchedPosts.data.reverse();
        dispatch(setPosts(newPosts));
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            //Ignore AbortError
            setError(error);
          }
          toast.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category, dispatch]);

  if (isLoading) {
    return (
      <div className="absolute inset-0 h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="divide-y">
      {posts.length === 0 ? (
        <div className="text-center p-8 ">
          <p className="text-2xl font-semibold mb-4 ">{NO_POST_MESSAGE}</p>
          <Image
            alt="No posts found"
            src={RAN_IMAGE}
            height={300}
            width={300}
            className=" mx-auto"
          />
        </div>
      ) : (
        posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            userId={payload?.user?.id || ""}
          />
        ))
      )}
    </div>
  );
}

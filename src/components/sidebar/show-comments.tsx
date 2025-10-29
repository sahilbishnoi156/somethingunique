"use client";

import { resetView } from "@/app/store/view-slice";
import { customFetch } from "@/lib/custom-fetch";
import { parseJwt } from "@/lib/jwt";
import { CommentType, PostType, UserType } from "@/types/feed.types";
import { MessageCircle, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import Link from "next/link";
import { JwtPayload } from "@/types/auth.types";
import Loader from "../loader";

const Comments = ({ postId }: { postId: string | null }) => {
  const dispatch = useDispatch();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currPost, setCurrPost] = useState<PostType>();
  const [currUser, setCurrUser] = useState<UserType>();
  const [fetchingDetails, setFetchingDetails] = useState(false);

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

  useEffect(() => {
    if (!postId) {
      dispatch(resetView());
      return;
    }

    const fetchComments = async () => {
      try {
        setFetchingDetails(true);
        const response = await customFetch(
          `/comments/get-comments-for-post?postId=${postId}`,
          { method: "GET" }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data?.message || data?.data?.data || "Failed to fetch comments"
          );
        }
        setComments(data.data.data.comments);
        setCurrUser(data.data.data.user);
        setCurrPost(data.data.data.post);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error((error as Error).message || "Failed to fetch comments");
      } finally {
        setFetchingDetails(false);
      }
    };

    fetchComments();
  }, [postId, dispatch]);

  const handleNewComment = useCallback(async () => {
    try {
      const response = await customFetch("/comments/add", {
        method: "POST",
        body: JSON.stringify({
          post_id: postId,
          content: newComment,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setComments((prev) => [data.data.data, ...prev]);
        setNewComment("");
      } else {
        throw new Error(
          data?.message || data?.data?.data || "Failed to add comment"
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error((error as Error).message || "Failed to add comment");
    }
  }, [postId, newComment]);

  const renderCaption = () => {
    // Update regex to capture everything after @ until a space or end of string
    const mentionRegex = /@(\S+?)(?=\s|$)/g;
    const hashtagRegex = /#(\S+?)(?=\s|$)/g;

    // Split caption into parts matching mentions and hashtags
    const parts =
      currPost?.caption.trim().split(/(@\S+?(\s|$)|#\S+?(\s|$))/g) || [];

    return parts.map((part, index) => {
      if (mentionRegex.test(part)) {
        // Extract mention text without the "@" for the profile link
        const mention = part.match(mentionRegex)?.[0].slice(1); // Remove "@"
        return (
          <Link href={"/profile/" + mention} key={index}>
            <span className="text-blue-500 cursor-pointer hover:underline">
              {part}
            </span>
          </Link>
        );
      } else if (hashtagRegex.test(part)) {
        return (
          <span key={index} className="text-blue-500 cursor-pointer">
            {part}
          </span>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  const handleDeleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await customFetch(`/comments/delete`, {
        method: "DELETE",
        body: JSON.stringify({ commentId }),
      });
      if (response.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        toast.success("Comment deleted successfully");
      } else {
        const data = await response.json();
        throw new Error(
          data?.message || data?.data?.data || "Failed to delete comment"
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error((error as Error).message || "Failed to delete comment");
    }
  }, []);

  const renderComments = useCallback(
    (comments: CommentType[]) => {
      if (comments.length === 0) {
        return (
          <div className="flex items-center justify-center h-full w-full">
            <p>No comments yet!</p>
          </div>
        );
      }
      return comments.map((comment) => (
        <Card key={comment._id} className="mb-4 p-0">
          <Link href={"/profile/" + comment?.user_id?.username}>
            <CardHeader className="flex flex-row items-center justify-between p-2">
              <div className="flex flex-row items-center justify-between gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      comment.user_id.avatar ||
                      `/placeholder.svg?height=40&width=40`
                    }
                    className="object-cover rounded-full"
                    alt={comment.user_id.username}
                  />
                  <AvatarFallback>
                    {comment.user_id.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="font-medium">
                    {comment.user_id.username}
                  </CardTitle>
                  <div>
                    <p className="text-xs text-gray-500 ">
                      {moment(comment.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
              {payload?.user.id === comment.user_id._id && (
                <CardFooter className="flex justify-end p-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              )}
            </CardHeader>
          </Link>
          <CardContent className="p-3 pt-0">
            <span>{comment.content}</span>
          </CardContent>
        </Card>
      ));
    },
    [handleDeleteComment, payload]
  );

  if (!postId) {
    return null;
  }

  if (fetchingDetails) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader />
      </div>
    );
  }
  return (
    <div className="sm:p-4 p-2 pb-10 relative h-full flex flex-col items-center justify-between w-full">
      <div className="w-full mt-2">
        <h3 className="text-2xl font-bold flex items-center gap-2 w-full">
          <MessageCircle />
          Yap Yap
        </h3>
        <Card className="border-none shadow-none w-full">
          <CardContent className="p-4 w-full border-b">
            <div className="flex gap-2 w-full items-center">
              <Avatar>
                <AvatarImage
                  src={
                    currPost?.user_id?.avatar ||
                    `/placeholder.svg?height=40&width=40`
                  }
                  className="object-cover rounded-full"
                  alt={currPost?.user_id?.username}
                />
                <AvatarFallback>
                  {currPost?.user_id?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-medium">
                  {currPost?.user_id?.username}
                </CardTitle>
                <p className="text-xs text-gray-500 ">
                  {moment(currPost?.createdAt).fromNow()}
                </p>
              </div>
            </div>
            <div className="mt-2 whitespace-pre">{renderCaption()}</div>
          </CardContent>
        </Card>
      </div>
      <div className="overflow-y-auto scrollbar-hide py-4 w-full">
        {renderComments(comments)}
      </div>
      <Card className="p-0 w-full">
        <CardContent className="p-4 flex flex-col justify-center items-end w-full">
          <div className="flex gap-2 w-full">
            <Avatar>
              <AvatarImage
                src={currUser?.avatar || `/placeholder.svg?height=40&width=40`}
                className="object-cover rounded-full"
                alt={currUser?.username}
              />
              <AvatarFallback>
                {currUser?.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What's the buzz? 🐝"
              className="mb-2"
              maxLength={300}
              minLength={3}
            />
          </div>
          <Button
            onClick={handleNewComment}
            className="self-end"
            disabled={
              !newComment ||
              newComment.length < 3 ||
              newComment.length > 300 ||
              newComment.trim().length === 0
            }
          >
            Shout It Out 🎤
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comments;

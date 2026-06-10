import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DUMMY_POSTS } from "../../utils/db/dummy";
import useAuthUser from "../../hooks/useAuthUser";

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":    return "/api/posts/all";
      case "following": return "/api/posts/following";
      case "posts":     return `/api/posts/user/${username}`;
      case "likes":     return `/api/posts/likes/${userId}`;
      default:          return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data: authUser } = useAuthUser();

  const { data: posts, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  useEffect(() => { refetch(); }, [feedType, refetch, username]);

  const isGuest = authUser?.username === "guest_demo";
  const hasRealPosts = posts && posts.length > 0;

  const displayPosts = (!isLoading && !isRefetching && !hasRealPosts && isGuest)
    ? DUMMY_POSTS
    : posts;

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && !isRefetching && !hasRealPosts && !isGuest && (
        <p className="text-center my-4" style={{ color: "#71767b", fontSize: "15px" }}>
          No posts in this tab. Switch 👻
        </p>
      )}

      {!isLoading && !isRefetching && displayPosts && displayPosts.length > 0 && (
        <div>
          {displayPosts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
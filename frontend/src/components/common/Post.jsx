import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";
import useAuthUser from "../../hooks/useAuthUser";
import LoadingSpinner from "./LoadingSpinner";
import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaTrash,
  FaRegBookmark,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FiBarChart2 } from "react-icons/fi";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const postOwner = post.user;
  const isDummyPost = post._id?.startsWith("d");
  const isLiked =
    !isDummyPost &&
    post.likes?.map((id) => id?.toString()).includes(authUser?._id?.toString());
  const isMyPost =
    !isDummyPost &&
    authUser?._id?.toString() === post.user?._id?.toString();
  const formattedDate = formatPostDate(post.createdAt);

  const initials =
    postOwner?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) =>
        oldData?.map((p) =>
          p._id === post._id ? { ...p, likes: updatedLikes } : p
        )
      );
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Comment posted");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => toast.error(err.message),
  });

  if (!authUser) return null;

  const viewCount = Math.floor(
    (post.likes?.length || 0) * 14 +
      (post.comments?.length || 0) * 8 +
      42
  );

  const handleLike = () => {
    if (isDummyPost) {
      toast("Likes are disabled in guest preview.", { icon: "👋" });
      return;
    }
    if (!isLiking) likePost();
  };

  const handleComment = () => {
    if (isDummyPost) {
      toast("Comments are disabled in guest preview.", { icon: "👋" });
      return;
    }
    if (!isCommenting) commentPost();
  };

  return (
    <>
      <article
        className="flex gap-3 px-4 py-3 cursor-pointer transition-colors duration-100"
        style={{ borderBottom: "0.5px solid #2f3336" }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#060606")}
        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Link
          to={isDummyPost ? "#" : `/profile/${postOwner?.username}`}
          className="flex-shrink-0 mt-1"
        >
          {postOwner?.profileImg ? (
            <img
              src={postOwner.profileImg}
              className="w-10 h-10 rounded-full object-cover"
              alt={postOwner.username}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "#1d9bf0" }}
            >
              {initials}
            </div>
          )}
        </Link>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1 flex-wrap">
            <Link
              to={isDummyPost ? "#" : `/profile/${postOwner?.username}`}
              className="font-bold text-[15px] hover:underline truncate max-w-[120px] sm:max-w-none"
              style={{ color: "#e7e9ea" }}
            >
              {postOwner?.fullName}
            </Link>
            <span
              className="truncate max-w-[80px] sm:max-w-none"
              style={{ color: "#71767b", fontSize: "14px" }}
            >
              @{postOwner?.username}
            </span>
            <span style={{ color: "#71767b", fontSize: "14px" }}>·</span>
            <span style={{ color: "#71767b", fontSize: "14px" }}>
              {formattedDate}
            </span>
            {isMyPost && (
              <span className="ml-auto flex-shrink-0">
                {isDeleting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FaTrash
                    className="cursor-pointer transition-colors"
                    style={{
                      color: "#71767b",
                      fontSize: "14px",
                      display: "block",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#f91880")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#71767b")
                    }
                    onClick={() => deletePost()}
                  />
                )}
              </span>
            )}
          </div>

          {post.text && (
            <p
              className="text-[15px] leading-relaxed mb-3"
              style={{ color: "#e7e9ea", wordBreak: "break-word" }}
            >
              {post.text}
            </p>
          )}

          {post.img && (
            <img
              src={post.img}
              className="w-full max-h-80 object-contain rounded-2xl mb-3"
              style={{ border: "0.5px solid #2f3336" }}
              alt="post"
            />
          )}

          <div className="flex items-center justify-between w-full max-w-xs">
            <button
              className="flex items-center gap-1 sm:gap-2 group"
              onClick={() =>
                document.getElementById(`modal_${post._id}`)?.showModal()
              }
              style={{ color: "#71767b" }}
            >
              <span className="p-1.5 sm:p-2 rounded-full group-hover:bg-[rgba(29,155,240,0.1)] transition-colors">
                <FaRegComment style={{ fontSize: "16px", display: "block" }} />
              </span>
              <span className="text-[13px] group-hover:text-[#1d9bf0] transition-colors">
                {post.comments?.length || 0}
              </span>
            </button>

            <button
              className="flex items-center gap-1 sm:gap-2 group"
              style={{ color: "#71767b" }}
            >
              <span className="p-1.5 sm:p-2 rounded-full group-hover:bg-[rgba(0,186,124,0.1)] transition-colors">
                <BiRepost style={{ fontSize: "19px", display: "block" }} />
              </span>
              <span className="text-[13px] group-hover:text-[#00ba7c] transition-colors">
                0
              </span>
            </button>

            <button
              className="flex items-center gap-1 sm:gap-2 group"
              onClick={handleLike}
              style={{ color: isLiked ? "#f91880" : "#71767b" }}
            >
              {isLiking ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span className="p-1.5 sm:p-2 rounded-full group-hover:bg-[rgba(249,24,128,0.1)] transition-colors">
                  {isLiked ? (
                    <FaHeart
                      style={{
                        fontSize: "16px",
                        color: "#f91880",
                        display: "block",
                      }}
                    />
                  ) : (
                    <FaRegHeart style={{ fontSize: "16px", display: "block" }} />
                  )}
                </span>
              )}
              <span
                className="text-[13px] transition-colors"
                style={{ color: isLiked ? "#f91880" : undefined }}
              >
                {post.likes?.length || 0}
              </span>
            </button>

            <button
              className="flex items-center gap-1 sm:gap-2 group"
              style={{ color: "#71767b" }}
            >
              <span className="p-1.5 sm:p-2 rounded-full group-hover:bg-[rgba(29,155,240,0.1)] transition-colors">
                <FiBarChart2 style={{ fontSize: "16px", display: "block" }} />
              </span>
              <span className="text-[13px] group-hover:text-[#1d9bf0] transition-colors">
                {viewCount < 1000
                  ? viewCount
                  : `${(viewCount / 1000).toFixed(1)}k`}
              </span>
            </button>

            <button className="group" style={{ color: "#71767b" }}>
              <span className="p-1.5 sm:p-2 rounded-full group-hover:bg-[rgba(29,155,240,0.1)] transition-colors">
                <FaRegBookmark style={{ fontSize: "14px", display: "block" }} />
              </span>
            </button>
          </div>
        </div>
      </article>

      <dialog id={`modal_${post._id}`} className="modal">
        <div
          className="modal-box rounded-2xl"
          style={{
            background: "#000",
            border: "0.5px solid #2f3336",
            width: "min(560px, calc(100vw - 2rem))",
            maxWidth: "560px",
          }}
        >
          <h3 className="font-bold text-lg mb-4" style={{ color: "#e7e9ea" }}>
            Comments
          </h3>
          <div className="flex flex-col gap-4 max-h-60 overflow-y-auto mb-4">
            {(!post.comments || post.comments.length === 0) && (
              <p style={{ color: "#71767b", fontSize: "14px" }}>
                No comments yet. Be the first.
              </p>
            )}
            {post.comments?.map((c) => (
              <div key={c._id} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden"
                  style={{ background: "#1d9bf0", color: "#fff" }}
                >
                  {c.user?.profileImg ? (
                    <img
                      src={c.user.profileImg}
                      className="w-full h-full rounded-full object-cover"
                      alt={c.user.username}
                    />
                  ) : (
                    c.user?.fullName?.[0]?.toUpperCase() || "?"
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: "#e7e9ea" }}>
                      {c.user?.fullName}
                    </span>
                    <span style={{ color: "#71767b", fontSize: "13px" }}>
                      @{c.user?.username}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#e7e9ea",
                      fontSize: "14px",
                      wordBreak: "break-word",
                    }}
                  >
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div
            className="flex gap-3 pt-3"
            style={{ borderTop: "0.5px solid #2f3336" }}
          >
            <textarea
              className="flex-1 resize-none rounded-xl p-3 outline-none"
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid #2f3336",
                color: "#e7e9ea",
                fontSize: "16px",
              }}
              rows={2}
              placeholder={
                isDummyPost
                  ? "Guest preview — sign up to comment"
                  : "Post your reply"
              }
              value={comment}
              onChange={(e) => !isDummyPost && setComment(e.target.value)}
              readOnly={isDummyPost}
            />
            <button
              className="self-end rounded-full px-4 py-2 text-white font-bold text-sm flex-shrink-0"
              style={{
                background: "#1d9bf0",
                border: "none",
                cursor: "pointer",
              }}
              onClick={handleComment}
            >
              {isCommenting ? <LoadingSpinner size="sm" /> : "Reply"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default Post;
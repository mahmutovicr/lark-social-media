import { useState } from "react";
import { Link } from "react-router-dom";
import { DUMMY_EXPLORE_POSTS } from "../../utils/db/dummy";
import { formatPostDate } from "../../utils/date";
import { FaRegHeart, FaRegComment } from "react-icons/fa";

const CATEGORIES = ["All", "Tech", "Culture", "Science", "Lifestyle", "Sports", "Humor"];

const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = DUMMY_EXPLORE_POSTS.filter((post) => {
    const matchesCategory =
      activeCategory === "All" ||
      post.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      search.trim() === "" ||
      post.text.toLowerCase().includes(search.toLowerCase()) ||
      post.user.username.toLowerCase().includes(search.toLowerCase()) ||
      post.user.fullName.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getInitials = (fullName) =>
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div
      className="flex-[4_4_0] min-h-screen"
      style={{ borderRight: "0.5px solid #2f3336", overflowX: "clip" }}
    >
      <div
        className="sticky top-0 z-10"
        style={{
          backdropFilter: "blur(12px)",
          background: "rgba(0,0,0,0.85)",
          borderBottom: "0.5px solid #2f3336",
        }}
      >
        <div className="px-4 pt-4 pb-3">
          <input
            type="text"
            placeholder="Search Explore"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none rounded-full px-4 py-2 text-sm"
            style={{
              background: "#202327",
              border: "1px solid #2f3336",
              color: "#e7e9ea",
              fontSize: "15px",
            }}
          />
        </div>

        <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-3 relative transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  color: active ? "#e7e9ea" : "#71767b",
                  fontWeight: active ? 700 : 400,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#080808")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {cat}
                {active && (
                  <div
                    className="absolute bottom-0 left-1/2 rounded-full"
                    style={{
                      width: "56px",
                      height: "4px",
                      background: "#1d9bf0",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p style={{ color: "#71767b", fontSize: "16px", fontWeight: 700 }}>No results</p>
          <p style={{ color: "#71767b", fontSize: "14px" }}>Try a different search or category.</p>
        </div>
      )}

      {filtered.map((post) => (
        <div
          key={post._id}
          className="px-4 py-4 transition-colors"
          style={{ borderBottom: "0.5px solid #2f3336" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#080808")}
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div className="flex gap-3">
            <Link to={`/profile/${post.user.username}`} className="flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "#1d9bf0" }}
              >
                {getInitials(post.user.fullName)}
              </div>
            </Link>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/profile/${post.user.username}`}
                  className="font-bold hover:underline"
                  style={{ color: "#e7e9ea", fontSize: "15px" }}
                >
                  {post.user.fullName}
                </Link>
                <span style={{ color: "#71767b", fontSize: "15px" }}>@{post.user.username}</span>
                <span style={{ color: "#71767b", fontSize: "15px" }}>·</span>
                <span style={{ color: "#71767b", fontSize: "15px" }}>{formatPostDate(post.createdAt)}</span>
                <span
                  className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold capitalize"
                  style={{
                    background: "rgba(29,155,240,.12)",
                    color: "#1d9bf0",
                    fontSize: "11px",
                  }}
                >
                  {post.category}
                </span>
              </div>

              <p style={{ color: "#e7e9ea", fontSize: "15px", lineHeight: 1.5, marginTop: "4px" }}>
                {post.text}
              </p>

              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-2" style={{ color: "#71767b", fontSize: "14px" }}>
                  <FaRegComment style={{ fontSize: "17px" }} />
                  <span>{post.comments.length}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: "#71767b", fontSize: "14px" }}>
                  <FaRegHeart style={{ fontSize: "17px" }} />
                  <span>{post.likes.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExplorePage;

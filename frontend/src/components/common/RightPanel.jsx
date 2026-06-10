import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useFollow from "../../hooks/useFollow";
import useAuthUser from "../../hooks/useAuthUser";
import LoadingSpinner from "./LoadingSpinner";
import { DUMMY_SUGGESTED_USERS } from "../../utils/db/dummy";

const TRENDS = [
  { cat: "Sports · Trending", topic: "#ChampionsLeague", count: "284k posts" },
  { cat: "Entertainment", topic: "#Oscars2025", count: "112k posts" },
  { cat: "Music · Trending", topic: "Taylor Swift", count: "98k posts" },
  { cat: "World news", topic: "Climate Summit", count: "67k posts" },
  { cat: "Film · Trending", topic: "#Cannes2025", count: "41k posts" },
];

const card = {
  background: "#16181c",
  borderRadius: "16px",
  padding: "14px 16px",
  marginBottom: "12px",
};

const RightPanel = () => {
  const { data: authUser } = useAuthUser();

  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch("/api/users/suggested");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong!");
      return data;
    },
  });

  const { follow, isPending } = useFollow();

  const isGuest = authUser?.username === "guest_demo";
  const hasRealUsers = suggestedUsers && suggestedUsers.length > 0;
  const displayUsers = (!isLoading && !hasRealUsers && isGuest)
    ? DUMMY_SUGGESTED_USERS
    : suggestedUsers;

  const handleFollow = (userId) => {
    if (isGuest && !hasRealUsers) {
      toast("Sign up to follow people.", { icon: "👋" });
      return;
    }
    follow(userId);
  };

  return (
    <div className="hidden lg:flex flex-col py-3" style={{ width: "280px", flexShrink: 0 }}>
      <div style={{ padding: "0 12px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#202327",
            borderRadius: "999px",
            padding: "10px 16px",
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" stroke="#71767b" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ color: "#71767b", fontSize: "15px" }}>Search</span>
        </div>
      </div>

      <div style={{ ...card, margin: "0 12px 12px" }}>
        <p style={{ fontSize: "19px", fontWeight: 800, color: "#e7e9ea", marginBottom: "12px" }}>
          Trends for you
        </p>
        {TRENDS.map((t) => (
          <div
            key={t.topic}
            style={{ padding: "10px 0", borderBottom: "0.5px solid #2f3336", cursor: "pointer" }}
          >
            <div style={{ fontSize: "12px", color: "#71767b" }}>{t.cat}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#e7e9ea", margin: "2px 0" }}>{t.topic}</div>
            <div style={{ fontSize: "12px", color: "#71767b" }}>{t.count}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card, margin: "0 12px 12px" }}>
        <p style={{ fontSize: "19px", fontWeight: 800, color: "#e7e9ea", marginBottom: "12px" }}>
          Who to follow
        </p>
        {isLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner size="sm" />
          </div>
        )}
        {!isLoading && displayUsers?.slice(0, 3).map((user) => {
          const initials = user.fullName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          return (
            <div
              key={user._id}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", borderBottom: "0.5px solid #2f3336" }}
            >
              <Link to={isGuest && !hasRealUsers ? "#" : `/profile/${user.username}`} style={{ flexShrink: 0 }}>
                {user.profileImg ? (
                  <img src={user.profileImg} style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div
                    style={{
                      width: "38px", height: "38px", borderRadius: "50%", background: "#1d9bf0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 700, color: "#fff",
                    }}
                  >
                    {initials}
                  </div>
                )}
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#e7e9ea", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.fullName}
                </div>
                <div style={{ fontSize: "13px", color: "#71767b" }}>@{user.username}</div>
              </div>
              <button
                onClick={() => handleFollow(user._id)}
                style={{
                  background: "#e7e9ea", color: "#000", border: "none", borderRadius: "999px",
                  padding: "5px 14px", fontSize: "13px", fontWeight: 700, cursor: "pointer", flexShrink: 0,
                }}
              >
                {isPending ? "..." : "Follow"}
              </button>
            </div>
          );
        })}
        {!isLoading && !displayUsers?.length && (
          <p style={{ color: "#71767b", fontSize: "14px" }}>No suggestions</p>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
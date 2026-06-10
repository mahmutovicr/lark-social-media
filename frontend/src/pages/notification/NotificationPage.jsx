import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaHeart, FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { DUMMY_NOTIFICATIONS } from "../../utils/db/dummy";
import { formatPostDate } from "../../utils/date";
import useAuthUser from "../../hooks/useAuthUser";

const TABS = ["All", "Mentions"];

const getInitials = (fullName) =>
  fullName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const getTypeConfig = (type) => {
  if (type === "like") {
    return { Icon: FaHeart, iconBg: "rgba(249,24,128,.14)", iconColor: "#f91880", actionText: "liked your post" };
  }
  return { Icon: FaUser, iconBg: "rgba(29,155,240,.14)", iconColor: "#1d9bf0", actionText: "followed you" };
};

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [guestCleared, setGuestCleared] = useState(false);
  const queryClient = useQueryClient();

  const { data: authUser } = useAuthUser();
  const isGuest = authUser?.username === "guest_demo";

  const { data: apiNotifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    enabled: !isGuest,
  });

  const { mutate: deleteAll } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Notifications cleared");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const notifications = isGuest ? (guestCleared ? [] : DUMMY_NOTIFICATIONS) : (apiNotifications || []);

  const handleClearAll = () => {
    if (isGuest) { setGuestCleared(true); toast.success("Notifications cleared"); }
    else deleteAll();
  };

  return (
    <div className="flex-[4_4_0] min-h-screen" style={{ borderRight: "0.5px solid #2f3336" }}>
      <div
        className="sticky top-0 z-10"
        style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.85)", borderBottom: "0.5px solid #2f3336" }}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#e7e9ea" }}>Notifications</span>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="p-2 rounded-full cursor-pointer transition-colors"
              style={{ color: "#71767b" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#181818")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <IoSettingsOutline style={{ fontSize: "20px" }} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow rounded-2xl w-52"
              style={{ background: "#16181c", border: "0.5px solid #2f3336" }}
            >
              <li>
                <button
                  onClick={handleClearAll}
                  style={{ color: "#e7e9ea", background: "transparent", border: "none", cursor: "pointer", padding: "8px 12px", fontSize: "14px", borderRadius: "8px", width: "100%", textAlign: "left" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#2f3336")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Clear all notifications
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex">
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 relative transition-colors"
                style={{ background: "transparent", border: "none", color: active ? "#e7e9ea" : "#71767b", fontWeight: active ? 700 : 400, fontSize: "15px", cursor: "pointer" }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#080808")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {tab}
                {active && (
                  <div
                    className="absolute bottom-0 left-1/2 rounded-full"
                    style={{ width: "56px", height: "4px", background: "#1d9bf0", transform: "translateX(-50%)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading && !isGuest && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && (notifications.length === 0 || activeTab === "Mentions") && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p style={{ color: "#e7e9ea", fontSize: "20px", fontWeight: 800 }}>Nothing to see here yet</p>
          <p style={{ color: "#71767b", fontSize: "15px", maxWidth: "300px", textAlign: "center" }}>
            {activeTab === "Mentions"
              ? "When someone mentions you, it'll show up here."
              : "Likes and follows will show up here."}
          </p>
        </div>
      )}

      {activeTab === "All" &&
        notifications.map((n) => {
          const { Icon, iconBg, iconColor, actionText } = getTypeConfig(n.type);
          return (
            <Link
              key={n._id}
              to={`/profile/${n.from.username}`}
              className="flex gap-3 px-4 py-4 transition-colors duration-100"
              style={{ borderBottom: "0.5px solid #2f3336", display: "flex", alignItems: "flex-start" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#080808")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ width: "40px", height: "40px", background: iconBg, marginTop: "2px" }}
              >
                <Icon style={{ fontSize: "19px", color: iconColor }} />
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ width: "36px", height: "36px", background: "#1d9bf0", flexShrink: 0 }}
                  >
                    {getInitials(n.from.fullName)}
                  </div>
                  <span style={{ fontSize: "14px", color: "#71767b" }}>{formatPostDate(n.createdAt)}</span>
                </div>

                <p style={{ fontSize: "15px", color: "#e7e9ea", lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700 }}>{n.from.fullName}</span>{" "}
                  <span style={{ color: "#71767b" }}>{actionText}</span>
                </p>

                {n.type === "like" && n.postText && (
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#71767b",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {n.postText}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default NotificationPage;
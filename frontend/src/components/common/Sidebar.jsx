import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  MdHomeFilled,
  MdOutlineExplore,
  MdOutlineBookmarkBorder,
} from "react-icons/md";
import {
  IoNotificationsOutline,
  IoMailOutline,
} from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import LarkLogo from "../svgs/LarkLogo";
import useAuthUser from "../../hooks/useAuthUser";

const NAV = [
  { icon: MdHomeFilled, label: "Home", to: "/" },
  { icon: MdOutlineExplore, label: "Explore", to: "/explore" },
  { icon: IoNotificationsOutline, label: "Notifications", to: "/notifications" },
  { icon: IoMailOutline, label: "Messages", to: "/messages" },
  { icon: MdOutlineBookmarkBorder, label: "Bookmarks", to: "/bookmarks" },
  { icon: FaRegUser, label: "Profile", to: "/profile" },
];

const Sidebar = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: authUser } = useAuthUser();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: () => toast.error("Logout failed"),
  });

  const initials = authUser?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <aside
      className="hidden md:flex flex-col sticky top-0 h-screen lark-sidebar"
      style={{
        width: "72px",
        minWidth: "72px",
        borderRight: "0.5px solid #2f3336",
        padding: "6px 8px",
        transition: "width 0.2s",
      }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .lark-sidebar { width: 240px !important; min-width: 240px !important; }
        }
      `}</style>

      <Link
        to="/"
        className="flex items-center gap-3 p-3 rounded-full hover:bg-[#181818] transition-colors mb-2 w-fit"
      >
        <LarkLogo size={28} />
        <span
          className="hidden lg:block"
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "20px",
            fontWeight: 900,
            color: "#e7e9ea",
            whiteSpace: "nowrap",
          }}
        >
          Lark
        </span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ icon: Icon, label, to }) => {
          const active =
            location.pathname === to ||
            (to === "/profile" && location.pathname.startsWith("/profile"));
          return (
            <Link
              key={to}
              to={to === "/profile" ? `/profile/${authUser?.username}` : to}
              className="flex items-center gap-4 p-3 rounded-full hover:bg-[#181818] transition-colors w-fit"
              style={{ color: "#e7e9ea" }}
            >
              <Icon
                style={{
                  fontSize: "24px",
                  flexShrink: 0,
                  display: "block",
                }}
              />
              <span
                className="hidden lg:block text-[18px]"
                style={{ fontWeight: active ? 700 : 400, whiteSpace: "nowrap" }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {authUser && (
          <button
            className="flex lg:hidden items-center gap-4 p-3 rounded-full hover:bg-[#181818] transition-colors w-fit"
            style={{ color: "#71767b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => logout()}
          >
            <BiLogOut style={{ fontSize: "24px", flexShrink: 0, display: "block" }} />
          </button>
        )}

        <button
          className="hidden lg:block mt-4 w-full rounded-full text-white font-bold text-[16px] py-3 px-4 transition-colors"
          style={{ background: "#1d9bf0", border: "none", cursor: "pointer" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#1a8cd8")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#1d9bf0")}
        >
          Post
        </button>
      </nav>

      {authUser && (
        <div className="hidden lg:flex items-center gap-3 p-2 rounded-full hover:bg-[#181818] transition-colors cursor-pointer mb-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden"
            style={{ background: "#1d9bf0" }}
          >
            {authUser.profileImg ? (
              <img src={authUser.profileImg} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[14px] font-bold text-[#e7e9ea] truncate">{authUser.fullName}</span>
            <span className="text-[13px] text-[#71767b]">@{authUser.username}</span>
          </div>
          <BiLogOut
            className="text-[#71767b] flex-shrink-0 cursor-pointer hover:text-white transition-colors"
            style={{ fontSize: "18px", display: "block" }}
            onClick={(e) => {
              e.stopPropagation();
              logout();
            }}
          />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdHomeFilled, MdOutlineExplore } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import useAuthUser from "../../hooks/useAuthUser";

const BottomNav = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
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

  const items = [
    { icon: MdHomeFilled, to: "/", label: "Home" },
    { icon: MdOutlineExplore, to: "/explore", label: "Explore" },
    { icon: IoNotificationsOutline, to: "/notifications", label: "Notifs" },
    { icon: FaRegUser, to: `/profile/${authUser?.username}`, label: "Profile" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex pb-safe"
      style={{
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "0.5px solid #2f3336",
      }}
    >
      {items.map(({ icon: Icon, to, label }) => {
        const active =
          location.pathname === to ||
          (label === "Profile" && location.pathname.startsWith("/profile"));
        return (
          <Link
            key={to}
            to={to}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5"
            style={{ color: active ? "#1d9bf0" : "#71767b" }}
          >
            <Icon style={{ fontSize: "24px", display: "block" }} />
            <span style={{ fontSize: "10px", fontWeight: active ? 700 : 400 }}>{label}</span>
          </Link>
        );
      })}

      <button
        className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5"
        style={{ color: "#71767b", background: "none", border: "none", cursor: "pointer" }}
        onClick={() => logout()}
      >
        <BiLogOut style={{ fontSize: "24px", display: "block" }} />
        <span style={{ fontSize: "10px", fontWeight: 400 }}>Logout</span>
      </button>
    </nav>
  );
};

export default BottomNav;
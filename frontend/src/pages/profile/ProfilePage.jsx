import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaLink } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import useAuthUser from "../../hooks/useAuthUser";
import { formatMemberSinceDate } from "../../utils/date";

const TABS = ["posts", "replies", "media", "likes"];

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { username } = useParams();

  const { follow, isPending: isFollowing } = useFollow();
  const { data: authUser } = useAuthUser();

  const { data: user, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch("/api/users/profile/" + username);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = authUser?._id === user?._id;
  const amIFollowing = authUser?.following?.includes(user?._id);
  const memberSince = user?.createdAt ? formatMemberSinceDate(user.createdAt) : "";

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (state === "coverImg") setCoverImg(reader.result);
      if (state === "profileImg") setProfileImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <div
      className="flex-[4_4_0] min-h-screen overflow-x-hidden"
      style={{ borderRight: "0.5px solid #2f3336" }}
    >
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}

      {!isLoading && !isRefetching && !user && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p style={{ fontSize: "20px", fontWeight: 800, color: "#e7e9ea" }}>
            This account does not exist
          </p>
          <p style={{ fontSize: "15px", color: "#71767b" }}>
            Try searching for another.
          </p>
        </div>
      )}

      {!isLoading && !isRefetching && user && (
        <>
          <div
            className="sticky top-0 z-10 flex items-center gap-6 px-4 py-3"
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(0,0,0,0.85)",
              borderBottom: "0.5px solid #2f3336",
            }}
          >
            <Link
              to="/"
              className="p-2 rounded-full hover:bg-[#181818] transition-colors"
            >
              <FaArrowLeft style={{ color: "#e7e9ea", fontSize: "18px" }} />
            </Link>
            <div className="min-w-0">
              <p
                className="truncate"
                style={{ fontSize: "20px", fontWeight: 800, color: "#e7e9ea" }}
              >
                {user.fullName}
              </p>
              <p style={{ fontSize: "13px", color: "#71767b" }}>
                {user.followers ? user.followers.length : 0} followers
              </p>
            </div>
          </div>

          <div className="relative group/cover">
            <div
              className="h-36 sm:h-48 w-full relative overflow-hidden cursor-pointer"
              style={{ background: "#1a1a2e" }}
              onClick={() =>
                isMyProfile && coverImgRef.current && coverImgRef.current.click()
              }
            >
              {(coverImg || user.coverImg) && (
                <img
                  src={coverImg || user.coverImg}
                  className="w-full h-full object-cover"
                  alt="cover"
                />
              )}
              {isMyProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover/cover:bg-opacity-30 transition-all duration-200">
                  <MdEdit
                    className="text-white opacity-0 group-hover/cover:opacity-100 transition-opacity"
                    style={{ fontSize: "28px" }}
                  />
                </div>
              )}
            </div>

            <input
              type="file"
              hidden
              accept="image/*"
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type="file"
              hidden
              accept="image/*"
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />

            <div
              className="absolute group/avatar cursor-pointer"
              style={{ bottom: "-48px", left: "16px" }}
              onClick={() =>
                isMyProfile && profileImgRef.current && profileImgRef.current.click()
              }
            >
              <div
                className="w-20 h-20 sm:w-[88px] sm:h-[88px] rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white relative overflow-hidden"
                style={{ border: "4px solid #000", background: "#1d9bf0" }}
              >
                {profileImg || user.profileImg ? (
                  <img
                    src={profileImg || user.profileImg}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  initials
                )}
                {isMyProfile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover/avatar:bg-opacity-40 transition-all">
                    <MdEdit
                      className="text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                      style={{ fontSize: "22px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="flex justify-end px-4 gap-2 flex-wrap"
            style={{ marginTop: "64px" }}
          >
            {isMyProfile && <EditProfileModal authUser={authUser} />}

            {!isMyProfile && (
              <button
                onClick={() => follow(user._id)}
                className="rounded-full font-bold text-[14px] px-4 py-2 transition-colors"
                style={{
                  background: amIFollowing ? "transparent" : "#e7e9ea",
                  color: amIFollowing ? "#e7e9ea" : "#000",
                  border: amIFollowing ? "1px solid #536471" : "none",
                  cursor: "pointer",
                }}
              >
                {isFollowing ? "..." : amIFollowing ? "Following" : "Follow"}
              </button>
            )}

            {(coverImg || profileImg) && (
              <button
                className="rounded-full font-bold text-white text-[14px] px-4 py-2"
                style={{ background: "#1d9bf0", border: "none", cursor: "pointer" }}
                onClick={async () => {
                  await updateProfile({ coverImg, profileImg });
                  setCoverImg(null);
                  setProfileImg(null);
                }}
              >
                {isUpdatingProfile ? "Saving..." : "Save"}
              </button>
            )}
          </div>

          <div className="px-4 mt-4 flex flex-col gap-3">
            <div className="min-w-0">
              <p
                className="truncate"
                style={{ fontSize: "20px", fontWeight: 800, color: "#e7e9ea" }}
              >
                {user.fullName}
              </p>
              <p style={{ fontSize: "15px", color: "#71767b" }}>
                {"@" + user.username}
              </p>
            </div>

            {user.bio && (
              <p
                style={{
                  fontSize: "15px",
                  color: "#e7e9ea",
                  lineHeight: 1.55,
                  wordBreak: "break-word",
                }}
              >
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {user.link && (
                <a
                  href={user.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline min-w-0 max-w-full"
                  style={{ color: "#1d9bf0", fontSize: "14px" }}
                >
                  <FaLink style={{ fontSize: "13px", flexShrink: 0 }} />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.link}
                  </span>
                </a>
              )}
              <div
                className="flex items-center gap-1"
                style={{ color: "#71767b", fontSize: "14px" }}
              >
                <IoCalendarOutline style={{ fontSize: "16px" }} />
                {memberSince}
              </div>
            </div>

            <div className="flex gap-5">
              <span style={{ fontSize: "14px", color: "#71767b" }}>
                <b style={{ color: "#e7e9ea" }}>
                  {user.following ? user.following.length : 0}
                </b>{" "}
                Following
              </span>
              <span style={{ fontSize: "14px", color: "#71767b" }}>
                <b style={{ color: "#e7e9ea" }}>
                  {user.followers ? user.followers.length : 0}
                </b>{" "}
                Followers
              </span>
            </div>
          </div>

          <div
            className="flex mt-4"
            style={{
              borderBottom: "0.5px solid #2f3336",
              borderTop: "0.5px solid #2f3336",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                className="flex-1 py-4 relative capitalize transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  color: feedType === tab ? "#e7e9ea" : "#71767b",
                  fontWeight: feedType === tab ? 700 : 400,
                  fontSize: "clamp(11px, 3vw, 15px)",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#080808")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                onClick={() => setFeedType(tab)}
              >
                {tab}
                {feedType === tab && (
                  <div
                    className="absolute bottom-0 left-1/2 rounded-full"
                    style={{
                      width: "40px",
                      height: "4px",
                      background: "#1d9bf0",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <Posts
            feedType={feedType === "likes" ? "likes" : "posts"}
            username={username}
            userId={user._id}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
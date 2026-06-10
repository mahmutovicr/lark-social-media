import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const inp = {
  background: "rgba(255,255,255,.03)",
  border: "1px solid #2f3336",
  borderRadius: "4px",
  padding: "12px 14px",
  color: "#e7e9ea",
  fontSize: "16px",
  outline: "none",
  width: "100%",
};

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        username: authUser.username || "",
        email: authUser.email || "",
        bio: authUser.bio || "",
        link: authUser.link || "",
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className="rounded-full font-bold text-[14px] px-4 py-2 transition-colors"
        style={{
          background: "transparent",
          border: "1px solid #536471",
          color: "#e7e9ea",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Edit profile
      </button>

      <dialog id="edit_profile_modal" className="modal">
        <div
          className="modal-box rounded-2xl"
          style={{
            background: "#000",
            border: "0.5px solid #2f3336",
            width: "min(560px, calc(100vw - 2rem))",
            maxWidth: "560px",
          }}
        >
          <h3 className="font-bold text-xl mb-5" style={{ color: "#e7e9ea" }}>
            Edit profile
          </h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label style={{ color: "#71767b", fontSize: "13px" }}>Full name</label>
                <input
                  style={inp}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label style={{ color: "#71767b", fontSize: "13px" }}>Username</label>
                <input
                  style={inp}
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ color: "#71767b", fontSize: "13px" }}>Email</label>
              <input
                style={inp}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ color: "#71767b", fontSize: "13px" }}>Bio</label>
              <textarea
                style={{ ...inp, resize: "none", height: "80px" }}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label style={{ color: "#71767b", fontSize: "13px" }}>Website</label>
              <input
                style={inp}
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
              />
            </div>

            <div className="pt-3" style={{ borderTop: "0.5px solid #2f3336" }}>
              <p style={{ color: "#71767b", fontSize: "13px", marginBottom: "12px" }}>
                Change password
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  style={inp}
                  type="password"
                  name="currentPassword"
                  placeholder="Current password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
                <input
                  style={inp}
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-full font-bold py-3 mt-2"
              style={{ background: "#e7e9ea", color: "#000", border: "none", cursor: "pointer" }}
            >
              {isUpdatingProfile ? <LoadingSpinner size="sm" /> : "Save"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
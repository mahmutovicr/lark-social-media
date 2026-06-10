import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useAuthUser from "../../hooks/useAuthUser";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const { data: authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const initials = authUser?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { mutate: createPost, isPending, isError, error } = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, img }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const iconBtn = {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1d9bf0",
    cursor: "pointer",
    border: "none",
    background: "transparent",
  };

  return (
    <div
      className="flex gap-3 p-4"
      style={{ borderBottom: "0.5px solid #2f3336" }}
    >
      <div className="flex-shrink-0 mt-1">
        {authUser?.profileImg ? (
          <img src={authUser.profileImg} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "#1d9bf0" }}
          >
            {initials}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <textarea
          className="w-full resize-none bg-transparent outline-none text-[19px] placeholder-[#71767b] mt-2"
          style={{ color: "#e7e9ea", minHeight: "52px" }}
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />

        {img && (
          <div className="relative w-full max-w-xs mx-auto">
            <IoCloseSharp
              className="absolute top-2 right-2 text-white rounded-full p-0.5 cursor-pointer"
              style={{ background: "rgba(0,0,0,.6)", fontSize: "22px" }}
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img src={img} className="w-full h-72 object-contain rounded-2xl" />
          </div>
        )}

        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "0.5px solid #2f3336" }}
        >
          <div className="flex gap-1">
            <button
              style={iconBtn}
              onClick={() => imgRef.current.click()}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(29,155,240,.1)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <CiImageOn style={{ fontSize: "20px" }} />
            </button>
            <button
              style={iconBtn}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(29,155,240,.1)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <BsEmojiSmileFill style={{ fontSize: "17px" }} />
            </button>
            <button
              style={iconBtn}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(29,155,240,.1)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <MdOutlineLocationOn style={{ fontSize: "20px" }} />
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />

          <button
            disabled={!text.trim() && !img}
            onClick={() => createPost({ text, img })}
            className="rounded-full text-white font-bold text-[14px] px-4 py-2 transition-colors"
            style={{
              background: text.trim() || img ? "#1d9bf0" : "#0f6da0",
              border: "none",
              cursor: text.trim() || img ? "pointer" : "not-allowed",
              opacity: text.trim() || img ? 1 : 0.6,
            }}
          >
            {isPending ? <LoadingSpinner size="sm" /> : "Post"}
          </button>
        </div>

        {isError && (
          <p className="text-red-500 text-sm">{error.message}</p>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div
      className="flex-[4_4_0] min-h-screen"
      style={{ borderRight: "0.5px solid #2f3336" }}
    >
      <div
        className="sticky top-0 z-10"
        style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.85)", borderBottom: "0.5px solid #2f3336" }}
      >
        <div
          className="px-4 pt-3 pb-0"
          style={{ fontSize: "20px", fontWeight: 800, color: "#e7e9ea" }}
        >
          Home
        </div>
        <div className="flex">
          {["forYou", "following"].map((type) => (
            <button
              key={type}
              className="flex-1 py-4 relative transition-colors duration-200 font-medium"
              style={{
                background: "transparent",
                border: "none",
                color: feedType === type ? "#e7e9ea" : "#71767b",
                fontWeight: feedType === type ? 700 : 400,
                fontSize: "15px",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#080808")}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              onClick={() => setFeedType(type)}
            >
              {type === "forYou" ? "For you" : "Following"}
              {feedType === type && (
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
          ))}
        </div>
      </div>

      <CreatePost />
      <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;
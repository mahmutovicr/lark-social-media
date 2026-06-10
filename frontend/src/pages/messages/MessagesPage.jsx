import { useState } from "react";
import { DUMMY_CONVERSATIONS } from "../../utils/db/dummy";
import { formatPostDate } from "../../utils/date";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-hot-toast";
import useAuthUser from "../../hooks/useAuthUser";

const getInitials = (fullName) =>
  fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const getLastMessage = (conv) => conv.messages[conv.messages.length - 1];

const ConvList = ({ selectedId, onSelect }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
    <div
      className="sticky top-0 z-10 px-4 py-4"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(0,0,0,0.85)",
        borderBottom: "0.5px solid #2f3336",
      }}
    >
      <span style={{ fontSize: "20px", fontWeight: 800, color: "#e7e9ea" }}>Messages</span>
    </div>

    <div style={{ overflowY: "auto", flex: 1 }}>
      {DUMMY_CONVERSATIONS.map((conv) => {
        const last = getLastMessage(conv);
        const isActive = selectedId === conv._id;
        return (
          <button
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
            style={{
              background: isActive ? "#080808" : "transparent",
              border: "none",
              borderBottom: "0.5px solid #2f3336",
              cursor: "pointer",
            }}
            onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = "#060606"; }}
            onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "#1d9bf0" }}
            >
              {getInitials(conv.partner.fullName)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#e7e9ea" }}>
                  {conv.partner.fullName}
                </span>
                <span style={{ fontSize: "12px", color: "#71767b", flexShrink: 0, marginLeft: "8px" }}>
                  {formatPostDate(last.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: "14px",
                    color: conv.unreadCount > 0 ? "#e7e9ea" : "#71767b",
                    fontWeight: conv.unreadCount > 0 ? 600 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "160px",
                  }}
                >
                  {last.fromMe ? `You: ${last.text}` : last.text}
                </span>
                {conv.unreadCount > 0 && (
                  <span
                    className="flex-shrink-0 flex items-center justify-center text-white text-xs font-bold rounded-full"
                    style={{
                      background: "#1d9bf0",
                      width: "18px",
                      height: "18px",
                      fontSize: "11px",
                      marginLeft: "8px",
                    }}
                  >
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const ChatView = ({ conv, isGuest, onBack }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100vh", flex: 1 }}>
    <div
      className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(0,0,0,0.85)",
        borderBottom: "0.5px solid #2f3336",
        flexShrink: 0,
      }}
    >
      <button
        className="md:hidden p-1 rounded-full"
        style={{ background: "transparent", border: "none", cursor: "pointer", color: "#e7e9ea" }}
        onClick={onBack}
      >
        <IoArrowBack style={{ fontSize: "22px" }} />
      </button>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
        style={{ background: "#1d9bf0" }}
      >
        {getInitials(conv.partner.fullName)}
      </div>
      <div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#e7e9ea" }}>
          {conv.partner.fullName}
        </div>
        <div style={{ fontSize: "13px", color: "#71767b" }}>@{conv.partner.username}</div>
      </div>
    </div>

    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {conv.messages.map((msg) => (
        <div
          key={msg._id}
          style={{
            display: "flex",
            justifyContent: msg.fromMe ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "72%",
              padding: "10px 14px",
              borderRadius: msg.fromMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.fromMe ? "#1d9bf0" : "#2f3336",
              color: "#e7e9ea",
              fontSize: "15px",
              lineHeight: 1.45,
              wordBreak: "break-word",
            }}
          >
            {msg.text}
            <div
              style={{
                fontSize: "11px",
                color: msg.fromMe ? "rgba(255,255,255,.65)" : "#71767b",
                marginTop: "4px",
                textAlign: "right",
              }}
            >
              {formatPostDate(msg.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ flexShrink: 0, borderTop: "0.5px solid #2f3336", padding: "12px 16px" }}>
      {isGuest ? (
        <div
          style={{
            background: "rgba(29,155,240,.07)",
            border: "0.5px solid rgba(29,155,240,.2)",
            borderRadius: "12px",
            padding: "12px 16px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#71767b", fontSize: "14px", marginBottom: "4px" }}>
            Messages are disabled in guest preview.
          </p>
          <p style={{ color: "#1d9bf0", fontSize: "13px", fontWeight: 600 }}>
            Sign up to send messages.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
          <textarea
            className="flex-1 resize-none rounded-2xl outline-none"
            style={{
              background: "#202327",
              border: "1px solid #2f3336",
              color: "#e7e9ea",
              fontSize: "15px",
              padding: "10px 14px",
              minHeight: "42px",
              maxHeight: "120px",
            }}
            placeholder="Start a new message"
            rows={1}
            onClick={() => toast("Messages are disabled in guest preview.", { icon: "👋" })}
            readOnly
          />
          <button
            style={{
              background: "#1d9bf0",
              border: "none",
              borderRadius: "999px",
              padding: "9px 18px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  </div>
);

const MessagesPage = () => {
  const [selectedId, setSelectedId] = useState(DUMMY_CONVERSATIONS[0]._id);
  const [mobileView, setMobileView] = useState("list");

  const { data: authUser } = useAuthUser();
  const isGuest = authUser?.username === "guest_demo";

  const selectedConv = DUMMY_CONVERSATIONS.find((c) => c._id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setMobileView("chat");
  };

  return (
    <div className="flex flex-1" style={{ minWidth: 0, minHeight: "100vh" }}>
      {/*
        Desktop (md+): oba panela uvijek vidljiva
        Mobile: samo aktivni panel
        Kontrola isključivo Tailwind klasama — bez inline display styla
      */}
      <div
        className={`${mobileView === "chat" ? "hidden md:flex" : "flex"} flex-col`}
        style={{ width: "280px", minWidth: "280px", borderRight: "0.5px solid #2f3336" }}
      >
        <ConvList selectedId={selectedId} onSelect={handleSelect} />
      </div>

      <div
        className={`${mobileView === "list" ? "hidden md:flex" : "flex"} flex-1 flex-col`}
      >
        <ChatView
          conv={selectedConv}
          isGuest={isGuest}
          onBack={() => setMobileView("list")}
        />
      </div>
    </div>
  );
};

export default MessagesPage;
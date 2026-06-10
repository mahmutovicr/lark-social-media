import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const queryClient = useQueryClient();

  const inkTrailRef = useRef(null);
  const birdBodyRef = useRef(null);
  const wingLineRef = useRef(null);
  const birdGroupRef = useRef(null);

  useEffect(() => {
    const drawPath = (el, delay, dur, ease) => {
      if (!el) return;
      try {
        const L = el.getTotalLength();
        el.style.strokeDasharray = L;
        el.style.strokeDashoffset = L;
        return setTimeout(() => {
          el.style.transition = `stroke-dashoffset ${dur}ms ${ease}`;
          el.style.strokeDashoffset = "0";
        }, delay);
      } catch {}
    };

    const timers = [
      drawPath(inkTrailRef.current, 3500, 650, "ease-in"),
      drawPath(birdBodyRef.current, 4000, 1800, "ease-out"),
      drawPath(wingLineRef.current, 5600, 420, "ease-out"),
    ];
    const t1 = setTimeout(() => {
      if (birdGroupRef.current) birdGroupRef.current.style.opacity = "1";
    }, 3500);

    return () => {
      timers.forEach((t) => t && clearTimeout(t));
      clearTimeout(t1);
    };
  }, []);

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const { mutate: guestMutation, isPending: isGuestPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSubmit = (e) => { e.preventDefault(); loginMutation(formData); };
  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.09)",
    borderRadius: "6px",
    padding: "14px 16px",
    color: "#e7e9ea",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "16px",
    outline: "none",
    width: "100%",
  };

  const btnPrimaryStyle = {
    width: "100%",
    background: "#1d9bf0",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    padding: "14px",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div className="lark-login-root">
      <div className="lark-anim-panel">
        <svg
          viewBox="0 0 320 520"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <rect width="320" height="520" fill="#000" />
          <ellipse cx="160" cy="480" rx="140" ry="80" fill="rgba(29,155,240,.04)" />

          <g id="iw" style={{ opacity: 0 }}>
            <ellipse cx="0" cy="52" rx="42" ry="7" fill="rgba(0,0,0,.38)" />
            <path d="M-38-22 C-37-2-34 18-31 32 Q-24 46 0 46 Q24 46 31 32 C34 18 37-2 38-22Z" fill="#040a14" stroke="#162030" strokeWidth="1.2" />
            <ellipse cx="0" cy="-22" rx="38" ry="13" fill="#040a14" stroke="#162030" strokeWidth="1.2" />
            <ellipse cx="0" cy="-22" rx="32" ry="9" fill="#030710" />
            <ellipse cx="-9" cy="-25" rx="11" ry="3" fill="rgba(29,155,240,.13)" />
            <ellipse cx="-5" cy="-23" rx="4.5" ry="1.2" fill="rgba(29,155,240,.19)" />
            <path d="M-37-7 Q0 0 37-7" fill="none" stroke="#162030" strokeWidth=".9" opacity=".7" />
            <path d="M-35 6 Q0 13 35 6" fill="none" stroke="#0f1a28" strokeWidth=".8" opacity=".5" />
            <path d="M-36-7 Q-35-19-29-28" stroke="rgba(255,255,255,.05)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M-22 18 C-22.5 25-23 32-23.5 36" stroke="rgba(29,155,240,.2)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M16 20 C16 27 15.5 33 15 37" stroke="rgba(29,155,240,.13)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <ellipse cx="-9" cy="55" rx="3.2" ry=".9" fill="#1d9bf0" opacity=".14" />
            <ellipse cx="13" cy="57" rx="2.2" ry=".7" fill="#1d9bf0" opacity=".1" />
            <ellipse cx="-20" cy="58" rx="1.7" ry=".5" fill="#1d9bf0" opacity=".08" />
          </g>

          <g id="qu" style={{ opacity: 0 }}>
            <path d="M0 0 C3-10 11-35 16-68 C20-96 21-127 17-157 C12-178 5-194 0-202 C-5-194-12-178-17-157 C-21-127-20-96-16-68 C-11-35-3-10 0 0Z" fill="rgba(4,9,18,.9)" />
            <path d="M0 0 C4-16 13-46 19-83 C23-111 23-142 15-172 C9-187 3-198 0-202" fill="none" stroke="rgba(155,188,215,.44)" strokeWidth="1.1" />
            <path d="M0 0 C-4-16-13-46-19-83 C-23-111-23-142-15-172 C-9-187-3-198 0-202" fill="none" stroke="rgba(155,188,215,.44)" strokeWidth="1.1" />
            {[[-14,8],[-25,11],[-36,13],[-47,15],[-58,17],[-69,18],[-80,18],[-91,17],[-102,16],[-113,14],[-124,13],[-135,11],[-146,10],[-157,8],[-166,6]].map(([y, x]) => (
              <g key={y} fill="none" stroke="rgba(132,168,200,.34)" strokeWidth=".6">
                <line x1="0" y1={y} x2={x} y2={y} />
                <line x1="0" y1={y} x2={-x} y2={y} />
              </g>
            ))}
            <path d="M0 0 C-.5-62-1-132 0-202" stroke="rgba(202,220,240,.66)" strokeWidth="1.4" fill="none" />
            <path d="M-2.8-8 Q-1.4-4 0 0" stroke="rgba(175,200,226,.46)" strokeWidth="1.7" fill="none" strokeLinecap="round" />
            <path d="M2.8-8 Q1.4-4 0 0" stroke="rgba(175,200,226,.3)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M-2.5-6 C-1.2-3 0 0 1.2-3 C2.5-6 2-11 0-14 C-2-11-2.5-8-2.5-6Z" fill="#1d9bf0" opacity=".9" />
            <ellipse cx="0" cy="1.5" rx="2" ry="1.5" fill="#1d9bf0" opacity=".45" />
          </g>

          <path
            ref={inkTrailRef}
            d="M160 421 C158 400 147 370 134 343 C118 311 100 276 79 263"
            fill="none"
            stroke="rgba(29,155,240,.26)"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          <g ref={birdGroupRef} style={{ opacity: 0 }}>
            <path
              ref={birdBodyRef}
              d="M79 263 C87 228 129 186 185 158 C213 144 241 137 241 137 C241 137 227 172 206 200 C178 228 143 242 94 263Z"
              fill="rgba(29,155,240,.07)"
              stroke="#1d9bf0"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <path
              ref={wingLineRef}
              d="M94 263 L143 207"
              fill="none"
              stroke="rgba(255,255,255,.86)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <div className="lark-login-form-panel">
        <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="lfi" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <path d="M6 27 C7 22 13 15 21 11 C25 9 29 8 29 8 C29 8 27 13 24 17 C20 22 15 23 8 27 Z" fill="#1d9bf0" />
              <line x1="8" y1="27" x2="15" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "22px", fontWeight: 900, color: "#e7e9ea" }}>
              Lark
            </span>
          </div>

          <h1 className="lfi" style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "30px", fontWeight: 700, color: "#e7e9ea", lineHeight: 1.2, margin: 0 }}>
            Sign in to Lark
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              className="lfi"
              type="text"
              name="username"
              placeholder="Phone, email or username"
              value={formData.username}
              onChange={handleInput}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(29,155,240,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
            />
            <input
              className="lfi"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInput}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(29,155,240,.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
            />

            <button
              className="lfi"
              type="submit"
              style={{ ...btnPrimaryStyle, marginTop: "4px" }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#1a8cd8")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#1d9bf0")}
            >
              {isPending ? "Logging in..." : "Log in"}
            </button>

            <button
              className="lfi"
              type="button"
              onClick={() => guestMutation()}
              disabled={isGuestPending}
              style={btnPrimaryStyle}
              onMouseOver={(e) => (e.currentTarget.style.background = "#1a8cd8")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#1d9bf0")}
            >
              {isGuestPending ? "Loading..." : "Try Now"}
            </button>

            {isError && (
              <p style={{ color: "#f4212e", fontSize: "14px", textAlign: "center", margin: 0 }}>{error.message}</p>
            )}

            <div className="lfi" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#536471", fontSize: "13px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,.08)" }} />
              or
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,.08)" }} />
            </div>

            <Link to="/signup" className="lfi">
              <button
                type="button"
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "#e7e9ea",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: "999px",
                  padding: "13px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.04)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Create account
              </button>
            </Link>

            <div className="lfi" style={{ textAlign: "center" }}>
              <span style={{ color: "#1d9bf0", fontSize: "14px", cursor: "pointer" }}>
                Forgot password?
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

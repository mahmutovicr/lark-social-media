import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LarkLogo from "../../../components/svgs/LarkLogo";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, fullName, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");
      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const inputStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.09)",
    borderRadius: "6px",
    padding: "12px 14px",
    color: "#e7e9ea",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="flex min-h-screen w-full bg-black overflow-auto items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6 py-12">
        <div className="flex items-center gap-3">
          <LarkLogo size={32} />
          <span
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "21px",
              fontWeight: 900,
              color: "#e7e9ea",
            }}
          >
            Lark
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "26px",
            fontWeight: 700,
            color: "#e7e9ea",
            lineHeight: 1.2,
          }}
        >
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={(e) => (e.target.style.borderColor = "rgba(29,155,240,.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              style={inputStyle}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              onFocus={(e) => (e.target.style.borderColor = "rgba(29,155,240,.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
            />
            <input
              style={inputStyle}
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleInputChange}
              onFocus={(e) => (e.target.style.borderColor = "rgba(29,155,240,.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
            />
          </div>
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            onFocus={(e) => (e.target.style.borderColor = "rgba(29,155,240,.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,.09)")}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#1d9bf0",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "12px",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isPending ? "Creating account..." : "Create account"}
          </button>

          {isError && (
            <p className="text-red-500 text-sm text-center">{error.message}</p>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#536471",
              fontSize: "12px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,.07)" }} />
            Already have an account?
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,.07)" }} />
          </div>

          <Link to="/login">
            <button
              type="button"
              style={{
                width: "100%",
                background: "transparent",
                color: "#e7e9ea",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: "999px",
                padding: "11px",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign in
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
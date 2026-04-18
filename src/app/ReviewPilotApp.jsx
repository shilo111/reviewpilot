"use client";
import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import AuthScreen from "./AuthScreen";
import Dashboard from "./Dashboard";

export default function ReviewPilotApp() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rp_user");
      if (saved) { setUser(JSON.parse(saved)); setScreen("dashboard"); }
    } catch {}
  }, []);

  const handleLogin = (userData) => {
    const u = { ...userData, plan: "Pro", planPrice: 149 };
    setUser(u);
    try { localStorage.setItem("rp_user", JSON.stringify(u)); } catch {}
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    try { localStorage.removeItem("rp_user"); } catch {}
    setScreen("landing");
  };

  if (screen === "landing") return <LandingPage onSignup={() => setScreen("signup")} onLogin={() => setScreen("login")}/>;
  if (screen === "login")   return <AuthScreen defaultMode="login"  onSuccess={handleLogin} onBack={() => setScreen("landing")}/>;
  if (screen === "signup")  return <AuthScreen defaultMode="signup" onSuccess={handleLogin} onBack={() => setScreen("landing")}/>;
  if (screen === "dashboard") return <Dashboard user={user} onLogout={handleLogout}/>;
  return null;
}

"use client";
import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import AuthScreen from "./AuthScreen";
import Dashboard from "./Dashboard";
import PlanSelect from "./PlanSelect";

export default function ReviewPilotApp() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [suggestedPlan, setSuggestedPlan] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rp_user");
      if (saved) { setUser(JSON.parse(saved)); setScreen("dashboard"); }
    } catch {}
  }, []);

  const handleSignup = (plan = null) => {
    setSuggestedPlan(plan);
    setScreen("signup");
  };

  const handleAuthSuccess = (userData) => {
    if (userData.isNew) {
      setPendingUser(userData);
      setScreen("planselect");
    } else {
      const u = { ...userData, plan: "Basic", planPrice: 79 };
      setUser(u);
      try { localStorage.setItem("rp_user", JSON.stringify(u)); } catch {}
      setScreen("dashboard");
    }
  };

  const handlePlanSelect = (plan, price) => {
    const u = { ...pendingUser, plan, planPrice: price };
    setUser(u);
    try { localStorage.setItem("rp_user", JSON.stringify(u)); } catch {}
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setPendingUser(null);
    setSuggestedPlan(null);
    try { localStorage.removeItem("rp_user"); } catch {}
    setScreen("landing");
  };

  if (screen === "landing")    return <LandingPage onSignup={handleSignup} onLogin={() => setScreen("login")}/>;
  if (screen === "login")      return <AuthScreen defaultMode="login"  onSuccess={handleAuthSuccess} onBack={() => setScreen("landing")}/>;
  if (screen === "signup")     return <AuthScreen defaultMode="signup" onSuccess={handleAuthSuccess} onBack={() => setScreen("landing")}/>;
  if (screen === "planselect") return <PlanSelect onSelect={handlePlanSelect} suggestedPlan={suggestedPlan}/>;
  if (screen === "dashboard")  return <Dashboard user={user} onLogout={handleLogout} isNew={!!pendingUser}/>;
  return null;
}

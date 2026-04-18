"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthScreen({ onSuccess, onBack, defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("form");

  const handleSubmit = async () => {
    if (!email || !password) { setError("נא למלא את כל השדות"); return; }
    if (mode === "signup" && !name) { setError("נא להכניס שם"); return; }
    if (password.length < 6) { setError("הסיסמה חייבת להיות לפחות 6 תווים"); return; }

    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (signUpError) {
        setError(signUpError.message === "User already registered" ? "כתובת האימייל הזו כבר רשומה" : signUpError.message);
        setLoading(false);
        return;
      }
      setStep("verify");
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("אימייל או סיסמה שגויים");
        setLoading(false);
        return;
      }
      onSuccess({
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.email,
        id: data.user.id,
        isNew: false,
      });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) { setError(oauthError.message); setLoading(false); }
  };

  if (step === "verify") {
    return (
      <div dir="rtl" style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 11l6 6L20 3" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", margin: "0 0 10px" }}>בדוק את האימייל שלך</h2>
          <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 1.7 }}>
            שלחנו קישור אימות ל-<strong>{email}</strong><br/>לחץ על הקישור כדי להפעיל את החשבון.
          </p>
          <button onClick={() => onSuccess({ email, name, isNew: true })} style={{ ...btnStyle, marginTop: 24, background: "#16a34a", color: "white" }}>
            המשך לבחירת תוכנית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={containerStyle}>
      <div style={cardStyle}>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="white"><path d="M6.5 1L8 4.5 12 5l-2.8 2.7.7 4-3.4-1.8-3.4 1.8.7-4L1 5l4-.5L6.5 1z"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>ReviewPilot</span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
          {mode === "login" ? "כניסה לחשבון" : "יצירת חשבון חדש"}
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>
          {mode === "login" ? "ברוך השב!" : "14 יום ניסיון חינם · ללא כרטיס אשראי"}
        </p>

        <button onClick={handleGoogleLogin} disabled={loading} style={{ ...btnStyle, background: "white", color: "#374151", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          {mode === "login" ? "כניסה עם Google" : "הרשמה עם Google"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }}/>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>או עם אימייל</span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }}/>
        </div>

        {mode === "signup" && (
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>שם מלא</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ישראל ישראלי" style={inputStyle}/>
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>אימייל</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" style={inputStyle}/>
        </div>
        <div style={{ marginBottom: error ? 8 : 20 }}>
          <label style={labelStyle}>
            <span>סיסמה</span>
            {mode === "login" && <button style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: 12, padding: 0 }}>שכחת סיסמה?</button>}
          </label>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="לפחות 6 תווים" type="password" style={inputStyle}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}/>
        </div>

        {error && <div style={{ marginBottom: 14, padding: "9px 12px", borderRadius: 6, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, background: "#16a34a", color: "white", marginBottom: 16, opacity: loading ? 0.7 : 1 }}>
          {loading ? "טוען..." : mode === "login" ? "כניסה" : "יצירת חשבון"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", margin: 0 }}>
          {mode === "login" ? "אין לך חשבון?" : "כבר יש לך חשבון?"}
          {" "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}>
            {mode === "login" ? "הירשם בחינם" : "כניסה"}
          </button>
        </p>

        {onBack && (
          <button onClick={onBack} style={{ display: "block", textAlign: "center", marginTop: 16, background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 13, width: "100%" }}>
            ← חזרה לדף הבית
          </button>
        )}
      </div>
    </div>
  );
}

const containerStyle = { minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Segoe UI', system-ui, sans-serif" };
const cardStyle = { background: "white", borderRadius: 14, padding: "36px 32px", maxWidth: 420, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E5E7EB" };
const inputStyle = { width: "100%", padding: "10px 13px", borderRadius: 7, border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#111827", transition: "border-color 0.15s" };
const labelStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };
const btnStyle = { width: "100%", padding: "11px", borderRadius: 7, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" };

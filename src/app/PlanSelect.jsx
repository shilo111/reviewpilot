"use client";

const PLANS = [
  {
    name: "Basic", price: 79, desc: "לעסקים קטנים שרוצים להתחיל",
    features: ["50 תגובות/חודש", "Google Reviews", "3 מילות מפתח", "תבניות תגובה"],
    highlight: false,
  },
  {
    name: "Pro", price: 149, desc: "לעסקים פעילים שצומחים",
    features: ["ללא הגבלת תגובות", "Google + Instagram", "20 מילות מפתח", "דוח שבועי במייל", "אנליטיקס מלא", "תעדוף תמיכה"],
    highlight: true,
  },
  {
    name: "Business", price: 299, desc: "לרשתות ועסקים גדולים",
    features: ["כמה סניפים", "מילות מפתח ללא הגבלה", "API גישה", "מנהל חשבון אישי", "הדרכה אישית"],
    highlight: false,
  },
];

export default function PlanSelect({ onSelect, suggestedPlan }) {
  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f0fdf4 0%,#F9FAFB 40%)", fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 13 13" fill="white"><path d="M6.5 1L8 4.5 12 5l-2.8 2.7.7 4-3.4-1.8-3.4 1.8.7-4L1 5l4-.5L6.5 1z"/></svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 16 }}>ReviewPilot</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: 44, maxWidth: 520 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 2.5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          החשבון שלך נוצר בהצלחה
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.8px", margin: "0 0 12px", color: "#111827" }}>בחר את התוכנית שלך</h1>
        <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.6, margin: 0 }}>14 יום ניסיון חינם בכל תוכנית · ללא כרטיס אשראי · ביטול בכל עת</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, maxWidth: 900, width: "100%" }}>
        {PLANS.map((p) => (
          <div key={p.name} style={{
            background: p.highlight ? "#16a34a" : "white",
            border: suggestedPlan === p.name && !p.highlight ? "2.5px solid #16a34a" : p.highlight ? "none" : "1.5px solid #E5E7EB",
            borderRadius: 14,
            padding: "28px 24px",
            color: p.highlight ? "white" : "#111827",
            boxShadow: p.highlight ? "0 20px 56px rgba(22,163,74,0.28)" : "0 2px 12px rgba(0,0,0,0.05)",
            transform: p.highlight ? "scale(1.03)" : "none",
            position: "relative",
            transition: "box-shadow 0.2s",
          }}>
            {p.highlight && (
              <div style={{ position: "absolute", top: -13, right: 22, background: "#F59E0B", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, boxShadow: "0 2px 8px rgba(245,158,11,0.4)" }}>
                הכי פופולרי
              </div>
            )}
            {suggestedPlan === p.name && !p.highlight && (
              <div style={{ position: "absolute", top: -13, right: 22, background: "#16a34a", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>
                מומלץ עבורך
              </div>
            )}

            <div style={{ fontSize: 13, opacity: 0.65, marginBottom: 4, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 4 }}>
              ₪{p.price}
              <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>/חודש</span>
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 22 }}>{p.desc}</div>

            <div style={{ borderTop: `1px solid ${p.highlight ? "rgba(255,255,255,0.2)" : "#E5E7EB"}`, paddingTop: 18, marginBottom: 22 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10, fontSize: 14 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-7" stroke={p.highlight ? "rgba(255,255,255,0.85)" : "#16a34a"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ opacity: 0.88 }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelect(p.name, p.price)}
              style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: p.highlight ? "white" : "#16a34a", color: p.highlight ? "#16a34a" : "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit", transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              התחל ניסיון חינם
            </button>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 28, fontSize: 13, color: "#9CA3AF" }}>אפשר לשדרג או לשנות תוכנית בכל עת מהגדרות</p>
    </div>
  );
}

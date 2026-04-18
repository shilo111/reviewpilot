"use client";
import { useState, useEffect, useRef } from "react";

const STRINGS = {
  he: {
    "nav.how": "איך זה עובד", "nav.features": "יכולות", "nav.pricing": "מחירים",
    "nav.faq": "שאלות נפוצות", "nav.login": "התחברות", "nav.cta": "התחילו ניסיון",
    "hero.eyebrow": "תגובה אוטומטית, מיידית, בקול שלכם",
    "hero.h1.a": "כל ביקורת מקבלת תשובה.", "hero.h1.b": "תוך 30 שניות.",
    "hero.sub": "reviewPilot מחבר את החשבון שלכם ב-Instagram וב-Google ועונה אוטומטית לכל ביקורת — בעברית, באנגלית, ובטון של העסק. בלי להעסיק מישהו, בלי לפספס לקוח.",
    "hero.cta1": "14 ימי ניסיון חינם", "hero.cta2": "צפו בהדגמה",
    "hero.meta1": "ללא כרטיס אשראי", "hero.meta2": "חיבור ב־3 דקות", "hero.meta3": "ביטול בכל עת",
    "demo.ig.head": "תגובה לביקורת", "demo.ig.time": "לפני 14ש'",
    "demo.ig.review": "חוויה מהממת! האווירה והאוכל פשוט מושלמים 🤍",
    "demo.ig.brand": "בית קפה ארבל", "demo.gg.head": "ביקורת ב-Google", "demo.gg.time": "לפני 4 דקות",
    "demo.gg.review": "שירות מעולה, חיכיתי קצת לשולחן אבל זה היה שווה.",
    "demo.gg.brand": "בית קפה ארבל · בעלים", "demo.badge": "אוטומטי",
    "chip.time.l": "זמן תגובה ממוצע", "chip.rate.l": "דירוג ממוצע ב-30 יום",
    "logos.label": "כבר משרת עסקים מקומיים",
    "how.tag": "תהליך", "how.h2": "3 שלבים. פעם אחת. ולתמיד.",
    "how.sub": "מתחברים פעם אחת, מגדירים טון, ו-reviewPilot טס לבד. כל ביקורת חדשה זוכה לתגובה מותאמת אישית — בלי שתצטרכו להרים אצבע.",
    "how.step1.tag": "חיבור", "how.step1.h": "מחברים את הערוצים",
    "how.step1.p": "אחרי כניסה — לוחצים \"חבר\" ל-Instagram ול-Google Business. כל ההרשאות בשליטה מלאה שלכם.",
    "how.step1.ig": "Instagram", "how.step1.gg": "Google",
    "how.step2.tag": "טון", "how.step2.h": "בוחרים את הקול שלכם",
    "how.step2.p": "מקצועי, חם, חברי, או טון מותאם אישית. הוסיפו דוגמאות, וה-AI ילמד לדבר בדיוק כמוכם.",
    "how.step2.t1": "מקצועי", "how.step2.t2": "חם וביתי", "how.step2.t3": "קליל", "how.step2.t4": "+ מותאם",
    "how.step3.tag": "פעולה", "how.step3.h": "תגובות נשלחות אוטומטית",
    "how.step3.p": "ברגע שמופיעה ביקורת חדשה, reviewPilot מנסח, מאשר ושולח. אתם רואים הכל בלוג שקוף.",
    "how.log1": "Google · ★★★★★", "how.log2": "Instagram · DM", "how.log3": "Google · ★★★☆☆",
    "feat.tag": "יכולות", "feat.h2": "פלטפורמה אחת לכל מה שכתבו עליכם.",
    "feat.sub": "אוטומציה מלאה, אבל אתם תמיד בשליטה. כל ביקורת מנוטרת, מתויגת, ונענית — ואם משהו דורש מבט אנושי, נדע להתריע.",
    "feat.f1.h": "דשבורד שמראה את הסיפור", "feat.f1.p": "דירוג, נפח תגובות, סנטימנט וסטטוס — בזמן אמת.",
    "feat.f1.s1": "תגובות החודש", "feat.f1.s2": "דירוג ממוצע",
    "feat.f2.h": "התראה על ביקורות שליליות",
    "feat.f2.p": "כשמישהו נותן 1–3 כוכבים, התגובה נשלחת לאישור שלכם — לא יוצאת מהבית בלי בקרה.",
    "feat.f2.at": "ביקורת 2★ דורשת עיון",
    "feat.f2.ab": "\"חיכינו 40 דקות...\" — נוסחה תגובה, ממתינה לאישור.",
    "feat.f3.h": "חוקי הפעלה גמישים",
    "feat.f3.p": "תגובה שונה ל-5★, ל-3★ או למילים רגישות. הכל מתוך טבלה אחת ברורה.",
    "feat.f3.r1": "→ תודה חמה + הזמנה לחזור", "feat.f3.r2": "→ הקשבה + פנייה אישית",
    "feat.f3.r3": "→ \"לא טרי\" → סימון לבעלים",
    "feat.f4.h": "עברית, אנגלית, ערבית, רוסית",
    "feat.f4.p": "ה-AI מזהה את שפת הביקורת ועונה באותה השפה — בלי תרגומי גוגל מביכים.",
    "metrics.lead.b": "עסקים שעונים על ביקורות תוך שעה",
    "metrics.lead.r": " מקבלים יותר ביקורות חוזרות, דירוג גבוה יותר, ושמרבית הצרכנים בודקים לפני שמגיעים אליהם.",
    "metrics.m1": "ביקורות חוזרות", "metrics.m2": "דירוג ממוצע", "metrics.m3": "זמן תגובה חציוני",
    "price.tag": "מחירים", "price.h2": "תמחור שקוף. מתחילים בחינם.",
    "price.sub": "14 ימי ניסיון מלא, ללא כרטיס אשראי. בוחרים מסלול רק אחרי שהוצאתם ערך.",
    "price.month": "חודש", "price.popular": "הכי פופולרי",
    "price.p1.n": "Starter", "price.p1.t": "לעסק קטן, מיקום אחד",
    "price.p1.l1": "עד 100 תגובות / חודש", "price.p1.l2": "Instagram + Google",
    "price.p1.l3": "2 שפות", "price.p1.l4": "תמיכה במייל", "price.p1.cta": "התחילו ניסיון",
    "price.p2.n": "Pro", "price.p2.t": "לעסק פעיל עם נפח ביקורות יומי",
    "price.p2.l1": "עד 1,000 תגובות / חודש", "price.p2.l2": "חוקי הפעלה מתקדמים",
    "price.p2.l3": "התראות על ביקורות שליליות", "price.p2.l4": "6 שפות + טון מותאם",
    "price.p2.l5": "דשבורד אנליטיקס", "price.p2.cta": "התחילו ניסיון",
    "price.p3.n": "Scale", "price.p3.price": "בהתאמה", "price.p3.t": "לרשתות עם מספר סניפים",
    "price.p3.l1": "תגובות בלתי מוגבלות", "price.p3.l2": "ניהול מספר סניפים",
    "price.p3.l3": "SLA + מנהל הצלחה", "price.p3.l4": "SSO ו-API", "price.p3.cta": "דברו איתנו",
    "faq.tag": "שאלות נפוצות", "faq.h2": "כל מה שתהיתם — לפני שתשאלו.",
    "faq.sub": "לא מצאתם תשובה? כתבו לנו ל-hello@reviewpilot.io.",
    "faq.q1": "האם הלקוחות שלי ידעו שהתגובה אוטומטית?",
    "faq.a1": "אנחנו לא מסמנים את התגובה כאוטומטית בצד הלקוח. ה-AI לומד את הקול שלכם, משלב פרטים ספציפיים מהביקורת, ויוצר תגובה שנשמעת אנושית לחלוטין — כי בעצם, היא נכתבה על בסיס מה שאתם הייתם כותבים.",
    "faq.q2": "מה קורה אם מקבלים ביקורת שלילית?",
    "faq.a2": "תגובות לביקורות עם 1–3 כוכבים, או כאלה שמכילות מילים רגישות שאתם מגדירים, לא נשלחות אוטומטית. הן נכנסות לתור אישור, ומחכות לכם — עם נוסח מוצע מוכן לעריכה.",
    "faq.q3": "כמה זמן לוקח להתחיל?",
    "faq.a3": "חיבור Instagram ו-Google Business לוקח כ-3 דקות. הגדרת טון ודוגמאות — עוד 5 דקות. תוך רבע שעה reviewPilot כבר עונה לביקורת הבאה שלכם.",
    "faq.q4": "האם המידע של העסק והלקוחות שלי מאובטח?",
    "faq.a4": "כן. אנחנו עובדים מול ה-APIs הרשמיים של Meta ו-Google, לא שומרים ססמאות, ומקיימים תקני SOC 2 ו-GDPR. כל ההודעות מוצפנות במנוחה ובתעבורה.",
    "faq.q5": "האם אפשר לבטל בכל עת?",
    "faq.a5": "כן, ביטול בלחיצה אחת מהדשבורד. אין התחייבות שנתית, אין קנסות, ואין שיחות עם נציג שמנסה לשכנע אתכם להישאר.",
    "cta.h": "תפסיקו לפספס לקוחות.",
    "cta.p": "14 ימי ניסיון, ללא כרטיס אשראי. שלוש דקות מהרגע שאתם מתחברים ועד הביקורת הראשונה שזוכה לתגובה.",
    "cta.b1": "התחילו ניסיון חינם", "cta.b2": "קבעו הדגמה",
    "foot.blurb": "תגובה אוטומטית לכל ביקורת, באינסטגרם וב-Google. נבנה לעסקים מקומיים בישראל ומחוצה לה.",
    "foot.product": "מוצר", "foot.p1": "יכולות", "foot.p2": "מחירים", "foot.p3": "אינטגרציות", "foot.p4": "שינויים",
    "foot.company": "חברה", "foot.c1": "אודות", "foot.c2": "לקוחות", "foot.c3": "בלוג", "foot.c4": "קריירה",
    "foot.legal": "משפטי", "foot.l1": "תנאי שימוש", "foot.l2": "פרטיות", "foot.l3": "DPA", "foot.l4": "אבטחה",
    "foot.made": "נבנה בישראל · באהבה לעסקים קטנים",
    "_typer.ig": "תודה רבה מיה! 🤍 שמחים שנהנית — מחכים לבקר אותנו שוב בקרוב.",
    "_typer.gg": "תודה דוד על המשוב! נשמח לארח אותך שוב — בפעם הבאה נשמור לך מקום מראש."
  },
  en: {
    "nav.how": "How it works", "nav.features": "Features", "nav.pricing": "Pricing",
    "nav.faq": "FAQ", "nav.login": "Sign in", "nav.cta": "Start free trial",
    "hero.eyebrow": "Instant auto-replies, in your own voice",
    "hero.h1.a": "Every review gets a reply.", "hero.h1.b": "Within 30 seconds.",
    "hero.sub": "reviewPilot connects to your Instagram and Google profiles and replies to every new review — in your tone, in your customer's language. Without hiring anyone. Without missing a customer.",
    "hero.cta1": "Start 14-day free trial", "hero.cta2": "See the demo",
    "hero.meta1": "No credit card", "hero.meta2": "3-minute setup", "hero.meta3": "Cancel anytime",
    "demo.ig.head": "Reply to review", "demo.ig.time": "14h ago",
    "demo.ig.review": "Stunning experience! The vibe and the food are just perfect 🤍",
    "demo.ig.brand": "Arbel Café", "demo.gg.head": "Google review", "demo.gg.time": "4 min ago",
    "demo.gg.review": "Great service, waited a bit for a table but it was worth it.",
    "demo.gg.brand": "Arbel Café · Owner", "demo.badge": "Auto",
    "chip.time.l": "Avg reply time", "chip.rate.l": "30-day avg rating",
    "logos.label": "Already trusted by local businesses",
    "how.tag": "Process", "how.h2": "3 steps. Once. Forever.",
    "how.sub": "Connect once, set your tone, and reviewPilot flies on its own. Every new review gets a personalized reply — without you lifting a finger.",
    "how.step1.tag": "Connect", "how.step1.h": "Connect your channels",
    "how.step1.p": "After signing in, hit \"Connect\" for Instagram and Google Business. All permissions stay fully under your control.",
    "how.step1.ig": "Instagram", "how.step1.gg": "Google",
    "how.step2.tag": "Tone", "how.step2.h": "Pick your voice",
    "how.step2.p": "Professional, warm, casual, or fully custom. Drop a few examples and the AI learns to sound exactly like you.",
    "how.step2.t1": "Professional", "how.step2.t2": "Warm", "how.step2.t3": "Casual", "how.step2.t4": "+ Custom",
    "how.step3.tag": "Action", "how.step3.h": "Replies go out automatically",
    "how.step3.p": "The moment a new review lands, reviewPilot drafts, validates, and sends. You see everything in a transparent log.",
    "how.log1": "Google · ★★★★★", "how.log2": "Instagram · DM", "how.log3": "Google · ★★★☆☆",
    "feat.tag": "Capabilities", "feat.h2": "One platform for everything written about you.",
    "feat.sub": "Full automation — but you stay in control. Every review is monitored, tagged, and answered. If something needs a human, we'll flag it.",
    "feat.f1.h": "A dashboard that tells the story", "feat.f1.p": "Rating, reply volume, sentiment, and status — in real time.",
    "feat.f1.s1": "Replies this month", "feat.f1.s2": "Average rating",
    "feat.f2.h": "Negative-review alerts",
    "feat.f2.p": "When someone leaves 1–3 stars, the reply waits for your approval — nothing leaves the house unsupervised.",
    "feat.f2.at": "2★ review needs review",
    "feat.f2.ab": "\"Waited 40 minutes...\" — reply drafted, awaiting approval.",
    "feat.f3.h": "Flexible trigger rules",
    "feat.f3.p": "Different reply for 5★, 3★, or sensitive keywords. All from one clean rules table.",
    "feat.f3.r1": "→ Warm thanks + invite to return", "feat.f3.r2": "→ Listen + personal outreach",
    "feat.f3.r3": "→ \"Not fresh\" → flag to owner",
    "feat.f4.h": "Hebrew, English, Arabic, Russian",
    "feat.f4.p": "The AI detects the review's language and replies in kind — no awkward Google Translate.",
    "metrics.lead.b": "Businesses that reply within an hour",
    "metrics.lead.r": " earn more repeat reviews, hold higher ratings, and convert more first-time visitors who looked them up.",
    "metrics.m1": "More repeat reviews", "metrics.m2": "Average rating lift", "metrics.m3": "Median reply time",
    "price.tag": "Pricing", "price.h2": "Transparent pricing. Start free.",
    "price.sub": "14 days, full access, no credit card. Pick a plan only after you've seen the value.",
    "price.month": "month", "price.popular": "Most popular",
    "price.p1.n": "Starter", "price.p1.t": "For a single small business",
    "price.p1.l1": "Up to 100 replies / month", "price.p1.l2": "Instagram + Google",
    "price.p1.l3": "2 languages", "price.p1.l4": "Email support", "price.p1.cta": "Start free trial",
    "price.p2.n": "Pro", "price.p2.t": "For active businesses with daily review volume",
    "price.p2.l1": "Up to 1,000 replies / month", "price.p2.l2": "Advanced trigger rules",
    "price.p2.l3": "Negative-review alerts", "price.p2.l4": "6 languages + custom tone",
    "price.p2.l5": "Analytics dashboard", "price.p2.cta": "Start free trial",
    "price.p3.n": "Scale", "price.p3.price": "Custom", "price.p3.t": "For chains with multiple locations",
    "price.p3.l1": "Unlimited replies", "price.p3.l2": "Multi-location management",
    "price.p3.l3": "SLA + success manager", "price.p3.l4": "SSO & API", "price.p3.cta": "Talk to us",
    "faq.tag": "FAQ", "faq.h2": "Everything you wondered — before you ask.",
    "faq.sub": "Didn't find an answer? Email hello@reviewpilot.io.",
    "faq.q1": "Will my customers know the reply is automated?",
    "faq.a1": "We never label the reply as automated on the customer side. The AI learns your voice, weaves in specific details from the review, and generates a reply that sounds entirely human — because it's based on what you would have written.",
    "faq.q2": "What happens with negative reviews?",
    "faq.a2": "Replies to 1–3 star reviews — or any review containing sensitive keywords you define — are not sent automatically. They go into an approval queue with a draft reply ready for you to edit.",
    "faq.q3": "How long does setup take?",
    "faq.a3": "Connecting Instagram and Google Business takes about 3 minutes. Setting tone and providing examples takes another 5. Within a quarter of an hour, reviewPilot is replying to your next review.",
    "faq.q4": "Is my business and customer data secure?",
    "faq.a4": "Yes. We work directly with the official Meta and Google APIs, never store passwords, and meet SOC 2 and GDPR standards. All data is encrypted at rest and in transit.",
    "faq.q5": "Can I cancel anytime?",
    "faq.a5": "Yes — one click in your dashboard. No annual commitments, no fees, no calls with a rep trying to talk you out of it.",
    "cta.h": "Stop missing customers.",
    "cta.p": "14-day trial, no credit card. Three minutes from sign-up to your first auto-replied review.",
    "cta.b1": "Start free trial", "cta.b2": "Book a demo",
    "foot.blurb": "Auto-replies for every Instagram and Google review. Built for local businesses, in Israel and beyond.",
    "foot.product": "Product", "foot.p1": "Features", "foot.p2": "Pricing", "foot.p3": "Integrations", "foot.p4": "Changelog",
    "foot.company": "Company", "foot.c1": "About", "foot.c2": "Customers", "foot.c3": "Blog", "foot.c4": "Careers",
    "foot.legal": "Legal", "foot.l1": "Terms", "foot.l2": "Privacy", "foot.l3": "DPA", "foot.l4": "Security",
    "foot.made": "Built in Israel · with love for small businesses",
    "_typer.ig": "Thank you so much, Maya! 🤍 So glad you enjoyed it — can't wait to host you again soon.",
    "_typer.gg": "Thanks for the feedback, David! We'd love to have you back — next time we'll save you a table in advance."
  }
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap');
:root {
  --hue: 155;
  --bg: oklch(0.985 0.004 90); --bg-2: oklch(0.97 0.005 90); --surface: #ffffff;
  --ink-900: oklch(0.18 0.012 250); --ink-700: oklch(0.34 0.012 250);
  --ink-500: oklch(0.52 0.01 250); --ink-400: oklch(0.66 0.008 250); --ink-300: oklch(0.82 0.006 250);
  --line: oklch(0.92 0.006 250); --line-strong: oklch(0.86 0.008 250);
  --accent: oklch(0.55 0.13 var(--hue)); --accent-ink: oklch(0.32 0.10 var(--hue));
  --accent-soft: oklch(0.96 0.04 var(--hue)); --accent-soft-2: oklch(0.92 0.06 var(--hue));
  --warn: oklch(0.72 0.16 70); --pink: oklch(0.62 0.18 15);
  --radius: 10px; --radius-lg: 16px; --radius-pill: 999px;
  --shadow-sm: 0 1px 0 rgba(20,24,32,0.04), 0 1px 2px rgba(20,24,32,0.04);
  --shadow-md: 0 1px 0 rgba(20,24,32,0.04), 0 6px 18px -6px rgba(20,24,32,0.10);
  --shadow-lg: 0 1px 0 rgba(20,24,32,0.04), 0 30px 60px -30px rgba(20,24,32,0.22), 0 12px 30px -16px rgba(20,24,32,0.14);
  --font-sans: 'Heebo', -apple-system, system-ui, sans-serif;
  --font-mono: ui-monospace, 'JetBrains Mono', monospace;
  --font-he: 'Heebo', system-ui, sans-serif;
  --container: 1180px;
}
html[dir="rtl"] body { font-family: var(--font-he); }
html[dir="ltr"] body { font-family: var(--font-sans); }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; scroll-behavior: smooth; }
body { background: var(--bg); color: var(--ink-900); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; line-height: 1.5; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; }
.rp-container { max-width: var(--container); margin: 0 auto; padding: 0 28px; }
.rp-topbar {
  border-bottom: 1px solid var(--line);
  background: color-mix(in oklab, var(--bg) 80%, transparent);
  -webkit-backdrop-filter: saturate(140%) blur(8px);
  backdrop-filter: saturate(140%) blur(8px);
  position: sticky; top: 0; z-index: 50;
}
.rp-nav { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.rp-brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -0.01em; }
.rp-brand-mark {
  width: 26px; height: 26px; border-radius: 7px; background: var(--ink-900); color: white;
  display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 500; position: relative;
}
.rp-brand-mark::after {
  content: ""; position: absolute; inset: auto -3px -3px auto;
  width: 9px; height: 9px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 2px var(--bg);
}
.rp-brand-name { font-size: 16px; }
.rp-brand-name b { font-weight: 600; }
.rp-brand-name span { color: var(--ink-500); font-weight: 400; }
.rp-nav-links { display: flex; align-items: center; gap: 28px; color: var(--ink-700); font-size: 14px; }
.rp-nav-links a { transition: color .15s; }
.rp-nav-links a:hover { color: var(--ink-900); }
.rp-nav-right { display: flex; align-items: center; gap: 10px; }
.rp-lang { display: inline-flex; align-items: center; border: 1px solid var(--line); border-radius: var(--radius-pill); padding: 3px; background: var(--surface); font-family: var(--font-mono); font-size: 11px; }
.rp-lang button { padding: 4px 9px; border-radius: var(--radius-pill); border: 0; background: transparent; color: var(--ink-500); text-transform: uppercase; letter-spacing: 0.04em; }
.rp-lang button[aria-pressed="true"] { background: var(--ink-900); color: white; }
.rp-btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: var(--radius); border: 1px solid transparent; font-size: 14px; font-weight: 500; transition: all .18s ease; line-height: 1; cursor: pointer; background: none; }
.rp-btn-ghost { color: var(--ink-700); }
.rp-btn-ghost:hover { color: var(--ink-900); }
.rp-btn-secondary { background: var(--surface); border-color: var(--line-strong); color: var(--ink-900); box-shadow: var(--shadow-sm); }
.rp-btn-secondary:hover { border-color: var(--ink-700); }
.rp-btn-primary { background: var(--ink-900); color: white; box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, var(--shadow-md); border-color: var(--ink-900); }
.rp-btn-primary:hover { transform: translateY(-1px); }
.rp-btn-lg { padding: 13px 18px; font-size: 15px; border-radius: 12px; }
.rp-arrow-rtl { transform: scaleX(-1); }
html[dir="ltr"] .rp-arrow-rtl { transform: none; }
.rp-hero { padding: 64px 0 40px; position: relative; overflow: hidden; }
.rp-hero-grid { display: grid; grid-template-columns: minmax(0,1.05fr) minmax(0,1fr); gap: 56px; align-items: center; }
@media (max-width: 960px) { .rp-hero-grid { grid-template-columns: 1fr; gap: 36px; } .rp-demo-stage { margin-inline-start: 0; margin-inline-end: 0; width: 100%; max-width: 560px; } }
@media (max-width: 560px) { .rp-demo-stage { aspect-ratio: auto; min-height: 520px; } .rp-device-ig { width: 240px; } .rp-device-google { width: 260px; } .rp-chip-time { inset-inline-end: 0; } .rp-chip-rate { inset-inline-start: 0; } }
.rp-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px 5px 6px; border: 1px solid var(--line); border-radius: var(--radius-pill); background: var(--surface); font-family: var(--font-mono); font-size: 11px; color: var(--ink-700); box-shadow: var(--shadow-sm); }
html[dir="rtl"] .rp-eyebrow { padding: 5px 6px 5px 10px; }
.rp-eyebrow .dot { width: 16px; height: 16px; border-radius: 50%; background: var(--accent); position: relative; display: inline-grid; place-items: center; }
.rp-eyebrow .dot::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: white; }
.rp-eyebrow .dot::before { content: ""; position: absolute; inset: -3px; border-radius: 50%; border: 1px solid var(--accent); opacity: 0.4; animation: rp-pulse 2.4s ease-out infinite; }
@keyframes rp-pulse { 0% { transform: scale(0.8); opacity: 0.7; } 100% { transform: scale(1.8); opacity: 0; } }
h1.rp-headline { font-size: clamp(38px,5vw,64px); line-height: 1.02; letter-spacing: -0.025em; font-weight: 600; margin: 22px 0 0; color: var(--ink-900); text-wrap: balance; }
html[dir="rtl"] h1.rp-headline { font-weight: 700; letter-spacing: -0.015em; line-height: 1.08; }
h1.rp-headline em { font-style: normal; color: var(--accent-ink); background: linear-gradient(180deg,transparent 65%,var(--accent-soft-2) 65%); padding: 0 4px; border-radius: 3px; }
.rp-subhead { margin-top: 22px; font-size: 18px; line-height: 1.55; color: var(--ink-500); max-width: 540px; text-wrap: pretty; }
.rp-hero-cta { margin-top: 30px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.rp-hero-meta { margin-top: 22px; display: flex; align-items: center; gap: 18px; font-size: 13px; color: var(--ink-500); }
.rp-hero-meta-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--ink-300); }
.rp-check { display: inline-block; width: 14px; height: 14px; background: var(--accent); border-radius: 50%; position: relative; vertical-align: -2px; margin-inline-end: 6px; }
.rp-check::after { content: ""; position: absolute; left: 4px; top: 3px; width: 4px; height: 7px; border: solid white; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
.rp-demo-stage { position: relative; aspect-ratio: 1/1; max-width: 540px; margin-inline-start: auto; isolation: isolate; }
.rp-demo-bg-grid { position: absolute; inset: -10% -8%; background-image: linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px); background-size: 32px 32px; background-position: -1px -1px; -webkit-mask-image: radial-gradient(60% 55% at 50% 50%,black,transparent 75%); mask-image: radial-gradient(60% 55% at 50% 50%,black,transparent 75%); opacity: 0.55; z-index: -1; }
.rp-device { position: absolute; width: 280px; background: var(--surface); border: 1px solid var(--line); border-radius: 22px; box-shadow: var(--shadow-lg); padding: 14px; font-family: var(--font-sans); }
html[dir="rtl"] .rp-device { font-family: var(--font-he); }
.rp-device-ig { top: 4%; inset-inline-start: 0; transform: rotate(-3deg); z-index: 2; }
.rp-device-google { bottom: 6%; inset-inline-end: 0; transform: rotate(2deg); z-index: 1; width: 320px; }
html[dir="rtl"] .rp-device-ig { transform: rotate(3deg); }
html[dir="rtl"] .rp-device-google { transform: rotate(-2deg); }
.rp-device-head { display: flex; align-items: center; justify-content: space-between; padding: 0 4px 10px; border-bottom: 1px solid var(--line); margin-bottom: 12px; font-family: var(--font-mono); font-size: 10px; color: var(--ink-500); letter-spacing: 0.04em; text-transform: uppercase; }
.rp-device-head-icon { display: inline-flex; align-items: center; gap: 6px; }
.rp-platform-glyph { width: 14px; height: 14px; border-radius: 4px; display: grid; place-items: center; color: white; font-weight: 700; font-size: 9px; font-family: var(--font-sans); }
.rp-platform-glyph.ig { background: linear-gradient(135deg,#f09433 0%,#e6683c 30%,#dc2743 50%,#cc2366 70%,#bc1888 100%); }
.rp-platform-glyph.gg { background: white; border: 1px solid var(--line); color: #4285F4; }
.rp-review-row { display: flex; gap: 10px; padding: 6px 4px 12px; }
.rp-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg,oklch(0.78 0.08 25),oklch(0.65 0.12 50)); display: grid; place-items: center; color: white; font-size: 11px; font-weight: 600; }
.rp-avatar.b2 { background: linear-gradient(135deg,oklch(0.78 0.08 200),oklch(0.55 0.14 230)); }
.rp-review-name { font-size: 12px; font-weight: 600; color: var(--ink-900); display: flex; align-items: center; gap: 6px; }
.rp-review-name .stars { color: oklch(0.72 0.17 70); font-size: 10px; letter-spacing: 1px; }
.rp-review-text { font-size: 12px; color: var(--ink-700); line-height: 1.45; margin-top: 2px; }
.rp-reply-row { display: flex; gap: 10px; padding: 12px 4px 4px; border-top: 1px dashed var(--line); margin-top: 4px; }
.rp-reply-row .rp-avatar { background: var(--ink-900); font-family: var(--font-mono); font-size: 10px; }
.rp-reply-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--accent-ink); font-weight: 500; }
.rp-reply-meta .badge { display: inline-flex; align-items: center; gap: 4px; padding: 1px 6px; background: var(--accent-soft); border-radius: var(--radius-pill); font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; }
.rp-reply-meta .badge::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
.rp-reply-text { font-size: 12px; color: var(--ink-900); line-height: 1.5; margin-top: 4px; min-height: 36px; }
.rp-typing-cursor { display: inline-block; width: 6px; height: 12px; background: var(--accent); vertical-align: -2px; margin-inline-start: 1px; animation: rp-blink 0.8s steps(2,start) infinite; }
@keyframes rp-blink { 50% { opacity: 0; } }
.rp-hero-chip { position: absolute; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow-md); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; font-size: 12px; z-index: 3; }
.rp-hero-chip .ico { width: 28px; height: 28px; border-radius: 8px; background: var(--accent-soft); color: var(--accent-ink); display: grid; place-items: center; font-family: var(--font-mono); font-weight: 600; font-size: 13px; }
.rp-hero-chip .label { color: var(--ink-500); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
.rp-hero-chip .value { color: var(--ink-900); font-weight: 600; font-size: 14px; }
.rp-chip-time { top: 38%; inset-inline-end: 4%; }
.rp-chip-rate { bottom: 0%; inset-inline-start: 5%; transform: rotate(-2deg); }
html[dir="rtl"] .rp-chip-rate { transform: rotate(2deg); }
.rp-logos { margin-top: 60px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 28px 0; background: repeating-linear-gradient(135deg,transparent 0,transparent 7px,color-mix(in srgb,var(--bg-2),transparent 60%) 7px,color-mix(in srgb,var(--bg-2),transparent 60%) 8px); }
.rp-logos-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 18px; }
.rp-logos-label { font-family: var(--font-mono); font-size: 11px; color: var(--ink-500); text-transform: uppercase; letter-spacing: 0.08em; }
.rp-logos-set { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
.rp-logo-pill { display: inline-flex; align-items: center; gap: 8px; color: var(--ink-700); font-weight: 600; font-size: 14px; letter-spacing: -0.01em; opacity: 0.85; }
.rp-logo-pill .glyph { width: 18px; height: 18px; border-radius: 5px; display: grid; place-items: center; background: var(--ink-900); color: white; font-family: var(--font-mono); font-size: 10px; }
.rp-section { padding: 100px 0; scroll-margin-top: 80px; }
.rp-section-head { max-width: 720px; margin-bottom: 56px; }
.rp-section-tag { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; color: var(--accent-ink); text-transform: uppercase; letter-spacing: 0.08em; }
.rp-section-tag::before { content: ""; width: 18px; height: 1px; background: var(--accent); }
.rp-section h2 { font-size: clamp(30px,3.6vw,44px); letter-spacing: -0.02em; line-height: 1.1; margin: 14px 0 14px; font-weight: 600; text-wrap: balance; }
html[dir="rtl"] .rp-section h2 { font-weight: 700; letter-spacing: -0.01em; }
.rp-section-sub { font-size: 17px; color: var(--ink-500); max-width: 600px; text-wrap: pretty; }
.rp-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--line); border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; }
@media (max-width: 820px) { .rp-steps { grid-template-columns: 1fr; } }
.rp-step { background: var(--surface); padding: 28px; display: flex; flex-direction: column; gap: 14px; min-height: 280px; }
.rp-step-num { font-family: var(--font-mono); font-size: 11px; color: var(--ink-500); letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
.rp-step-num b { width: 22px; height: 22px; border-radius: 6px; background: var(--accent-soft); color: var(--accent-ink); display: grid; place-items: center; font-weight: 600; font-size: 11px; }
.rp-step h3 { font-size: 22px; font-weight: 600; margin: 0; letter-spacing: -0.015em; }
.rp-step p { color: var(--ink-500); font-size: 15px; margin: 0; }
.rp-step-visual { margin-top: auto; border-top: 1px dashed var(--line); padding-top: 18px; min-height: 110px; display: flex; align-items: center; }
.rp-connect { display: flex; align-items: center; gap: 12px; width: 100%; }
.rp-connect .src { flex: 1; border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; }
.rp-connect .src .rp-platform-glyph { width: 18px; height: 18px; font-size: 11px; border-radius: 5px; }
.rp-connect .src .ok { margin-inline-start: auto; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); position: relative; }
.rp-connect .src .ok::after { content: ""; position: absolute; left: 5px; top: 4px; width: 4px; height: 7px; border: solid white; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
.rp-tone-pick { display: flex; flex-wrap: wrap; gap: 8px; }
.rp-tone-pill { border: 1px solid var(--line); border-radius: var(--radius-pill); padding: 6px 12px; font-size: 12px; color: var(--ink-700); background: var(--surface); }
.rp-tone-pill.active { background: var(--ink-900); color: white; border-color: var(--ink-900); }
.rp-reply-log { width: 100%; font-family: var(--font-mono); font-size: 11px; color: var(--ink-500); display: grid; gap: 4px; }
.rp-reply-log .row { display: flex; gap: 10px; align-items: center; }
.rp-reply-log .row .t { color: var(--ink-400); }
.rp-reply-log .row .ev { color: var(--ink-900); }
.rp-reply-log .row .st { color: var(--accent-ink); margin-inline-start: auto; }
.rp-features { display: grid; grid-template-columns: repeat(12,1fr); gap: 16px; }
@media (max-width: 820px) { .rp-features { grid-template-columns: repeat(6,1fr); } }
@media (max-width: 540px) { .rp-features { grid-template-columns: 1fr; } }
.rp-feature { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; gap: 10px; position: relative; overflow: hidden; }
.rp-feature.f-wide { grid-column: span 8; }
.rp-feature.f-half { grid-column: span 6; }
.rp-feature.f-third { grid-column: span 4; }
@media (max-width: 820px) { .rp-feature.f-wide,.rp-feature.f-half,.rp-feature.f-third { grid-column: span 6; } }
@media (max-width: 540px) { .rp-feature.f-wide,.rp-feature.f-half,.rp-feature.f-third { grid-column: span 1; } }
.rp-feature h4 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
.rp-feature p { margin: 0; color: var(--ink-500); font-size: 14px; line-height: 1.55; }
.rp-ico-tile { width: 32px; height: 32px; border-radius: 9px; background: var(--accent-soft); color: var(--accent-ink); display: grid; place-items: center; font-family: var(--font-mono); font-weight: 600; font-size: 14px; }
.rp-feature-art { margin-top: 14px; flex: 1; min-height: 120px; }
.rp-dash-slice { background: var(--bg-2); border: 1px solid var(--line); border-radius: 10px; padding: 14px; height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.rp-dash-stat { display: flex; flex-direction: column; gap: 4px; }
.rp-dash-stat .label { font-family: var(--font-mono); font-size: 10px; color: var(--ink-500); text-transform: uppercase; letter-spacing: 0.06em; }
.rp-dash-stat .num { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; }
.rp-dash-stat .num small { color: var(--ink-400); font-weight: 400; font-size: 13px; }
.rp-spark { grid-column: span 2; height: 36px; position: relative; border-top: 1px dashed var(--line); padding-top: 10px; }
.rp-spark svg { width: 100%; height: 100%; display: block; overflow: visible; }
.rp-rules { display: grid; gap: 6px; font-size: 12px; }
.rp-rule { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg-2); font-family: var(--font-mono); color: var(--ink-700); }
.rp-rule .tag { padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; background: var(--ink-900); color: white; }
.rp-rule .tag.warn { background: var(--warn); }
.rp-rule .tag.acc { background: var(--accent); }
.rp-alert { border: 1px solid var(--line); border-radius: 10px; padding: 12px; background: var(--bg-2); display: flex; gap: 10px; align-items: flex-start; font-size: 12px; }
.rp-alert .pill { flex-shrink: 0; width: 24px; height: 24px; border-radius: 6px; background: var(--pink); color: white; display: grid; place-items: center; font-weight: 700; font-size: 13px; }
.rp-alert .alert-title { font-weight: 600; color: var(--ink-900); }
.rp-alert .alert-body { color: var(--ink-500); margin-top: 2px; }
.rp-metrics { margin-top: 60px; background: var(--ink-900); color: white; border-radius: var(--radius-lg); padding: 40px 48px; display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px; align-items: center; }
@media (max-width: 820px) { .rp-metrics { grid-template-columns: 1fr 1fr; } }
.rp-metrics-lead { font-size: 18px; line-height: 1.45; color: oklch(0.85 0.02 250); text-wrap: pretty; }
.rp-metrics-lead b { color: white; font-weight: 600; }
.rp-metric-num { font-size: 40px; font-weight: 600; letter-spacing: -0.025em; line-height: 1; }
.rp-metric-num small { color: oklch(0.7 0.05 var(--hue)); font-weight: 400; }
.rp-metric-label { font-family: var(--font-mono); font-size: 11px; color: oklch(0.7 0.02 250); margin-top: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
.rp-pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
@media (max-width: 820px) { .rp-pricing-grid { grid-template-columns: 1fr; } }
.rp-plan { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 28px; display: flex; flex-direction: column; gap: 14px; position: relative; }
.rp-plan.featured { background: var(--ink-900); color: white; border-color: var(--ink-900); box-shadow: var(--shadow-lg); }
.rp-plan.featured .rp-plan-name { color: white; }
.rp-plan.featured .rp-price { color: white; }
.rp-plan.featured .rp-price small,.rp-plan.featured .rp-plan-tagline { color: oklch(0.78 0.02 250); }
.rp-plan.featured .rp-plan-features li { color: oklch(0.88 0.02 250); }
.rp-plan.featured .rp-check { background: oklch(0.7 0.13 var(--hue)); }
.rp-plan.featured .rp-btn-primary { background: white; color: var(--ink-900); border-color: white; }
.rp-plan-name { font-family: var(--font-mono); font-size: 12px; color: var(--ink-700); text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px; }
.rp-featured-badge { position: absolute; top: 24px; inset-inline-end: 24px; background: var(--accent); color: white; font-family: var(--font-mono); font-size: 10px; padding: 3px 8px; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.06em; }
.rp-price { font-size: 44px; font-weight: 600; letter-spacing: -0.025em; line-height: 1; color: var(--ink-900); display: flex; align-items: baseline; gap: 6px; }
.rp-price small { font-size: 14px; font-weight: 400; color: var(--ink-500); }
.rp-plan-tagline { font-size: 14px; color: var(--ink-500); margin-top: -8px; }
.rp-plan-features { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 8px; font-size: 14px; }
.rp-plan-features li { color: var(--ink-700); }
.rp-plan-cta { margin-top: auto; padding-top: 16px; }
.rp-plan-cta .rp-btn { width: 100%; justify-content: center; }
.rp-faq-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 56px; }
@media (max-width: 820px) { .rp-faq-grid { grid-template-columns: 1fr; gap: 28px; } }
.rp-faq { border-top: 1px solid var(--line); }
details.rp-faq-item { border-bottom: 1px solid var(--line); padding: 18px 0; }
details.rp-faq-item summary { cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; font-size: 17px; font-weight: 500; color: var(--ink-900); letter-spacing: -0.01em; }
details.rp-faq-item summary::-webkit-details-marker { display: none; }
details.rp-faq-item .toggle { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; color: var(--ink-700); font-size: 14px; flex-shrink: 0; transition: all .2s; }
details.rp-faq-item[open] .toggle { background: var(--ink-900); color: white; border-color: var(--ink-900); }
details.rp-faq-item[open] .toggle .plus::before { transform: translateX(-50%) rotate(90deg); }
.plus { position: relative; width: 10px; height: 10px; }
.plus::before,.plus::after { content: ""; position: absolute; background: currentColor; }
.plus::before { left: 50%; top: 0; width: 1.5px; height: 100%; transform: translateX(-50%); transition: transform .25s ease; }
.plus::after { top: 50%; left: 0; height: 1.5px; width: 100%; transform: translateY(-50%); }
details.rp-faq-item p { margin: 12px 0 0; padding-inline-end: 36px; color: var(--ink-500); font-size: 15px; line-height: 1.6; text-wrap: pretty; }
.rp-final-cta { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 56px 48px; text-align: center; position: relative; overflow: hidden; }
.rp-final-cta::before { content: ""; position: absolute; inset: 0; background: radial-gradient(40% 50% at 30% 0%,var(--accent-soft),transparent 70%),radial-gradient(40% 50% at 70% 100%,var(--accent-soft),transparent 70%); opacity: 0.7; pointer-events: none; }
.rp-final-cta > * { position: relative; }
.rp-final-cta h2 { font-size: clamp(28px,3.6vw,42px); letter-spacing: -0.02em; margin: 0 0 12px; font-weight: 600; text-wrap: balance; }
.rp-final-cta p { color: var(--ink-500); margin: 0 auto; max-width: 540px; font-size: 16px; }
.rp-final-cta .rp-hero-cta { justify-content: center; margin-top: 28px; }
footer.rp-footer { border-top: 1px solid var(--line); padding: 48px 0 36px; margin-top: 60px; }
.rp-foot { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 36px; }
@media (max-width: 820px) { .rp-foot { grid-template-columns: 1fr 1fr; } }
.rp-foot-col h5 { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-500); margin: 0 0 14px; font-weight: 500; }
.rp-foot-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; font-size: 14px; color: var(--ink-700); }
.rp-foot-col li { transition: color .15s; cursor: pointer; }
.rp-foot-col li:hover { color: var(--ink-900); }
.rp-foot-blurb { font-size: 13px; color: var(--ink-500); max-width: 280px; line-height: 1.55; margin-top: 12px; }
.rp-foot-bottom { border-top: 1px solid var(--line); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--ink-500); font-family: var(--font-mono); flex-wrap: wrap; gap: 12px; }
`;

export default function LandingPage({ onSignup, onLogin }) {
  const [lang, setLang] = useState("he");
  const typerIgRef = useRef(null);
  const typerGgRef = useRef(null);

  const t = (key) => STRINGS[lang]?.[key] ?? key;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const timers = [];
    const dict = STRINGS[lang];

    function typeInto(el, text, startDelay = 400) {
      if (!el) return;
      el.textContent = "";
      let i = 0;
      function step() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          const cursor = document.createElement("span");
          cursor.className = "rp-typing-cursor";
          el.appendChild(cursor);
          i++;
          timers.push(setTimeout(step, 28 + Math.random() * 30));
        } else {
          el.textContent = text;
        }
      }
      timers.push(setTimeout(step, startDelay));
    }

    typeInto(typerIgRef.current, dict["_typer.ig"], 500);
    typeInto(typerGgRef.current, dict["_typer.gg"], 1800);
    return () => timers.forEach(clearTimeout);
  }, [lang]);

  return (
    <>
      <style>{CSS}</style>

      <header className="rp-topbar">
        <div className="rp-container rp-nav">
          <a className="rp-brand" href="#">
            <span className="rp-brand-mark">r</span>
            <span className="rp-brand-name"><b>review</b><span>Pilot</span></span>
          </a>
          <nav className="rp-nav-links">
            <a href="#how">{t("nav.how")}</a>
            <a href="#features">{t("nav.features")}</a>
            <a href="#pricing">{t("nav.pricing")}</a>
            <a href="#faq">{t("nav.faq")}</a>
          </nav>
          <div className="rp-nav-right">
            <div className="rp-lang" role="group" aria-label="language">
              <button aria-pressed={lang === "he" ? "true" : "false"} onClick={() => setLang("he")}>HE</button>
              <button aria-pressed={lang === "en" ? "true" : "false"} onClick={() => setLang("en")}>EN</button>
            </div>
            <button className="rp-btn rp-btn-ghost" onClick={onLogin}>{t("nav.login")}</button>
            <button className="rp-btn rp-btn-primary" onClick={() => onSignup()}>{t("nav.cta")}</button>
          </div>
        </div>
      </header>

      <section className="rp-hero">
        <div className="rp-container rp-hero-grid">
          <div>
            <span className="rp-eyebrow">
              <span className="dot"></span>
              <span>{t("hero.eyebrow")}</span>
            </span>
            <h1 className="rp-headline">
              <span>{t("hero.h1.a")}</span>{" "}
              <em>{t("hero.h1.b")}</em>
            </h1>
            <p className="rp-subhead">{t("hero.sub")}</p>
            <div className="rp-hero-cta">
              <button className="rp-btn rp-btn-primary rp-btn-lg" onClick={() => onSignup()}>
                <span>{t("hero.cta1")}</span>
                <span className="rp-arrow-rtl">→</span>
              </button>
              <a href="#how" className="rp-btn rp-btn-secondary rp-btn-lg">{t("hero.cta2")}</a>
            </div>
            <div className="rp-hero-meta">
              <span><span className="rp-check"></span><span>{t("hero.meta1")}</span></span>
              <span className="rp-hero-meta-dot"></span>
              <span><span className="rp-check"></span><span>{t("hero.meta2")}</span></span>
              <span className="rp-hero-meta-dot"></span>
              <span><span className="rp-check"></span><span>{t("hero.meta3")}</span></span>
            </div>
          </div>

          <div className="rp-demo-stage">
            <div className="rp-demo-bg-grid"></div>
            <div className="rp-device rp-device-ig">
              <div className="rp-device-head">
                <span className="rp-device-head-icon">
                  <span className="rp-platform-glyph ig">IG</span>
                  <span>{t("demo.ig.head")}</span>
                </span>
                <span>{t("demo.ig.time")}</span>
              </div>
              <div className="rp-review-row">
                <div className="rp-avatar">M</div>
                <div>
                  <div className="rp-review-name">maya.cohen <span className="stars">★★★★★</span></div>
                  <div className="rp-review-text">{t("demo.ig.review")}</div>
                </div>
              </div>
              <div className="rp-reply-row">
                <div className="rp-avatar">rP</div>
                <div style={{ flex: 1 }}>
                  <div className="rp-reply-meta">
                    <span>{t("demo.ig.brand")}</span>
                    <span className="badge"><span>{t("demo.badge")}</span></span>
                  </div>
                  <div className="rp-reply-text" ref={typerIgRef}></div>
                </div>
              </div>
            </div>

            <div className="rp-device rp-device-google">
              <div className="rp-device-head">
                <span className="rp-device-head-icon">
                  <span className="rp-platform-glyph gg">G</span>
                  <span>{t("demo.gg.head")}</span>
                </span>
                <span>{t("demo.gg.time")}</span>
              </div>
              <div className="rp-review-row">
                <div className="rp-avatar b2">D</div>
                <div>
                  <div className="rp-review-name">David Levi <span className="stars">★★★★☆</span></div>
                  <div className="rp-review-text">{t("demo.gg.review")}</div>
                </div>
              </div>
              <div className="rp-reply-row">
                <div className="rp-avatar">rP</div>
                <div style={{ flex: 1 }}>
                  <div className="rp-reply-meta">
                    <span>{t("demo.gg.brand")}</span>
                    <span className="badge"><span>{t("demo.badge")}</span></span>
                  </div>
                  <div className="rp-reply-text" ref={typerGgRef}></div>
                </div>
              </div>
            </div>

            <div className="rp-hero-chip rp-chip-time">
              <div className="ico">⏱</div>
              <div>
                <div className="label">{t("chip.time.l")}</div>
                <div className="value">28<span style={{ color: "var(--ink-400)", fontWeight: 400, fontSize: 12 }}> sec</span></div>
              </div>
            </div>
            <div className="rp-hero-chip rp-chip-rate">
              <div className="ico">↑</div>
              <div>
                <div className="label">{t("chip.rate.l")}</div>
                <div className="value">4.7 <span style={{ color: "var(--accent-ink)", fontSize: 11 }}>+0.4</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rp-container">
          <div className="rp-logos">
            <div className="rp-logos-inner">
              <div className="rp-logos-label">{t("logos.label")}</div>
              <div className="rp-logos-set">
                {["Arbel Café", "Noa Studio", "Mendel Clinic", "BarCode Bar", "Sela Hair"].map((n, i) => (
                  <span key={i} className="rp-logo-pill"><span className="glyph">{n[0]}</span>{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="rp-section">
        <div className="rp-container">
          <div className="rp-section-head">
            <span className="rp-section-tag">{t("how.tag")}</span>
            <h2>{t("how.h2")}</h2>
            <p className="rp-section-sub">{t("how.sub")}</p>
          </div>
          <div className="rp-steps">
            <div className="rp-step">
              <div className="rp-step-num"><b>01</b><span>{t("how.step1.tag")}</span></div>
              <h3>{t("how.step1.h")}</h3>
              <p>{t("how.step1.p")}</p>
              <div className="rp-step-visual">
                <div className="rp-connect">
                  <div className="src"><span className="rp-platform-glyph ig">IG</span><span>{t("how.step1.ig")}</span><span className="ok"></span></div>
                  <div className="src"><span className="rp-platform-glyph gg">G</span><span>{t("how.step1.gg")}</span><span className="ok"></span></div>
                </div>
              </div>
            </div>
            <div className="rp-step">
              <div className="rp-step-num"><b>02</b><span>{t("how.step2.tag")}</span></div>
              <h3>{t("how.step2.h")}</h3>
              <p>{t("how.step2.p")}</p>
              <div className="rp-step-visual">
                <div className="rp-tone-pick">
                  <span className="rp-tone-pill">{t("how.step2.t1")}</span>
                  <span className="rp-tone-pill active">{t("how.step2.t2")}</span>
                  <span className="rp-tone-pill">{t("how.step2.t3")}</span>
                  <span className="rp-tone-pill">{t("how.step2.t4")}</span>
                </div>
              </div>
            </div>
            <div className="rp-step">
              <div className="rp-step-num"><b>03</b><span>{t("how.step3.tag")}</span></div>
              <h3>{t("how.step3.h")}</h3>
              <p>{t("how.step3.p")}</p>
              <div className="rp-step-visual">
                <div className="rp-reply-log">
                  <div className="row"><span className="t">10:42</span><span className="ev">{t("how.log1")}</span><span className="st">✓ sent</span></div>
                  <div className="row"><span className="t">10:38</span><span className="ev">{t("how.log2")}</span><span className="st">✓ sent</span></div>
                  <div className="row"><span className="t">10:21</span><span className="ev">{t("how.log3")}</span><span className="st" style={{ color: "var(--warn)" }}>⚑ flagged</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="rp-section" style={{ paddingTop: 0 }}>
        <div className="rp-container">
          <div className="rp-section-head">
            <span className="rp-section-tag">{t("feat.tag")}</span>
            <h2>{t("feat.h2")}</h2>
            <p className="rp-section-sub">{t("feat.sub")}</p>
          </div>
          <div className="rp-features">
            <div className="rp-feature f-wide">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="rp-ico-tile">⌘</div>
                <div><h4>{t("feat.f1.h")}</h4><p style={{ marginTop: 2 }}>{t("feat.f1.p")}</p></div>
              </div>
              <div className="rp-feature-art">
                <div className="rp-dash-slice">
                  <div className="rp-dash-stat"><span className="label">{t("feat.f1.s1")}</span><span className="num">1,284 <small>+18%</small></span></div>
                  <div className="rp-dash-stat"><span className="label">{t("feat.f1.s2")}</span><span className="num">4.7 <small style={{ color: "var(--accent-ink)" }}>+0.4</small></span></div>
                  <div className="rp-spark">
                    <svg viewBox="0 0 280 36" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="rp-sg" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.55 0.13 155)" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="oklch(0.55 0.13 155)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,28 L20,24 L40,26 L60,18 L80,20 L100,12 L120,16 L140,10 L160,14 L180,6 L200,10 L220,4 L240,8 L260,2 L280,4 L280,36 L0,36 Z" fill="url(#rp-sg)" />
                      <path d="M0,28 L20,24 L40,26 L60,18 L80,20 L100,12 L120,16 L140,10 L160,14 L180,6 L200,10 L220,4 L240,8 L260,2 L280,4" fill="none" stroke="oklch(0.55 0.13 155)" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="rp-feature f-third">
              <div className="rp-ico-tile" style={{ background: "oklch(0.95 0.04 15)", color: "var(--pink)" }}>!</div>
              <h4>{t("feat.f2.h")}</h4>
              <p>{t("feat.f2.p")}</p>
              <div className="rp-feature-art">
                <div className="rp-alert">
                  <div className="pill">!</div>
                  <div><div className="alert-title">{t("feat.f2.at")}</div><div className="alert-body">{t("feat.f2.ab")}</div></div>
                </div>
              </div>
            </div>

            <div className="rp-feature f-half">
              <div className="rp-ico-tile">≡</div>
              <h4>{t("feat.f3.h")}</h4>
              <p>{t("feat.f3.p")}</p>
              <div className="rp-feature-art">
                <div className="rp-rules">
                  <div className="rp-rule"><span className="tag acc">5★</span><span>{t("feat.f3.r1")}</span></div>
                  <div className="rp-rule"><span className="tag">3★</span><span>{t("feat.f3.r2")}</span></div>
                  <div className="rp-rule"><span className="tag warn">!</span><span>{t("feat.f3.r3")}</span></div>
                </div>
              </div>
            </div>

            <div className="rp-feature f-half">
              <div className="rp-ico-tile">א/A</div>
              <h4>{t("feat.f4.h")}</h4>
              <p>{t("feat.f4.p")}</p>
              <div className="rp-feature-art" style={{ display: "flex", flexWrap: "wrap", gap: 6, alignContent: "flex-start" }}>
                {["HE", "EN", "AR", "RU", "FR", "ES"].map((l, i) => (
                  <span key={i} className={`rp-tone-pill${i === 0 ? " active" : ""}`} style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rp-metrics">
            <div className="rp-metrics-lead"><b>{t("metrics.lead.b")}</b><span>{t("metrics.lead.r")}</span></div>
            <div><div className="rp-metric-num">3.2<small>×</small></div><div className="rp-metric-label">{t("metrics.m1")}</div></div>
            <div><div className="rp-metric-num">+0.6<small>★</small></div><div className="rp-metric-label">{t("metrics.m2")}</div></div>
            <div><div className="rp-metric-num">28<small>sec</small></div><div className="rp-metric-label">{t("metrics.m3")}</div></div>
          </div>
        </div>
      </section>

      <section id="pricing" className="rp-section">
        <div className="rp-container">
          <div className="rp-section-head">
            <span className="rp-section-tag">{t("price.tag")}</span>
            <h2>{t("price.h2")}</h2>
            <p className="rp-section-sub">{t("price.sub")}</p>
          </div>
          <div className="rp-pricing-grid">
            <div className="rp-plan">
              <div className="rp-plan-name">· <span>{t("price.p1.n")}</span></div>
              <div className="rp-price">₪149<small>/<span>{t("price.month")}</span></small></div>
              <div className="rp-plan-tagline">{t("price.p1.t")}</div>
              <ul className="rp-plan-features">
                {["price.p1.l1","price.p1.l2","price.p1.l3","price.p1.l4"].map(k => <li key={k}><span className="rp-check"></span><span>{t(k)}</span></li>)}
              </ul>
              <div className="rp-plan-cta"><button className="rp-btn rp-btn-secondary" onClick={() => onSignup("Starter")}>{t("price.p1.cta")}</button></div>
            </div>

            <div className="rp-plan featured">
              <span className="rp-featured-badge">{t("price.popular")}</span>
              <div className="rp-plan-name">· <span>{t("price.p2.n")}</span></div>
              <div className="rp-price">₪349<small>/<span>{t("price.month")}</span></small></div>
              <div className="rp-plan-tagline">{t("price.p2.t")}</div>
              <ul className="rp-plan-features">
                {["price.p2.l1","price.p2.l2","price.p2.l3","price.p2.l4","price.p2.l5"].map(k => <li key={k}><span className="rp-check"></span><span>{t(k)}</span></li>)}
              </ul>
              <div className="rp-plan-cta"><button className="rp-btn rp-btn-primary" onClick={() => onSignup("Pro")}>{t("price.p2.cta")}</button></div>
            </div>

            <div className="rp-plan">
              <div className="rp-plan-name">· <span>{t("price.p3.n")}</span></div>
              <div className="rp-price"><span>{t("price.p3.price")}</span></div>
              <div className="rp-plan-tagline">{t("price.p3.t")}</div>
              <ul className="rp-plan-features">
                {["price.p3.l1","price.p3.l2","price.p3.l3","price.p3.l4"].map(k => <li key={k}><span className="rp-check"></span><span>{t(k)}</span></li>)}
              </ul>
              <div className="rp-plan-cta"><button className="rp-btn rp-btn-secondary" onClick={() => onSignup("Scale")}>{t("price.p3.cta")}</button></div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="rp-section">
        <div className="rp-container">
          <div className="rp-faq-grid">
            <div>
              <span className="rp-section-tag">{t("faq.tag")}</span>
              <h2 style={{ fontSize: 34, margin: "14px 0 12px" }}>{t("faq.h2")}</h2>
              <p className="rp-section-sub">{t("faq.sub")}</p>
            </div>
            <div className="rp-faq">
              {[1,2,3,4,5].map((n, i) => (
                <details key={n} className="rp-faq-item" open={i === 0}>
                  <summary>
                    <span>{t(`faq.q${n}`)}</span>
                    <span className="toggle"><span className="plus"></span></span>
                  </summary>
                  <p>{t(`faq.a${n}`)}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rp-section" style={{ paddingTop: 0 }}>
        <div className="rp-container">
          <div className="rp-final-cta">
            <h2>{t("cta.h")}</h2>
            <p>{t("cta.p")}</p>
            <div className="rp-hero-cta">
              <button className="rp-btn rp-btn-primary rp-btn-lg" onClick={() => onSignup()}>
                <span>{t("cta.b1")}</span>
                <span className="rp-arrow-rtl">→</span>
              </button>
              <a href="#how" className="rp-btn rp-btn-secondary rp-btn-lg">{t("cta.b2")}</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="rp-footer">
        <div className="rp-container">
          <div className="rp-foot">
            <div>
              <a className="rp-brand" href="#">
                <span className="rp-brand-mark">r</span>
                <span className="rp-brand-name"><b>review</b><span>Pilot</span></span>
              </a>
              <p className="rp-foot-blurb">{t("foot.blurb")}</p>
            </div>
            <div className="rp-foot-col">
              <h5>{t("foot.product")}</h5>
              <ul>{["foot.p1","foot.p2","foot.p3","foot.p4"].map(k => <li key={k}>{t(k)}</li>)}</ul>
            </div>
            <div className="rp-foot-col">
              <h5>{t("foot.company")}</h5>
              <ul>{["foot.c1","foot.c2","foot.c3","foot.c4"].map(k => <li key={k}>{t(k)}</li>)}</ul>
            </div>
            <div className="rp-foot-col">
              <h5>{t("foot.legal")}</h5>
              <ul>{["foot.l1","foot.l2","foot.l3","foot.l4"].map(k => <li key={k}>{t(k)}</li>)}</ul>
            </div>
          </div>
          <div className="rp-foot-bottom">
            <span>© 2026 reviewPilot Ltd.</span>
            <span>{t("foot.made")}</span>
          </div>
        </div>
      </footer>
    </>
  );
}

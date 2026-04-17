from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import anthropic
import openai
import os
from dotenv import load_dotenv
from .keyword_engine import KeywordEngine

load_dotenv()

app = FastAPI(title="ReviewPilot API")

# CORS - מאפשר לפרונטאנד לדבר עם הבאקנד
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # בפרודקשן - שנה לדומיין הספציפי
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------
# מודלים (Pydantic - הגדרת מבנה הנתונים)
# -------------------------------------------------------

class KeywordRule(BaseModel):
    keywords: list[str]        # ["מחיר", "כמה עולה", "תעריף"]
    response: str              # "המחירים שלנו מתחילים מ-X שקל..."

class GenerateRequest(BaseModel):
    review_text: str           # טקסט הביקורת/תגובה
    business_name: str         # שם העסק
    business_type: str         # סוג העסק (מספרה, מסעדה...)
    tone: str = "מקצועי"       # טון התגובה
    keyword_rules: list[KeywordRule] = []  # חוקי מילות מפתח של העסק

class GenerateResponse(BaseModel):
    reply: str                 # התגובה שנוצרה
    source: str                # "keyword" / "claude" / "openai" / "default"

# -------------------------------------------------------
# פונקציות ייצור תגובה
# -------------------------------------------------------

async def generate_with_claude(review_text: str, business_name: str, business_type: str, tone: str) -> str:
    """ייצור תגובה עם Claude API"""
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    prompt = f"""אתה מנהל עסק בשם "{business_name}" ({business_type}).
כתוב תגובה קצרה ו{tone}ית לביקורת/תגובה הבאה.
התגובה חייבת להיות בעברית, עד 3 משפטים, אנושית ואמיתית.
אל תשתמש באימוג'ים מוגזמים.

ביקורת: {review_text}

כתוב רק את התגובה, בלי הסברים."""

    message = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text.strip()


async def generate_with_openai(review_text: str, business_name: str, business_type: str, tone: str) -> str:
    """Fallback - ייצור תגובה עם OpenAI"""
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user",
            "content": f"""אתה מנהל עסק בשם "{business_name}" ({business_type}).
כתוב תגובה קצרה ו{tone}ית לביקורת: {review_text}
עד 3 משפטים, בעברית, אנושית. רק התגובה."""
        }],
        max_tokens=300,
    )
    return response.choices[0].message.content.strip()


def get_default_response(review_text: str) -> str:
    """ברירת מחדל כשכל ה-APIs נכשלים"""
    # זיהוי בסיסי של חיובי/שלילי לפי מילים
    negative_words = ["גרוע", "נורא", "מאכזב", "גרועה", "בזבוז", "אכזבה"]
    is_negative = any(word in review_text for word in negative_words)
    
    if is_negative:
        return "תודה על המשוב הכן. אנחנו מצטערים על החוויה ונשמח לתקן. אנא צרו איתנו קשר ישירות."
    return "תודה רבה על הביקורת! אנחנו שמחים לשמוע ומחכים לראותכם שוב."

# -------------------------------------------------------
# Routes (נקודות קצה)
# -------------------------------------------------------

@app.get("/")
def root():
    return {"status": "ReviewPilot API פעיל ✅"}


@app.post("/generate-reply", response_model=GenerateResponse)
async def generate_reply(request: GenerateRequest):
    """
    נקודת הקצה הראשית - מקבל ביקורת ומחזיר תגובה.
    סדר עדיפויות:
    1. מילות מפתח (חינמי, מיידי)
    2. Claude API
    3. OpenAI Fallback
    4. תגובת ברירת מחדל
    """
    
    # שלב 1 - בדיקת מילות מפתח
    if request.keyword_rules:
        engine = KeywordEngine(request.keyword_rules)
        keyword_match = engine.match(request.review_text)
        if keyword_match:
            return GenerateResponse(reply=keyword_match, source="keyword")

    # שלב 2 - Claude API
    try:
        reply = await generate_with_claude(
            request.review_text,
            request.business_name,
            request.business_type,
            request.tone
        )
        return GenerateResponse(reply=reply, source="claude")
    except Exception as e:
        print(f"Claude נכשל: {e}")

    # שלב 3 - OpenAI Fallback
    try:
        reply = await generate_with_openai(
            request.review_text,
            request.business_name,
            request.business_type,
            request.tone
        )
        return GenerateResponse(reply=reply, source="openai")
    except Exception as e:
        print(f"OpenAI נכשל: {e}")

    # שלב 4 - ברירת מחדל
    return GenerateResponse(
        reply=get_default_response(request.review_text),
        source="default"
    )


@app.post("/test-keywords")
async def test_keywords(review_text: str, rules: list[KeywordRule]):
    """endpoint לבדיקת מילות מפתח - שימושי בפיתוח"""
    engine = KeywordEngine(rules)
    match = engine.match(review_text)
    return {"matched": match is not None, "response": match}

"""
מנוע מילות מפתח - לוגיקת הסריקה וההתאמה
"""

class KeywordEngine:
    def __init__(self, rules):
        """
        rules = רשימת חוקים מהדאטהבייס של העסק
        כל חוק: { keywords: ["מחיר", "עולה"], response: "המחיר שלנו..." }
        """
        self.rules = rules

    def normalize(self, text: str) -> str:
        """נרמול טקסט - אותיות קטנות, הסרת רווחים מיותרים"""
        return text.lower().strip()

    def match(self, review_text: str) -> str | None:
        """
        סריקת הטקסט לפי כל החוקים.
        מחזיר את התגובה הראשונה שנמצאה, או None אם אין התאמה.
        """
        normalized_text = self.normalize(review_text)
        
        for rule in self.rules:
            for keyword in rule.keywords:
                if self.normalize(keyword) in normalized_text:
                    return rule.response  # החזרת התגובה המוכנה
        
        return None  # אין התאמה - ממשיך ל-AI


# -------------------------------------------------------
# בדיקה מהירה (הרץ את הקובץ ישירות לבדיקה)
# -------------------------------------------------------
if __name__ == "__main__":
    from pydantic import BaseModel
    
    class MockRule(BaseModel):
        keywords: list[str]
        response: str

    test_rules = [
        MockRule(keywords=["מחיר", "כמה עולה", "תעריף"], response="המחירים שלנו מתחילים מ-80 שקל, לפרטים נוספים התקשרו ל-050-0000000"),
        MockRule(keywords=["כתובת", "איפה", "מיקום"], response="אנחנו ברחוב הרצל 5, תל אביב. ניתן לנווט דרך וייז!"),
        MockRule(keywords=["שעות", "פתוח", "סגור"], response="פתוחים א-ה 9:00-19:00, שישי עד 14:00"),
    ]

    engine = KeywordEngine(test_rules)

    tests = [
        "כמה עולה תספורת?",
        "איפה אתם נמצאים?",
        "מתי אתם פתוחים?",
        "השירות היה מעולה!",  # אמור להחזיר None
    ]

    for test in tests:
        result = engine.match(test)
        print(f'קלט: "{test}"')
        print(f'תוצאה: {result or "אין התאמה - ממשיך ל-AI"}')
        print("---")

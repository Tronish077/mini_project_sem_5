from google import genai
from google.genai import types
from app.schemas.feedback import FeedbackResponse
from app.schemas.uploadResponse import ReviewAnalysis
from app.prompts import feedback_prompt
from app.core.config import settings

class AIService:
     def __init__(self):
          self.client = genai.Client(
               api_key=settings.gemini_api_key
          )

     def analyze_feedback(self, feedback:str)->FeedbackResponse:
          
        prompt =f"""
{feedback_prompt}

Customer Feedback:
----
{feedback}
----
        """

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=FeedbackResponse
            )
        )

        return FeedbackResponse.model_validate_json(response.text)
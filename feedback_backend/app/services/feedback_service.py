from app.schemas.feedback import FeedbackRequest
from app.schemas.uploadResponse import UploadResponse,ReviewAnalysis
from fastapi import UploadFile
from app.services.ai_service import AIService
from app.services.csv_service import CSVService

class FeedbackService:

    def __init__(self):
        self.ai_service =  AIService()
        self.csv_service = CSVService()

    # Single feedback analytics
    def feedback_analyze(self, feedback: FeedbackRequest):
        return self.ai_service.analyze_feedback(feedback.feedback)
    
    # CSV File analytics
    async def analyze_csv(self, file:UploadFile):
        raw_reviews = await self.csv_service.read_reviews(file)
        ai_analysis = []

        for review in raw_reviews:
            # call ai for analytics
            request = FeedbackRequest(feedback=review)
            analysis = self.feedback_analyze(request)

            # Add analytics to list
            ai_analysis.append(
                ReviewAnalysis(
                review=review,
                analysis=analysis
            )
        )
            
        return UploadResponse(
            file_name=file.filename,
            total_reviews=len(ai_analysis),
            results=ai_analysis
        )
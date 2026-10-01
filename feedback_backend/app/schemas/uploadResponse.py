from pydantic import BaseModel
from app.schemas.feedback import FeedbackResponse

class ReviewAnalysis(BaseModel):
    review: str
    analysis: FeedbackResponse

class UploadResponse(BaseModel):
    file_name:str
    total_reviews:int
    results: list[ReviewAnalysis]
from fastapi import APIRouter,UploadFile
from app.schemas.feedback import FeedbackRequest, FeedbackResponse
from app.services.feedback_service import FeedbackService
from app.services.csv_service import CSVService

router = APIRouter(prefix="/feedback",tags=["Feedback"])
service = FeedbackService()
csv_service = CSVService()

@router.get("")
def get_feeback():
    return {
        "message":"Feedback endpoint working"
    }

@router.post("/analyze", response_model=FeedbackResponse)
def analyze_route(feedback: FeedbackRequest):
    return service.feedback_analyze(feedback)

@router.post("/upload")
async def upload_reviews(file:UploadFile):
    analysis = await  service.analyze_csv(file=file)
    return analysis


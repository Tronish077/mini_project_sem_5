from pydantic import BaseModel, Field
from enum import Enum

class Sentiment(str,Enum):
    positive = "Positive"
    negative = "Negative"
    neutral = "Neutral"
    mixed = "Mixed"

class Urgency(str,Enum):
    low = "Low"
    medium = "Medium"
    high = "High"

class BusinessImpact(str, Enum):
    customer_retention = "Customer Retention Risk"
    revenue = "Revenue Risk"
    reputation = "Brand Reputation Risk"
    operational = "Operational Efficiency"
    customer_satisfaction = "Customer Satisfaction"
    none = "None"

class Emotion(str, Enum):
    happy = "Happy"
    satisfied = "Satisfied"
    neutral = "Neutral"
    frustrated = "Frustrated"
    angry = "Angry"
    disappointed = "Disappointed"

class FeedbackRequest(BaseModel):
    feedback:str = Field(
        description="The customers feedback to be analyzed."
        )

class FeedbackResponse(BaseModel):
    sentiment: Sentiment
    summary: str = Field(
        description="A concise summary of the customer feedback"
        )
    positive_topics: list[str]
    negative_topics: list[str]
    emotion: Emotion
    urgency: Urgency
    recommendation: str
    business_impact:BusinessImpact
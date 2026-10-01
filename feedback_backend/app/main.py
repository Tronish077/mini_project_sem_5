from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.feedback import router as feedback_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://mini-project-sem-5.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(feedback_router)

@app.get("/")
def root():
    return {"Home":"Welcome to my API"}


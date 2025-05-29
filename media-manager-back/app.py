from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.youtube_router import router as youtube_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    youtube_router,
    prefix="/api/youtube"
)

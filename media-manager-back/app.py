from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.youtube_router import router as youtube_router
from routers.instagram_router import router as instagram_router
from dotenv import load_dotenv

from services.security import verify_firebase_token

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://media-manager-front-593442013979.europe-west9.run.app",  # Without trailing slash
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    youtube_router,
    prefix="/api/youtube",
    dependencies=[Depends(verify_firebase_token)]
)

app.include_router(
    instagram_router,
    prefix="/api/instagram",
    dependencies=[Depends(verify_firebase_token)]
)

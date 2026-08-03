from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import analyze, auth, share
from app.core.config import settings

app = FastAPI(
    title="CodePlus API", 
    version="1.0.0", 
    docs_url="/api/docs",
    redoc_url="/api/redoc")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(analyze.router,prefix="/api/v1")
app.include_router(auth.router,prefix="/api/v1")
app.include_router(share.router,prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "codeplus-api"}

@app.get("/")
async def root():
    return {"message": "Codepulse API", "docs": "/api/docs"}

@app.on_event("startup")
async def startup_event():
    print("\n=== Registered Routes ===")
    for route in app.routes:
        print("f{route.methods} {route.path}")
    print("===============\n")

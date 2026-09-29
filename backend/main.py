from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from agent import (
    process_unified_query, classify_product, calculate_risk_score,
    generate_defensive_publication, simulate_abs_obligations,
    generate_timestamp_proof, get_pathway_matrix
)
import db_manager

app = FastAPI(title="IP-Shakti Sahayak API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTHENTICATION ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    role: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/register")
def register(request: RegisterRequest):
    success, msg = db_manager.register_user(request.name, request.email, request.role, request.password)
    if not success:
        raise HTTPException(status_code=400, detail=msg)
    return {"status": "success", "message": msg}

@app.post("/api/auth/login")
def login(request: LoginRequest):
    user = db_manager.authenticate_user(request.email, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {"status": "success", "user": user}

@app.get("/api/auth/history/{email}")
def get_history(email: str):
    return {"history": db_manager.get_chat_history(email)}

# --- UNIFIED AGENTIC ENGINE ---
class UnifiedRequest(BaseModel):
    query: str
    context: Optional[str] = ""
    language: Optional[str] = "English"
    jurisdiction: Optional[str] = "India"
    persona: Optional[str] = "innovator"
    user_email: Optional[str] = None

@app.post("/api/unified")
def unified_endpoint(request: UnifiedRequest):
    result = process_unified_query(
        request.query, request.context, request.language, 
        request.jurisdiction, request.persona
    )
    if request.user_email and result.get("action") == "answer":
        db_manager.save_chat(request.user_email, request.query, result)
    return result

# --- USP 1: RISK SCORE ---
class RiskScoreRequest(BaseModel):
    ingredients: List[str]
    classical_text: bool
    novel_processing: bool

@app.post("/api/risk-score")
def risk_score_endpoint(request: RiskScoreRequest):
    risk = calculate_risk_score(request.ingredients, request.classical_text, request.novel_processing)
    classification = classify_product(request.ingredients, request.classical_text, request.novel_processing)
    return {"risk": risk, "classification": classification}

# --- USP 3: DEFENSIVE PUBLICATION ---
class DefensivePubRequest(BaseModel):
    ingredients: List[str]
    method: Optional[str] = ""
    prior_art: Optional[str] = ""
    classical_text: bool = True
    novel_processing: bool = False

@app.post("/api/defensive-pub")
def defensive_pub_endpoint(request: DefensivePubRequest):
    risk = calculate_risk_score(request.ingredients, request.classical_text, request.novel_processing)
    pub = generate_defensive_publication(request.ingredients, request.method, request.prior_art, risk)
    return {"publication": pub, "risk": risk}

# --- USP 5: ABS SIMULATOR ---
class ABSRequest(BaseModel):
    ingredients: List[str]
    is_commercial: bool
    uses_traditional_knowledge: bool

@app.post("/api/abs-simulate")
def abs_simulate_endpoint(request: ABSRequest):
    return simulate_abs_obligations(request.ingredients, request.is_commercial, request.uses_traditional_knowledge)

# --- USP 8: TIMESTAMPING ---
class TimestampRequest(BaseModel):
    disclosure_text: str

@app.post("/api/timestamp")
def timestamp_endpoint(request: TimestampRequest):
    return generate_timestamp_proof(request.disclosure_text)

# --- USP 12: PATHWAY MATRIX ---
@app.get("/api/pathway-matrix")
def pathway_matrix_endpoint():
    return {"matrix": get_pathway_matrix()}

# --- HEALTH ---
@app.get("/")
def health_check():
    return {"status": "IP-Shakti Sahayak Backend is running!", "version": "2.0"}

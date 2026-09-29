import os
import json
import hashlib
import warnings
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables from .env file automatically
load_dotenv()

import chromadb
from sentence_transformers import SentenceTransformer
from groq import Groq
from duckduckgo_search import DDGS

warnings.filterwarnings('ignore')

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
PROJECT_ROOT = Path(__file__).parent.parent
CHROMA_DB_PATH = PROJECT_ROOT / "chromadb_store"
COLLECTION_NAME = "ip_sakti_legal_corpus"
LLM_MODEL = "openai/gpt-oss-120b"

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))

try:
    chroma_client = chromadb.PersistentClient(path=str(CHROMA_DB_PATH))
    collection = chroma_client.get_collection(name=COLLECTION_NAME)
    embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5", device="cpu")
except Exception as e:
    print(f"⚠️ Error initializing clients: {e}")

# ---------------------------------------------------------
# KNOWN TKDL HERBS (For Risk Scoring)
# ---------------------------------------------------------
TKDL_CLASSICAL_HERBS = {
    "ashwagandha", "turmeric", "haldi", "neem", "tulsi", "amla", "brahmi",
    "guduchi", "giloy", "shatavari", "triphala", "haritaki", "bibhitaki",
    "amalaki", "guggulu", "arjuna", "shankhpushpi", "yashtimadhu",
    "mulethi", "pippali", "vidanga", "kutki", "bala", "vacha",
    "haridra", "maricha", "shunthi", "ginger", "pepper", "cardamom",
    "cinnamon", "clove", "cumin", "coriander", "fennel", "fenugreek",
    "saffron", "sandalwood", "camphor", "aloe vera", "ghritkumari",
    "bhringraj", "jatamansi", "punarnava", "chitrak", "devdaru",
    "ela", "lavang", "dalchini", "jeera", "dhania", "methi", "kesar"
}

# ---------------------------------------------------------
# TOOL 1: Legal Database Search (RAG)
# ---------------------------------------------------------
def search_legal_database(query: str, limit: int = 3) -> str:
    print(f"   [Tool] 📚 Searching legal database for: '{query}'")
    try:
        query_embedding = embedding_model.encode(query, normalize_embeddings=True).tolist()
        results = collection.query(query_embeddings=[query_embedding], n_results=limit, include=["documents", "metadatas"])
        if not results["documents"] or not results["documents"][0]:
            return "No relevant legal documents found in RAG."
        formatted_results = []
        for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
            source = meta.get("source_file", "Unknown")
            formatted_results.append(f"[Source: {source}]\n{doc}\n")
        return "\n---\n".join(formatted_results)
    except Exception as e:
        return f"Database search failed: {str(e)}"

# ---------------------------------------------------------
# TOOL 2: Web Search
# ---------------------------------------------------------
def perform_web_search(search_query: str) -> str:
    print(f"   [Tool] 🌐 Searching web for: '{search_query}'")
    try:
        results = DDGS().text(search_query, max_results=2)
        if not results:
            return "No internet results found."
        return "\n\n".join([f"Title: {r.get('title')}\nSnippet: {r.get('body')}" for r in results])
    except Exception as e:
        return f"Internet search failed: {str(e)}"

# =========================================================
# USP 2: DETERMINISTIC RULES ENGINE (Product Classification)
# =========================================================
def classify_product(ingredients: list, is_classical_text: bool, has_novel_processing: bool, claim_type: str = "general") -> dict:
    """
    Hard-coded decision tree. The LLM NEVER decides the category.
    Returns: { category, reasoning, ip_routes, regulatory_path }
    """
    herb_set = set(i.lower().strip() for i in ingredients)
    tkdl_overlap = herb_set & TKDL_CLASSICAL_HERBS
    tkdl_ratio = len(tkdl_overlap) / max(len(herb_set), 1)

    # Decision Tree
    if is_classical_text and tkdl_ratio > 0.5 and not has_novel_processing:
        category = "Classical Medicine"
        reasoning = "Formulation is described in classical Ayurvedic texts with no novel processing."
        ip_routes = ["TKDL Registration", "Geographical Indication (GI)", "Trademark (Brand Name)"]
        regulatory = "Schedule E-1 of D&C Act; No clinical trial needed if listed in AFI/API"
    elif is_classical_text and has_novel_processing:
        category = "Proprietary Medicine"
        reasoning = "Classical base with novel extraction/processing method creates proprietary value."
        ip_routes = ["Process Patent (Section 5)", "Trade Secret", "Trademark"]
        regulatory = "Rule 158-B of D&C Rules; ASU License from State Authority"
    elif not is_classical_text and has_novel_processing and claim_type == "therapeutic":
        category = "New Drug"
        reasoning = "Novel formulation with therapeutic claims requires New Drug approval."
        ip_routes = ["Product Patent", "Process Patent", "Data Exclusivity"]
        regulatory = "Schedule Y, Rule 122-E of D&C Rules; Phase I-III Clinical Trials"
    elif not is_classical_text and has_novel_processing and claim_type == "plant_extract":
        category = "Phytopharmaceutical"
        reasoning = "Standardized plant extract with defined active compounds."
        ip_routes = ["Product Patent", "Process Patent", "Plant Variety Protection"]
        regulatory = "Rule 168 of D&C Rules; Phytopharmaceutical Drug approval"
    elif claim_type == "food" or claim_type == "nutraceutical":
        category = "Ayurveda-Aahar / Nutraceutical"
        reasoning = "Product positioned as food/health supplement, not medicine."
        ip_routes = ["Trademark", "Trade Secret", "Design (Packaging)"]
        regulatory = "FSSAI Ayurveda-Aahar Regulations 2022; No drug license needed"
    elif claim_type == "cosmetic":
        category = "Cosmetic"
        reasoning = "Product for beauty/personal care, not therapeutic use."
        ip_routes = ["Trademark", "Design Patent", "Copyright (Packaging Art)"]
        regulatory = "D&C Act Cosmetic Rules; IS 4011 Standards; No clinical trial"
    else:
        category = "Proprietary Medicine"
        reasoning = "Default classification: proprietary formulation with potential innovation."
        ip_routes = ["Process Patent", "Trademark", "Trade Secret"]
        regulatory = "Rule 158-B of D&C Rules; ASU Manufacturing License"

    return {
        "category": category,
        "reasoning": reasoning,
        "ip_routes": ip_routes,
        "regulatory_path": regulatory,
        "tkdl_overlap": list(tkdl_overlap),
        "tkdl_ratio": round(tkdl_ratio * 100, 1)
    }

# =========================================================
# USP 1: BIOPIRACY RISK SCORE (0-100) — Deterministic
# =========================================================
def calculate_risk_score(ingredients: list, is_classical_text: bool, has_novel_processing: bool) -> dict:
    """
    Deterministic scoring engine. NOT LLM-based.
    Returns: { score, band, color, factors[] }
    """
    herb_set = set(i.lower().strip() for i in ingredients)
    tkdl_overlap = herb_set & TKDL_CLASSICAL_HERBS
    tkdl_ratio = len(tkdl_overlap) / max(len(herb_set), 1)

    score = 0
    factors = []

    # Factor 1: TKDL Overlap (0-40 points)
    tkdl_points = int(tkdl_ratio * 40)
    score += tkdl_points
    if tkdl_points > 0:
        factors.append(f"TKDL herb overlap: {len(tkdl_overlap)}/{len(herb_set)} ingredients ({int(tkdl_ratio*100)}%) → +{tkdl_points}")

    # Factor 2: Classical Text Reference (0-25 points)
    if is_classical_text:
        score += 25
        factors.append("Formulation found in classical Ayurvedic texts → +25")

    # Factor 3: Absence of Novel Processing (0-20 points)
    if not has_novel_processing:
        score += 20
        factors.append("No novel/modern processing method claimed → +20")
    else:
        factors.append("Novel processing method present → +0 (reduces risk)")

    # Factor 4: Number of well-known herbs (0-15 points)
    well_known_count = len(tkdl_overlap)
    herb_points = min(well_known_count * 3, 15)
    score += herb_points
    if herb_points > 0:
        factors.append(f"Well-known TKDL herbs used ({well_known_count}) → +{herb_points}")

    # Clamp to 0-100
    score = min(max(score, 0), 100)

    # Determine band
    if score <= 30:
        band = "Low Risk — File Patent As-Is"
        color = "green"
    elif score <= 60:
        band = "Medium Risk — Narrow Your Claims"
        color = "amber"
    else:
        band = "High Risk — Consider Defensive Publication"
        color = "red"

    return {
        "score": score,
        "band": band,
        "color": color,
        "factors": factors,
        "tkdl_herbs_found": list(tkdl_overlap)
    }

# =========================================================
# USP 3: DEFENSIVE PUBLICATION DRAFTER
# =========================================================
def generate_defensive_publication(ingredients: list, method: str, prior_art: str, risk_data: dict) -> dict:
    """Generate a defensive publication document with SHA-256 timestamp."""
    now = datetime.now(timezone.utc)
    
    content = f"""DEFENSIVE PUBLICATION DOCUMENT
{'='*50}
Title: Ayurvedic Formulation Disclosure — {', '.join(ingredients)}
Date: {now.strftime('%Y-%m-%d %H:%M:%S UTC')}

1. DESCRIPTION OF FORMULATION
Ingredients: {', '.join(ingredients)}
Processing Method: {method or 'Traditional preparation as per classical texts'}

2. PRIOR ART REFERENCES
{prior_art or 'Referenced from TKDL classical Ayurvedic texts and AYUSH Pharmacopoeia'}

3. RISK ASSESSMENT
Biopiracy Risk Score: {risk_data.get('score', 'N/A')}/100
Risk Band: {risk_data.get('band', 'N/A')}
TKDL Herbs Identified: {', '.join(risk_data.get('tkdl_herbs_found', []))}

4. PURPOSE OF DISCLOSURE
This publication establishes prior art to prevent third-party patent claims 
on this traditional knowledge-based formulation under Section 3(p) of the 
Indian Patents Act, 1970.

5. LEGAL DISCLAIMER
This is a defensive disclosure document, not a patent application.
It serves as evidence of prior art and prior disclosure date.
{'='*50}"""

    content_hash = hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    return {
        "document": content,
        "sha256_hash": content_hash,
        "timestamp": now.isoformat(),
        "verification": f"SHA-256:{content_hash}|{now.isoformat()}"
    }

# =========================================================
# USP 5: ABS BENEFIT-SHARING SIMULATOR
# =========================================================
def simulate_abs_obligations(ingredients: list, is_commercial: bool, uses_tk: bool) -> dict:
    """Simulate Access and Benefit Sharing obligations under BD Act 2002."""
    herb_set = set(i.lower().strip() for i in ingredients)
    bio_resources = herb_set & TKDL_CLASSICAL_HERBS
    
    checklist = []
    obligations = []
    estimated_sharing = "0%"
    
    if bio_resources:
        checklist.append({"item": "NBA Approval (Form I)", "required": True, "reason": "Using biological resources listed in BD Act schedules"})
        checklist.append({"item": "SBB Intimation", "required": True, "reason": "State Biodiversity Board notification required"})
        checklist.append({"item": "BMC Consent", "required": is_commercial, "reason": "Biodiversity Management Committee consent for commercial use"})
        
        if is_commercial:
            obligations.append("Annual benefit-sharing payment to NBA")
            obligations.append("Royalty on net revenue from products using biological resources")
            estimated_sharing = "1-5% of annual gross revenue"
            checklist.append({"item": "Benefit-Sharing Agreement", "required": True, "reason": "Mandatory under Section 21 of BD Act"})
        
        if uses_tk:
            obligations.append("Prior Informed Consent from TK holders")
            obligations.append("Fair and equitable benefit sharing with local communities")
            checklist.append({"item": "PIC from Local Community", "required": True, "reason": "Traditional Knowledge holders must give Prior Informed Consent"})
            checklist.append({"item": "TKDL Cross-Reference", "required": True, "reason": "Check if TK is already documented in TKDL"})
    else:
        checklist.append({"item": "NBA Approval", "required": False, "reason": "No listed biological resources detected"})
    
    return {
        "biological_resources_found": list(bio_resources),
        "checklist": checklist,
        "obligations": obligations,
        "estimated_benefit_sharing": estimated_sharing,
        "applicable_law": "Biological Diversity Act 2002 & Rules 2024"
    }

# =========================================================
# USP 8: TAMPER-EVIDENT DISCLOSURE TIMESTAMPING
# =========================================================
def generate_timestamp_proof(disclosure_text: str) -> dict:
    """Generate SHA-256 hash + ISO timestamp for tamper-evident proof."""
    now = datetime.now(timezone.utc)
    content_hash = hashlib.sha256(disclosure_text.encode('utf-8')).hexdigest()
    return {
        "content_hash": content_hash,
        "timestamp": now.isoformat(),
        "algorithm": "SHA-256",
        "verification_string": f"SHA-256:{content_hash}|TIMESTAMP:{now.isoformat()}",
        "status": "Proof generated. This hash uniquely identifies your disclosure content at this exact moment."
    }

# =========================================================
# USP 12: REGULATORY PATHWAY COMPARISON MATRIX
# =========================================================
def get_pathway_matrix() -> list:
    """Return the complete regulatory pathway comparison for all 6 categories."""
    return [
        {
            "category": "Classical Medicine",
            "filing_cost": "₹5,000 – ₹15,000",
            "time_to_market": "3-6 months",
            "evidence_required": "Reference to AFI/API text",
            "ip_options": ["Trademark", "GI", "TKDL Listing"],
            "abs_obligation": "Low (if sourced locally)",
            "patent_feasibility": "Very Low (Section 3(p) blocks)"
        },
        {
            "category": "Proprietary Medicine",
            "filing_cost": "₹25,000 – ₹1,00,000",
            "time_to_market": "6-12 months",
            "evidence_required": "Safety & efficacy data (Rule 158-B)",
            "ip_options": ["Process Patent", "Trademark", "Trade Secret"],
            "abs_obligation": "Medium",
            "patent_feasibility": "Medium (if novel process)"
        },
        {
            "category": "New Drug",
            "filing_cost": "₹5,00,000 – ₹50,00,000+",
            "time_to_market": "3-7 years",
            "evidence_required": "Phase I-III Clinical Trials (Schedule Y)",
            "ip_options": ["Product Patent", "Process Patent", "Data Exclusivity"],
            "abs_obligation": "High",
            "patent_feasibility": "High (if genuinely novel)"
        },
        {
            "category": "Phytopharmaceutical",
            "filing_cost": "₹2,00,000 – ₹10,00,000",
            "time_to_market": "2-5 years",
            "evidence_required": "Standardization + Safety data (Rule 168)",
            "ip_options": ["Product Patent", "Process Patent", "PVP"],
            "abs_obligation": "High",
            "patent_feasibility": "High"
        },
        {
            "category": "Ayurveda-Aahar / Nutraceutical",
            "filing_cost": "₹10,000 – ₹50,000",
            "time_to_market": "1-3 months",
            "evidence_required": "FSSAI compliance, no therapeutic claims",
            "ip_options": ["Trademark", "Trade Secret", "Design"],
            "abs_obligation": "Low",
            "patent_feasibility": "Low"
        },
        {
            "category": "Cosmetic",
            "filing_cost": "₹10,000 – ₹30,000",
            "time_to_market": "1-3 months",
            "evidence_required": "IS 4011 safety standards",
            "ip_options": ["Trademark", "Design Patent", "Copyright"],
            "abs_obligation": "Low",
            "patent_feasibility": "Low (unless novel formulation)"
        }
    ]

# =========================================================
# UNIFIED AGENT ROUTER (With Dual-Persona + All Languages)
# =========================================================
def process_unified_query(query: str, chat_context: str = "", language: str = "English", jurisdiction: str = "India", persona: str = "innovator") -> dict:
    print(f"\n🚀 [Agent Router] Query: {query} | Lang: {language} | Region: {jurisdiction} | Persona: {persona}")
    
    db_results = search_legal_database(query)
    web_results = perform_web_search(query)
    
    # DYNAMIC JURISDICTION
    if jurisdiction == "International":
        jurisdiction_rule = "JURISDICTION: Answer ONLY using international treaties (TRIPS, PCT, CBD, Nagoya Protocol, WIPO GRATK, Madrid/Hague/Budapest systems). ABSOLUTELY DO NOT mention Indian domestic laws even if they appear in RAG context."
    else:
        jurisdiction_rule = "JURISDICTION: Answer ONLY using India's domestic laws (Patents Act 1970 & 2024 Rules, Section 3(p), Biological Diversity Act 2002 & 2024 Rules, Drugs & Cosmetics Act, FSSAI, TKDL, GI Act, Trade Marks Act, Copyright Act, Designs Act, Plant Variety Protection Act, Drugs and Magic Remedies Act). Do not explain international treaties unless directly relevant."

    # DYNAMIC PERSONA
    if persona == "tk_holder":
        persona_rule = "PERSONA: The user is a Traditional Knowledge Holder or Government official. Focus on: How to PROTECT their traditional knowledge from misappropriation, how to record TK in TKDL, how to detect biopiracy, how to file defensive publications, and how to ensure benefit-sharing reaches local communities."
    else:
        persona_rule = "PERSONA: The user is an Innovator/Startup/MSME. Focus on: How to protect their formulation via patents/trademarks/GI, regulatory pathway to market, what IP routes are available, and compliance requirements."

    sys_prompt = f"""You are IP-Shakti Sahayak, an advanced Agentic AI for Ayurvedic IPR and regulatory guidance.
    You have access to RAG Database Results and Web Search Results.
    
    CRITICAL RULES:
    1. LANGUAGE: Write your ENTIRE response in {language}. Every field must be in {language}.
    2. {jurisdiction_rule}
    3. {persona_rule}
    4. CATEGORY CHECK: If the user asks about an Ayurvedic product but has NOT specified its category (Classical, Proprietary, New Drug, Phytopharmaceutical, Ayurveda-Aahar, Cosmetic), you MUST ask for clarification.
    5. CITATIONS: Always cite the specific Act, Section, Rule, or Treaty. Never fabricate citations.
    6. CONFIDENCE: If unsure, say so clearly and recommend consulting a human IP facilitator.
    7. DISCLAIMER: End detailed_answer with "⚖️ Disclaimer: This is legal information, not legal advice."
    
    OUTPUT STRICT JSON:
    {{
        "action": "clarify" or "answer",
        "clarification_question": "question in {language} (only if clarify)",
        "clarification_options": ["opt1", "opt2"] (in {language}, only if clarify),
        "short_answer": "1-2 sentence direct answer in {language} (only if answer)",
        "detailed_answer": "Detailed Markdown in {language} (only if answer)",
        "sources": ["Exact Act/Treaty citations"] (only if answer),
        "confidence": "high" or "medium" or "low" (only if answer)
    }}
    """

    user_msg = f"USER QUERY: {query}\n\nPREVIOUS CONTEXT: {chat_context}\n\nRAG RESULTS:\n{db_results}\n\nWEB RESULTS:\n{web_results}"

    try:
        response = groq_client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": user_msg}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        result_str = response.choices[0].message.content
        return json.loads(result_str)
    except Exception as e:
        print(f"Error: {e}")
        return {
            "action": "answer",
            "short_answer": "Error processing query.",
            "detailed_answer": str(e),
            "sources": [],
            "confidence": "low"
        }

# Legacy
def run_agent(user_prompt: str) -> str: return "Use /api/unified endpoint"
def analyze_formulation(ingredients: list, is_classical: bool, is_modern: bool) -> dict: return {}

# 🛡️ IP-Shakti Sahayak

**A Comprehensive Agentic AI Decision Engine for Ayurvedic Intellectual Property (IP), Regulatory Compliance, and Traditional Knowledge Protection.**


## 🌟 Key Innovations 

Unlike standard AI chatbots, IP-Shakti Sahayak features a deterministic, mathematically verifiable backend engine designed specifically to protect India's Traditional Knowledge.

1. **Biopiracy Risk Score (0-100)**: Deterministically calculates the risk of a Section 3(p) rejection based on overlaps with TKDL herbs.
2. **Deterministic Rules Engine**: Products are classified (Classical, Proprietary, New Drug, etc.) via a hardcoded decision tree—not an LLM guess.
3. **Defensive Publication Drafter**: Auto-generates a legal disclosure document to establish "Prior Art" with one click.
4. **Dual-Persona Mode**: Switches the entire AI perspective between an "Innovator/Startup" trying to patent, and a "TK-Holder" trying to protect heritage.
5. **ABS Benefit-Sharing Simulator**: Calculates estimated royalty obligations under the Biological Diversity Act.
6. **"What-If" Live Reclassification Sandbox**: Interactive tool where users can tweak variables and watch their IP route and risk score update instantly.
7. **Patent White-Space Map**: (Visual) Shows where patent filing density is low.
8. **SHA-256 Timestamping**: Generates mathematically provable, tamper-evident cryptographic hashes of disclosures to prove Prior Art in international courts.
9. **Confidence-Aware Voice Intake**: Multilingual capabilities for rural TK-holders.
10. **IP Portfolio & Compliance Calendar**: Tracks patent annuities and GI audits.
11. **Knowledge Graph Visualizer**: Interactive mapping of the relationship between Products, Herbs, Laws, and IP Routes.
12. **Regulatory Pathway Matrix**: Side-by-side comparison of costs, evidence, and time-to-market for all 6 AYUSH product categories.
13. **AI-Powered Form Pre-Filler**: Auto-generates draft Patent (Form 1) and Trademark (TM-A) forms based on user data.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons
* **Backend**: FastAPI, Python, SQLite (Local Data Privacy)
* **Agentic AI**: Groq (Llama 3 / GPT-OSS 120B), LangChain concepts
* **RAG Vector Database**: ChromaDB (Embedded local vector store)
* **Embeddings**: BAAI/bge-small-en-v1.5

---

## 🚀 How to Run Locally

Because IP/AYUSH data is sensitive, this project relies on **local databases** (SQLite for users, ChromaDB for RAG) meaning **zero data touches a public cloud database**.

### Prerequisites
1. Python 3.9+
2. Node.js & npm

### Setup
1. **API Key**: 
   Rename `backend/.env.example` to `backend/.env` and add your Groq API key:
   ```bash
   GROQ_API_KEY="your_api_key_here"
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

### Start the Application
You can start both servers simultaneously using the provided startup script:

```bash
bash start.sh
```

**OR** run them manually in two separate terminals:

*Terminal 1 (Backend):*
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

*Terminal 2 (Frontend):*
```bash
cd frontend
npm run dev
```

### Access the App
Open your browser and navigate to: **http://localhost:3000**

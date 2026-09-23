# Automated Bank Reconciliation System (No-AI Engine)

> **STRICT NO-AI REQUIREMENT GUARANTEE**  
> This project contains **ZERO** Artificial Intelligence, Machine Learning, Large Language Models, or external AI APIs (No OpenAI, Gemini, Claude, Ollama, or ML models). All document parsing, header auto-detection, date/amount normalization, and transaction matching rely exclusively on traditional software engineering, regular expressions, heuristic rules, and deterministic string similarity metrics (Levenshtein, Jaro-Winkler, and Token analysis).

---

## 📌 Project Overview

An enterprise-grade full-stack **Automated Bank Reconciliation Web Application** designed to automate financial reconciliation between accounting software exports (TallyPrime, Busy, Zoho Books, Marg) and bank statements across multiple formats (PDF, Excel `.xlsx`/`.xls`, CSV).

---

## 🛠️ Technology Stack

- **Backend**: Spring Boot 3.2.4 (Java 17 / 25)
- **Security**: Spring Security with JWT Authentication & BCrypt Password Hashing
- **Database**: Spring Data MongoDB with **MongoDB Atlas** support (`mongodb+srv://`) and local MongoDB fallback
- **Parsers**: Apache POI (Excel XLSX/XLS), Apache PDFBox (PDF), OpenCSV (CSV)
- **Deterministic String Algorithms**: Apache Commons Text (Levenshtein & Jaro-Winkler string similarity)
- **Reporting**: Apache POI (Multi-tab Excel reports), OpenPDF (Executive PDF reports)
- **Frontend**: React 18 (Vite), React Router DOM v6, Axios, Lucide Icons, Custom SaaS CSS Design System

---

## 🚀 Environment Configuration & Prerequisites

### 1. Prerequisites
- **Java 17+** (Java 25 verified)
- **Node.js 18+** (v26 verified)
- **MongoDB Atlas Connection URI** or **Local MongoDB Instance** (`localhost:27017`)

### 2. Environment Setup (`.env` or `application.properties`)

Set the `MONGODB_URI` environment variable for your **MongoDB Atlas** cluster:

```bash
# Example MongoDB Atlas URI
export MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/bank_reconciliation?retryWrites=true&w=majority"
```

Or configure directly in `backend/src/main/resources/application.properties`:
```properties
server.port=8080
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/bank_reconciliation}
app.jwt.secret=9a2f8c3e7d1b5a4f6e8c0d2b4a6f8e0c2d4b6a8f1e3c5d7b9a2f4e6c8d0b2a4
```

---

## 🏃 How to Run the Application

### 1. Run Backend (Spring Boot API)
Navigate to the `backend/` folder and run Maven Spring Boot plugin:

```bash
cd backend
..\..\tools\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
The backend API will start at: `http://localhost:8080`

### 2. Run Frontend (React Vite UI)
In a new terminal window, navigate to the `frontend/` folder:

```bash
cd frontend
npm run dev
```
The frontend application will start at: `http://localhost:5173`

---

## 🎯 Deterministic Multi-Level Matching Algorithm

1. **Level 1 — Exact Reference + Amount Match (Score: 100)**: Matches transactions sharing exact UTR / Reference numbers and identical numeric amounts.
2. **Level 2 — Exact Amount + Exact Date Match (Score: 90)**: Matches transactions on identical amounts and exact transaction dates.
3. **Level 3 — Amount + Date Tolerance Match (Score: 80 - 89)**: Matches transactions with identical amounts occurring within a configurable date window (0 - 5 days).
4. **Level 4 — Amount + Description Fuzzy Similarity (Score: 70 - 89)**: Uses Levenshtein Distance & Jaro-Winkler string similarity to match narration text (e.g. `ABC TRADERS` vs `NEFT/ABC TRADERS PVT LTD/N12345678`).
5. **Level 5 — Amount Discrepancy & Duplicate Detection**: Flags reference/date matches with conflicting amounts as `AMOUNT_MISMATCH` and detects identical internal entries as `DUPLICATE`.
6. **Strict Locking**: Once a transaction pair is matched auto or manually, both items are locked to prevent double-matching.

---

## 📋 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user / admin |
| `POST` | `/api/auth/login` | Login & acquire JWT token |
| `GET` | `/api/dashboard` | Aggregated dashboard statistics |
| `POST` | `/api/reconciliations` | Create new reconciliation session |
| `GET` | `/api/reconciliations` | Get reconciliation history list |
| `POST` | `/api/reconciliations/{id}/accounting-file` | Upload & parse Accounting File |
| `POST` | `/api/reconciliations/{id}/bank-file` | Upload & parse Bank Statement |
| `POST` | `/api/reconciliations/{id}/process` | Run deterministic matching engine |
| `GET` | `/api/reconciliations/{id}/transactions` | Query & filter transactions |
| `POST` | `/api/matches/{id}/confirm` | Manually confirm candidate match |
| `POST` | `/api/matches/{id}/reject` | Manually reject candidate match |
| `GET` | `/api/reconciliations/{id}/report/pdf` | Download PDF reconciliation report |
| `GET` | `/api/reconciliations/{id}/report/excel` | Download multi-sheet Excel report |
| `GET` | `/api/sample-data/accounting-excel` | Download test accounting Excel |
| `GET` | `/api/sample-data/bank-excel` | Download test bank Excel |

---

## 🧪 Testing with Pre-packaged Sample Files

Instant sample test files are built right into the application dashboard:
1. Click **Accounting Excel** or **Bank Excel** download shortcuts on the dashboard.
2. Click **New Reconciliation**.
3. Upload `sample-accounting.xlsx` and `sample-bank.xlsx`.
4. Click **Execute Reconciliation Engine** to view automatic exact matches, date tolerance matches, and match reason explanations!

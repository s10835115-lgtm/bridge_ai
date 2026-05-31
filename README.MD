# CrackAi — Smart Crack Detection & Predictive Maintenance

CrackAi is a full-stack inspection platform for bridge and infrastructure monitoring, combining:
- AI-based crack detection
- Structural severity scoring
- Generative maintenance reports
- React dashboard UI
- Flask backend API

## Project Overview

This repository includes two main applications:

1. **Backend** (`backend/`)
   - Flask API for image upload, crack analysis, inspection records, and report generation
   - TensorFlow-based crack detection model
   - OpenAI integration for GPT-powered maintenance recommendations
   - MySQL + SQLAlchemy persistence

2. **Frontend** (`frontend/`)
   - CrackAi React dashboard application
   - Tailwind CSS styling
   - Dashboard pages for inspections, analytics, and reports
   - Axios-powered API communication

## Folder Structure

```text
backend/        # Flask API server and AI pipeline
frontend/       # React UI and client-side application
DATA_Maguire_20180517_ALL/  # Source datasets for model training
```

## Prerequisites

- macOS / Linux / Windows with WSL
- Python 3.12+ for backend
- Node.js 18+ and npm for frontend
- Git for repository management
- Optional: MySQL server for production database

## Complete Setup

### 1. Clone the repository

```bash
git clone https://github.com/s10835115-lgtm/bridge_ai.git
cd bridge_ai
```

### 2. Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

> If you use Windows PowerShell:
> ```powershell
> .\.venv\Scripts\Activate.ps1
> ```

#### Create `.env`

In `backend/`, create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=mysql+pymysql://user:password@host:port/database
FLASK_ENV=development
JWT_SECRET_KEY=your_secret_key
```

#### Start the backend server

```bash
cd backend
source .venv/bin/activate
python run.py
```

Or from the repo root:

```bash
./backend/.venv/bin/python backend/run.py
```

The backend listens on:
- `http://127.0.0.1:5001`
- `http://0.0.0.0:5001`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, typically:
- `http://localhost:5173`

### 4. Run Both Apps Together

- Start backend first
- Start frontend second
- Use the frontend dashboard to access camera upload, inspection, and reports

## Useful Commands

### Backend
- `source backend/.venv/bin/activate` — activate backend virtual environment
- `pip install -r backend/requirements.txt` — install backend dependencies
- `python backend/run.py` — run backend server
- `pytest backend` — run backend tests

### Frontend
- `cd frontend`
- `npm install`
- `npm run dev` — start development server
- `npm run build` — build production assets
- `npm run preview` — preview built frontend

## Git Notes

- The repo remote is already configured to `https://github.com/s10835115-lgtm/bridge_ai.git`
- Keep generated folders out of Git:
  - `backend/.venv/`
  - `frontend/node_modules/`
  - `frontend/dist/`
- The `.gitignore` file excludes local virtualenvs, node modules, and OS artifacts.

## Troubleshooting

- If `tensorflow.keras.applications` cannot be resolved, ensure the backend venv is active and `tensorflow` is installed in that environment.
- If the frontend camera page does not load, confirm the backend is running and the browser is allowed to access the webcam.
- If `npm run dev` fails, delete `frontend/node_modules/` and rerun `npm install`.

## Additional Documentation

- See `backend/README.md` for backend architecture, API route details, and report generation information.
- See `frontend/` source files for UI pages, camera integration, and dashboard routes.

## License

This repository is released under the terms of the license specified by the project owner.


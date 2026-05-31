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

## Key Features

- Automatic crack detection from uploaded images
- Severity scoring and heatmap generation
- PDF report generation for structural inspections
- JWT-secured API routes
- Dashboard analytics and inspection management

## Folder Structure

```text
backend/        # Flask API server and AI pipeline
frontend/       # React UI and client-side application
DATA_Maguire_20180517_ALL/  # Source datasets for model training
```

## Getting Started

### Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### Configure Environment

Create a `.env` file in `backend/` with the following values:

```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=mysql+pymysql://user:password@host:port/database
FLASK_ENV=development
JWT_SECRET_KEY=your_secret_key
```

#### Run Backend

```bash
./venv/bin/python run.py
```

If you activate the environment first, you can also use:

```bash
source .venv/bin/activate
python run.py
```

The backend server starts on `http://0.0.0.0:5001` (and `http://127.0.0.1:5001`) by default.

> Note: the API requires user registration before login. If you call protected routes such as `/api/upload` or `/api/auth/login` without valid credentials, the server returns `401 Unauthorized`.
>
> If OpenAI quota is exhausted, report generation may still return a JSON error message from the GPT API.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite development URL shown in the terminal (typically `http://localhost:5173`).

## Available Commands

### Backend
- `python run.py` — start Flask backend
- `pytest` — run backend tests from `backend/test_*` files

### Frontend
- `npm run dev` — start development server
- `npm run build` — build production bundle
- `npm run preview` — preview production build

## Testing

Run backend tests from the repository root or inside `backend/`:

```bash
cd backend
pytest
```

## Notes

- The backend includes TensorFlow model loading and OpenCV preprocessing.
- The frontend uses React 19, Tailwind CSS, and Recharts for analytics visualization.
- For production, use a proper database service and secure JWT secret management.

## Related Documentation

- See `backend/README.md` for backend-specific architecture and API details.

## License

This repository is released under the terms of the license specified by the project owner.


# CrackAI - Smart Crack Detection Backend

Production-quality Flask backend for the Generative AI Based Smart Crack Detection and Predictive Maintenance for Bridges project.

## Tech Stack
- **Python / Flask**
- **OpenAI GPT-4o** (Generative AI Analysis)
- **TensorFlow / Keras** (AI Inference)
- **OpenCV** (Image Preprocessing)
- **MySQL** with SQLAlchemy ORM

## Project Structure
```text
backend/
├── app/
│   ├── routes/       # API route definitions
│   └── uploads/      # Image storage
├── ai/
│   ├── gpt/          # Generative AI & Reports
│   ├── inference/    # CNN Prediction engine
│   └── preprocessing/ # OpenCV pipeline
```

## AI Integration Setup

### 1. OpenAI Configuration
Add your OpenAI API key to the `.env` file:
```env
OPENAI_API_KEY=your_actual_key_here
```

### 2. Requirements
Install the updated dependencies:
```bash
pip install -r requirements.txt
```

### 3. PDF Report Generation
The system uses `FPDF` and `ReportLab` to generate structural engineering reports. Reports are saved in `backend/app/reports/`.

## API Documentation

### Generative AI & Reports
- `GET /api/ai/recommendation/<id>` - Get GPT-4 maintenance strategy (Protected)
- `POST /api/ai/generate-report/<id>` - Generate and save PDF engineering report (Protected)
- `GET /api/reports` - List all generated reports

### Inspections & AI Analysis
- `POST /api/upload` - Secure image upload + **Real-time AI Analysis** (Protected)
  - Returns: Crack detection results, severity, confidence, and heatmap path.
- `GET /api/inspections` - List all inspections (Paginated, Searchable)
- `POST /api/inspections` - Create new inspection record
- `GET /api/inspections/<id>` - Get specific inspection details
- `DELETE /api/inspections/<id>` - Remove inspection record

### Dashboard & Analytics
- `GET /api/dashboard/stats` - High-level summary metrics
- `GET /api/dashboard/activity` - Recent system activity feed
- `GET /api/dashboard/analytics` - Severity distribution and monthly trends

### Reports
- `GET /api/reports` - List all generated reports
- `POST /api/reports` - Create a new structural report

## Security Features
- **JWT Authorization**: All sensitive routes are protected by JWT tokens.
- **Password Security**: Hashing via Bcrypt (salted).
- **CORS Support**: Configured for secure cross-origin requests.
- **File Validation**: Restricted to JPG, PNG, JPEG with size limits.
- **Clean Architecture**: Decoupled routes, models, and business logic.

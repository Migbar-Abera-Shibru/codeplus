# CodePulse 

> Transform any GitHub profile into a stunning, shareable developer intelligence report

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC.svg)](https://tailwindcss.com/)

---

##  Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [License](#-license)
- [Contributing](#-contributing)

---

## Overview

**CodePulse** is a GitHub activity analyzer that transforms raw repository data into beautiful, shareable developer insights — think **Spotify Wrapped for developers**.

Enter any public GitHub username and instantly generate a comprehensive report featuring:
-  **Language distribution** with interactive charts
-  **Contribution heatmap** and streak analysis
-  **Project complexity scores** (proprietary algorithm)
-  **Collaboration insights**
-  **Auto-generated developer summary**
-  **Shareable report URLs**

Perfect for:
-  **Job seekers** building their portfolio
-  **Recruiters** evaluating candidates
-  **Developers** understanding their own patterns
-  **Open source contributors** tracking their impact

---

##  Features

### Core Features

| Feature | Description |
|---------|-------------|
|  **Profile Analysis** | Enter any GitHub username and get instant insights |
|  **Language Distribution** | Interactive pie chart showing your language usage |
|  **Activity Heatmap** | Visual contribution calendar with streak tracking |
|  **Complexity Score** | Proprietary algorithm scoring repositories 0-100 |
|  **Developer Summary** | Auto-generated profile summary |
|  **Shareable Reports** | Permanent URLs to share your developer report |
|  **Collaboration Insights** | Understand your network and community impact |
|  **Responsive Design** | Works on all devices |

### Coming Soon

-  **Language evolution over time** (stacked area charts)
-  **Side-by-side developer comparison**
-  **Embeddable profile badges**
-  **Email digests**
-  **AI-powered narrative generation**

---

##  Screenshots

<p align="center">
  <img src="./img/lading.png" alt="Home Page" width="800"/>
  <br/>
  <em>Beautiful landing page with search functionality</em>
</p>

<p align="center">
  <img src="./img/report1.png" alt="Developer Report" width="800"/>
  <br/>
  <em>Comprehensive developer report dashboard</em>
</p>

<p align="center">
  <img src="./img/landing2.png" alt="Developer Report 2" width="800"/>
  <br/>
  <em>Comprehensive developer report dashboard 2</em>
</p>
---

##  Quick Start

Get CodePulse running in 2 minutes with SQLite:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/codepulse.git
cd codepulse

# 2. Set up backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Configure SQLite (no Docker needed!)
echo "DATABASE_URL=sqlite+aiosqlite:///./codepulse.db" > .env

# 4. Run migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# 5. Start backend
uvicorn app.main:app --reload --port 8000

# 6. Set up frontend (new terminal)
cd ../frontend
npm install
npm run dev

# 7. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

---

##  Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | REST API framework |
| **SQLAlchemy** | ORM with async support |
| **Alembic** | Database migrations |
| **PostgreSQL / SQLite** | Database (PostgreSQL recommended, SQLite for dev) |
| **httpx** | Async HTTP client for GitHub API |
| **Pydantic** | Data validation |
| **python-dotenv** | Environment configuration |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Recharts** | Charts |
| **TanStack Query** | Server state management |
| **Axios** | HTTP client |

---

##  Project Structure

```
codepulse/
├── backend/
│   ├── app/
│   │   ├── api/              # Route handlers
│   │   │   └── v1/
│   │   │       ├── analyze.py
│   │   │       ├── auth.py
│   │   │       └── share.py
│   │   ├── core/             # Config, settings, security
│   │   │   └── config.py
│   │   ├── db/               # Database session
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── models/           # SQLAlchemy models
│   │   │   └── profile.py
│   │   ├── schemas/          # Pydantic schemas
│   │   │   └── report.py
│   │   ├── services/         # Business logic
│   │   │   ├── analyzer.py
│   │   │   ├── cache.py
│   │   │   └── github_client.py
│   │   └── main.py           # FastAPI app entry point
│   ├── alembic/              # Migrations
│   ├── tests/                # Unit tests
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API clients
│   │   ├── lib/              # Utilities
│   │   ├── App.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml        # Docker setup (optional)
├── .gitignore
└── README.md
```

---

##  Installation

### Prerequisites

- **Python 3.11+** and pip
- **Node.js 18+** and npm
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/codepulse.git
cd codepulse
```

### Step 2: Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Set Up Frontend

```bash
cd frontend
npm install
```

---

##  Configuration

### Database Options

#### Option A: SQLite (Recommended for Development)

No installation needed! Just update `.env`:

```env
DATABASE_URL=sqlite+aiosqlite:///./codepulse.db
```

#### Option B: PostgreSQL (Recommended for Production)

**With Docker:**
```bash
docker-compose up -d postgres
```

**Without Docker:**
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create database: `CREATE DATABASE codepulse;`
3. Update `.env`:
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/codepulse
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# App Configuration
APP_NAME=CodePulse
DEBUG=true
SECRET_KEY=your_jwt_secret_key_here

# Database
DATABASE_URL=sqlite+aiosqlite:///./codepulse.db

# GitHub OAuth (Optional for development)
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_API_TOKEN=your_github_personal_access_token

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### GitHub OAuth Setup (Optional)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - **Application name:** CodePulse Local
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `http://localhost:8000/api/v1/auth/github/callback`
3. Copy Client ID and Client Secret to `.env`

---

##  Running the Application

### With Docker (Recommended for Production)

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

### Without Docker (Development)

#### Terminal 1 - Backend

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate

# Run migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

### Access the Application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **API Documentation** | http://localhost:8000/api/docs |
| **Health Check** | http://localhost:8000/health |

---

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/analyze/{username}` | Get developer report |
| `GET` | `/api/v1/analyze/{username}?force_refresh=true` | Force refresh (bypass cache) |
| `POST` | `/api/v1/share/{username}/generate` | Generate shareable link |
| `GET` | `/api/v1/share/{share_token}` | Get shared report |
| `GET` | `/api/v1/auth/github/login` | GitHub OAuth login |
| `GET` | `/api/v1/auth/github/callback` | GitHub OAuth callback |

### Example Response

```json
{
  "username": "torvalds",
  "display_name": "Linus Torvalds",
  "avatar_url": "https://avatars.githubusercontent.com/u/1024025?v=4",
  "followers": 314456,
  "public_repos": 12,
  "top_languages": [
    {"language": "C", "percentage": 78.5},
    {"language": "Python", "percentage": 15.2},
    {"language": "Shell", "percentage": 6.3}
  ],
  "consistency_score": 35.7,
  "complexity_score": 101.3,
  "collaboration_score": 100.0,
  "overall_score": 74.6,
  "total_commits_90d": 0,
  "active_days_90d": 30,
  "longest_streak_days": 19,
  "current_streak_days": 19,
  "developer_type": "Systems Developer",
  "profile_summary": "Linus Torvalds is a highly consistent developer who primarily works in C..."
}
```

---

##  Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

##  Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- **Backend:** PEP 8 (run `ruff check .`)
- **Frontend:** ESLint + Prettier (run `npm run lint`)

---

##  Roadmap

- [ ] Organization-level analytics
- [ ] Side-by-side developer comparison
- [ ] Embeddable profile badges
- [ ] Email digests
- [ ] AI-powered narrative generation
- [ ] GitLab and Bitbucket support

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

- Built with ❤️ by developers, for developers
- Powered by the [GitHub API](https://docs.github.com/en/rest)
- Inspired by Spotify Wrapped

---

##  Contact

- **GitHub:** [@your-username](https://github.com/Migbar-Abera-Shibru)

---

<p align="center">
  <img src="https://via.placeholder.com/100x100/1a1a2e/667eea?text=CP" alt="CodePulse Logo" width="100" height="100"/>
  <br/>
  <strong>CodePulse</strong>
  <br/>
  <em>Turn your GitHub profile into a story worth sharing</em>
  <br/><br/>
  <a href="https://codepulse.dev">Website</a> ·
  <a href="https://github.com/your-username/codepulse/issues">Report Bug</a> ·
  <a href="https://github.com/your-username/codepulse/issues">Request Feature</a>
</p>
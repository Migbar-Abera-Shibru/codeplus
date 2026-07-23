# CodePluse Documentation

---

```markdown
# CodePulse 🔥

> GitHub Activity Analyzer & Developer Insights Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

CodePulse transforms raw GitHub data into beautiful, shareable developer insights.
Think **Spotify Wrapped — but for your code**. Analyze any public GitHub profile to
uncover language trends, contribution consistency, project complexity scores,
collaboration patterns, and more.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running Locally](#running-locally)
- [Usage Guide](#usage-guide)
- [Project Complexity Score](#project-complexity-score)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

### Core Analytics
- **Language Distribution Over Time** — See how your language usage has evolved
  month by month, not just a static snapshot
- **Contribution Heatmap & Streak Analysis** — Visualize consistency, longest
  streaks, and productivity patterns across years
- **Project Complexity Score** — A proprietary algorithm that scores repositories
  based on size, structure, dependency depth, contributor count, and activity
- **Collaboration Graph** — Discover who you work with most and map your
  open-source network

### Social & Sharing
- **Shareable Report URLs** — Generate a public, permanent link to your developer
  report (e.g., `codepulse.dev/report/torvalds`)
- **Developer Profile Summary** — A human-readable summary card describing your
  coding identity, suitable for portfolios and LinkedIn
- **Side-by-Side Developer Comparison** — Compare two GitHub profiles across all
  metrics simultaneously

### Technical
- **GitHub OAuth Login** — Secure authentication with elevated API rate limits
- **Smart API Caching** — PostgreSQL-backed result caching to respect GitHub rate
  limits and deliver fast repeat lookups
- **Public Profile Analysis** — Analyze any public GitHub username without
  requiring that user to log in

---

## Tech Stack

| Layer      | Technology              | Purpose                                      |
|------------|-------------------------|----------------------------------------------|
| Frontend   | React 18 + Vite         | UI framework and build tooling               |
| Charts     | Recharts + D3.js        | Data visualizations and heatmaps             |
| Backend    | Python 3.11 + FastAPI   | REST API, data processing, scoring algorithm |
| Database   | PostgreSQL 15           | Caching GitHub API results, storing reports  |
| Auth       | GitHub OAuth 2.0        | Secure login and elevated API rate limits    |
| Deploy FE  | Vercel                  | Frontend hosting and CDN                     |
| Deploy BE  | Railway                 | Backend hosting and managed PostgreSQL       |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│              React + Recharts + D3.js                   │
│                   (Vercel CDN)                          │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST
┌────────────────────────▼────────────────────────────────┐
│                    FastAPI Backend                       │
│                     (Railway)                           │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Auth Layer │  │ Analysis     │  │  Report       │  │
│  │  (OAuth)    │  │ Engine       │  │  Generator    │  │
│  └─────────────┘  └──────┬───────┘  └───────────────┘  │
│                          │                              │
│  ┌───────────────────────▼──────────────────────────┐   │
│  │           PostgreSQL Cache Layer                 │   │
│  │   (API results, reports, user sessions)          │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ GitHub REST API v3
                         │ GitHub GraphQL API v4
┌────────────────────────▼────────────────────────────────┐
│                   GitHub API                            │
│         (Repos, Commits, Events, Users)                 │
└─────────────────────────────────────────────────────────┘
```
```
---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18+ and npm v9+
- **Python** 3.11+
- **PostgreSQL** 15+
- **Git**
- A **GitHub OAuth App** (see [Environment Setup](#environment-setup))

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/codepulse.git
cd codepulse
```

**2. Install backend dependencies**

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Environment Setup

#### Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set the following:
   - **Application name:** CodePulse (Local)
   - **Homepage URL:** `http://localhost:5173`
   - **Authorization callback URL:** `http://localhost:8000/auth/callback`
4. Copy your **Client ID** and **Client Secret**

#### Backend Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# Application
APP_ENV=development
SECRET_KEY=your-secret-key-min-32-chars-long-here

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/codepulse

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/callback

# GitHub API (optional: personal access token for higher rate limits during dev)
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# Cache settings
CACHE_TTL_SECONDS=3600
REPORT_CACHE_TTL_SECONDS=86400

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend Environment Variables

Create a `.env` file in the `/frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

#### Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE codepulse;"

# Run migrations
cd backend
alembic upgrade head
```

---

### Running Locally

**Start the backend** (from `/backend` with venv activated):

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
Interactive API docs at `http://localhost:8000/docs`

**Start the frontend** (from `/frontend` in a new terminal):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---


# VaakSuraksha Web

AI-Powered Real-Time Detection & Prevention of Voice Cloning Impersonation Attacks  
Built for Smart India Hackathon 2026 (PS 26104)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Vercel Postgres / Neon / Supabase)
- npm or pnpm

### Local Development

```bash
# Clone and install
cd vaaksuraksha-web
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your database URL

# Initialize database
npm run db:init

# Seed accuracy metrics
npm run db:seed

# Start development server
npm run dev
```

Open http://localhost:3000

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Run database init
docker-compose exec app npm run db:init

# Stop
docker-compose down
```

## 📦 Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vaaksuraksha-web.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `POSTGRES_URL` - Your PostgreSQL connection string
   - `NODE_ENV=production`
4. Deploy

### 3. Database Setup (Vercel Postgres)
1. In Vercel dashboard, go to Storage → Create Database → Postgres
2. Copy the connection string
3. Add as `POSTGRES_URL` environment variable
4. Run migrations: `npx tsx scripts/init-db.ts` (locally with production URL)

## 🗂️ Project Structure

```
vaaksuraksha-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── accuracy/route.ts    # GET /api/accuracy
│   │   │   └── health/route.ts      # GET /api/health
│   │   ├── accuracy/                # Model accuracy page
│   │   ├── dashboard/               # Live risk monitor
│   │   ├── about/                   # About page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── LanguageProvider.tsx     # i18n context
│   │   ├── LanguageSelector.tsx     # Language dropdown
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── AccuracyTable.tsx
│   │   ├── RiskMeter.tsx
│   │   └── LayerBars.tsx
│   ├── lib/
│   │   └── db.ts                    # Database queries
│   ├── locales/
│   │   ├── index.ts                 # Locale exports
│   │   ├── en.ts                    # English
│   │   ├── hi.ts                    # Hindi
│   │   ├── mr.ts                    # Marathi
│   │   ├── gu.ts                    # Gujarati
│   │   ├── ta.ts                    # Tamil
│   │   ├── bn.ts                    # Bengali
│   │   └── te.ts                    # Telugu
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   └── scripts/
│       ├── init-db.ts               # Database initialization
│       └── seed-accuracy.ts         # Seed accuracy data
├── sql/
│   └── schema.sql                   # PostgreSQL schema
├── public/
├── Dockerfile
├── docker-compose.yml
├── vercel.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🌐 Supported Languages (7)

| Code | Language | Native |
|------|----------|--------|
| `en` | English | English |
| `hi` | Hindi | हिंदी |
| `mr` | Marathi | मराठी |
| `gu` | Gujarati | ગુજરાતી |
| `ta` | Tamil | தமிழ் |
| `bn` | Bengali | বাংলা |
| `te` | Telugu | తెలుగు |

Language preference is saved in `localStorage` and auto-detected from browser.

## 📊 Features

### Home Page
- Hero section with CTAs
- 4-step process: Detect → Decide → Prevent → Protect
- Responsive design with Tailwind CSS

### Model Accuracy (`/accuracy`)
- Overall metrics (EER, AUC, F1, FPR@95% Recall)
- Per-language breakdown (7 Indian languages)
- Per-codec robustness (G.711, AMR-NB, GSM, Opus, Clean)
- Unseen generator generalization test
- Model architecture details

### Live Dashboard (`/dashboard`)
- Real-time risk meter with circular progress
- Multi-layer score breakdown (L1-L4 + Context)
- Configurable policy thresholds (General / High-Value / Privileged)
- Active challenge simulation
- Risk score timeline visualization
- Status-based action recommendations

### About (`/about`)
- Problem statement & solution overview
- Technology stack
- Key differentiators
- Stakeholder impact
- Ethics & responsible use

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accuracy` | GET | Model accuracy metrics |
| `/api/health` | GET | Health check |

## 🗄️ Database Schema

Key tables:
- `accuracy_metrics` - Model performance data
- `sessions` - Call session tracking
- `risk_scores` - Time-series risk data
- `policies` - Scenario-based thresholds
- `audit_ledger` - Tamper-evident hash chain
- `voiceprints` - Enrolled speaker embeddings

## 🛡️ Security Headers

Configured in `vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 📝 License

MIT License - Built for Smart India Hackathon 2026

## 👥 Team

VaakSuraksha Team - PS 26104  
AICTE Cyber Security Cell · Software · Blockchain & Cybersecurity
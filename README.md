# EchoGuard: Auto-QA & Coaching Platform

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Dashboard Features](#dashboard-features)
- [Role-Based Access Control](#role-based-access-control)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**EchoGuard** is an AI-powered Auto-QA (Quality Assurance) and Coaching Platform designed for call centers. It provides real-time call monitoring, automated quality scoring, and personalized coaching insights for agents, supervisors, and administrators.

### Key Purpose
- **Automate quality assurance** of customer service calls
- **Provide data-driven insights** to improve agent performance
- **Enable supervisors** to manage teams and coaching workflows
- **Give admins** complete visibility and control over the platform

### Target Users
- **Agents**: View personal performance, receive coaching insights, access SOPs
- **Supervisors**: Monitor team performance, manage coaching, track metrics
- **Admins**: System administration, user management, analytics, configuration

---

## ✨ Features

### 📊 Dashboards

| Role | Dashboard Features |
|------|-------------------|
| **Agent** | Personal call history, quality scores, coaching insights, performance trends, individual SOPs |
| **Supervisor** | Team analytics, agent performance comparison, call monitoring, coaching assignments, team SOPs |
| **Admin** | System-wide analytics, user management, platform settings, all calls & evaluations, scoring configuration |

### 🎯 Core Capabilities

| Feature | Description |
|---------|------------|
| **Call Management** | Track inbound/outbound calls with duration, status (completed/dropped/transferred), and recordings |
| **Auto-QA Scoring** | Automated evaluation of calls with category-based scoring (0-100), SOP compliance checks |
| **Evaluations** | Detailed QA breakdowns with category scores, strengths, improvement areas, SOP violations |
| **Coaching System** | AI-driven coaching insights (strengths, improvements, tips, warnings) with priority levels |
| **Alerts** | Real-time alerts for supervisors/admins on critical issues, low scores, SOP violations |
| **SOPs** | Standard Operating Procedures library with versioning, categories, and active/inactive states |
| **Transcripts** | Full call transcripts with speaker labels for quality review and coaching |
| **Team Management** | Supervisor-agent relationships, user roles (Agent, Supervisor, Admin) |
| **Metrics & Analytics** | Aggregated performance metrics, trend analysis, team comparisons |

### 📈 Data Aggregation Logic

- **Average Call Score**: Mean of all evaluation scores for a time period
- **Call Volume**: Count of calls by agent/team/status
- **Compliance Rate**: Percentage of calls with no SOP violations
- **Average Duration**: Mean call length per agent
- **Performance Trends**: Score progression over time
- **Coach Effectiveness**: Agent score improvement post-coaching

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** (or **pnpm**/**yarn**)
- **PostgreSQL 14+** (or Neon for cloud hosting)
- **Git**

### 5-Minute Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/EchoGuard.git
cd EchoGuard

# Install dependencies
pnpm install
# or: npm install

# Set up environment variables
cp .env.example .env.local

# Set up database and seed demo data
npm run setup:db

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo Login Credentials** (after seeding):
- **Admin**: `admin@demo.com` / `password123`
- **Supervisor**: `supervisor@demo.com` / `password123`
- **Agent**: `agent@demo.com` / `password123`

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/EchoGuard.git
cd EchoGuard
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# JWT Secret (change this in production!)
JWT_SECRET=your-secret-key-change-in-production

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: File Storage
NEXT_PUBLIC_STORAGE_BUCKET=your-storage-bucket
```

#### Getting Your Database URL

**Option A: Neon (Recommended for Development)**
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project and database
3. Copy the connection string from the dashboard
4. Paste into `DATABASE_URL` in `.env.local`

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Windows: Download from https://www.postgresql.org/download/windows/
# Linux: sudo apt-get install postgresql

# Create database
createdb echoguard

# Set CONNECTION string
DATABASE_URL=postgresql://postgres:password@localhost:5432/echoguard
```

### 4. Database Setup & Seeding

```bash
# Run database schema creation
psql $DATABASE_URL < scripts/setup-database.sql

# Seed demo data (users, calls, evaluations, SOPs)
psql $DATABASE_URL < scripts/seed-data.sql

# Alternative: Using Node.js script
node scripts/hash-password.js  # Generate password hashes if needed
```

### 5. Run Development Server

```bash
npm run dev
# or: pnpm dev
# or: yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 6. Build for Production

```bash
npm run build
npm start

# or
pnpm build
pnpm start
```

---

## 🗄️ Database Schema

### Tables Overview

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| `users` | User accounts with roles (agent/supervisor/admin) | `supervisor_id` → self-join |
| `sessions` | Authentication tokens and sessions | `user_id` → users |
| `calls` | Call records with metadata | `agent_id` → users |
| `transcripts` | Full call transcripts and speaker labels | `call_id` → calls |
| `evaluations` | QA scores and feedback | `call_id` → calls, `reviewed_by` → users |
| `coaching_insights` | AI-generated coaching recommendations | `agent_id` → users, `call_id` → calls |
| `alerts` | Notifications for supervisors/admins | `user_id` → users, `related_agent_id` → users |
| `sops` | Standard Operating Procedures library | `created_by` → users |
| `scoring_config` | Scoring category weights and criteria | N/A |

### Detailed Schema

#### `users` - User Accounts
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('agent', 'supervisor', 'admin')),
  supervisor_id INTEGER REFERENCES users(id),  -- Self-reference for agent→supervisor
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `calls` - Call Records
```sql
CREATE TABLE calls (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES users(id),
  customer_phone VARCHAR(50),
  call_type VARCHAR(20) CHECK (call_type IN ('inbound', 'outbound')),
  duration_seconds INTEGER NOT NULL,
  status VARCHAR(50) CHECK (status IN ('completed', 'dropped', 'transferred')),
  recording_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `evaluations` - QA Scores
```sql
CREATE TABLE evaluations (
  id SERIAL PRIMARY KEY,
  call_id INTEGER NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 100),
  category_scores JSONB,  -- e.g., {"greeting": 90, "resolution": 85, "tone": 95}
  strengths TEXT[],       -- e.g., ["Great tone", "Quick resolution"]
  improvements TEXT[],    -- e.g., ["Needs better empathy"]
  sop_violations JSONB,   -- e.g., {"protocols": ["Greeting", "Closing"]}
  auto_generated BOOLEAN DEFAULT true,
  reviewed_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `coaching_insights` - AI Coaching
```sql
CREATE TABLE coaching_insights (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES users(id),
  call_id INTEGER REFERENCES calls(id) ON DELETE SET NULL,
  insight_type VARCHAR(100) CHECK (insight_type IN ('strength', 'improvement', 'tip', 'warning')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high')),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `alerts` - Supervisor/Admin Notifications
```sql
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  alert_type VARCHAR(100) NOT NULL,  -- e.g., "low_score", "sop_violation", "coaching_pending"
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(50) CHECK (severity IN ('info', 'warning', 'critical')),
  related_call_id INTEGER REFERENCES calls(id),
  related_agent_id INTEGER REFERENCES users(id),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `sops` - Standard Operating Procedures
```sql
CREATE TABLE sops (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100),  -- e.g., "Communication", "Compliance", "Customer Service"
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Relationships

```
users (admin/supervisor)
  ├─ supervisor_id → users (self-reference)
  └─ Many roles manage agents

calls
  ├─ agent_id → users(agent)
  └─ One agent has many calls

evaluations
  ├─ call_id → calls
  └─ reviewed_by → users(admin/supervisor)

coaching_insights
  ├─ agent_id → users(agent)
  └─ call_id → calls

alerts
  ├─ user_id → users(supervisor/admin)
  ├─ related_agent_id → users(agent)
  └─ related_call_id → calls
```

---

## 🔌 API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login with email/password, returns JWT token |
| `/api/auth/logout` | POST | Logout and clear session |
| `/api/auth/me` | GET | Get current user profile |

**Example: Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@demo.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 4,
    "email": "agent@demo.com",
    "name": "John Smith",
    "role": "agent",
    "supervisor_id": 2
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Admin Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/stats` | GET | System-wide analytics |
| `/api/admin/users` | GET | All users with filters |
| `/api/admin/users` | POST | Create new user |
| `/api/admin/calls` | GET | All calls with pagination |
| `/api/admin/evaluations` | GET | All evaluations |

**Example: Get Admin Stats**
```bash
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "totalUsers": 8,
  "totalCalls": 24,
  "averageScore": 87.5,
  "totalEvaluations": 24,
  "callsByStatus": {
    "completed": 22,
    "dropped": 1,
    "transferred": 1
  },
  "usersByRole": {
    "agent": 5,
    "supervisor": 2,
    "admin": 1
  }
}
```

### Agent Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agent/dashboard` | GET | Personal call history & metrics |
| `/api/agent/calls` | GET | My calls with pagination |
| `/api/agent/coaching` | GET | My coaching insights |
| `/api/agent/evaluations` | GET | My call evaluations |

**Example: Get Agent Dashboard**
```bash
curl http://localhost:3000/api/agent/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "user": {
    "id": 4,
    "name": "John Smith",
    "email": "agent@demo.com"
  },
  "stats": {
    "totalCalls": 5,
    "averageScore": 89.2,
    "compliance": 100,
    "avgDuration": 319
  },
  "recentCalls": [
    {
      "id": 1,
      "customerPhone": "+1-555-0101",
      "callType": "inbound",
      "duration": 342,
      "status": "completed",
      "score": 91,
      "createdAt": "2024-01-30T10:30:00Z"
    }
  ]
}
```

### Supervisor Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/supervisor/dashboard` | GET | Team analytics & metrics |
| `/api/supervisor/team` | GET | My team agents |
| `/api/supervisor/calls` | GET | Team calls |
| `/api/supervisor/evaluations` | GET | Team evaluations |
| `/api/supervisor/alerts` | GET | My alerts |

**Example: Get Supervisor Dashboard**
```bash
curl http://localhost:3000/api/supervisor/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "supervisor": {
    "id": 2,
    "name": "Sarah Johnson"
  },
  "teamStats": {
    "totalAgents": 3,
    "totalCalls": 12,
    "averageTeamScore": 88.1,
    "callsThisWeek": 12,
    "complianceRate": 98
  },
  "agentPerformance": [
    {
      "id": 4,
      "name": "John Smith",
      "callsToday": 2,
      "averageScore": 89.2,
      "lastCallAt": "2024-01-30T10:30:00Z"
    }
  ],
  "alerts": [
    {
      "id": 1,
      "type": "low_score",
      "title": "Agent Score Below Threshold",
      "severity": "warning",
      "relatedAgent": "David Brown"
    }
  ]
}
```

---

## 📊 Dashboard Features

### Agent Dashboard
- **My Performance**: Current shift metrics, today's calls, average score
- **Recent Calls**: List of recent calls with quality scores
- **Coaching Insights**: Personalized coaching recommendations
- **SOPs**: Access to standard operating procedures
- **Performance Trend**: 7-day/30-day score trends

### Supervisor Dashboard
- **Team Overview**: Team size, call volume, average team score
- **Agent Performance Board**: Ranking of agents by score/calls
- **Call Monitoring**: Recent team calls with scores
- **Coaching Queue**: Agents needing coaching, pending insights
- **Alerts**: Critical alerts and SOP violations
- **Team Trends**: Performance charts and analytics

### Admin Dashboard
- **System Statistics**: Total users, calls, evaluations
- **User Management**: Create/edit/delete users and roles
- **Platform Analytics**: System-wide trends and patterns
- **Call Library**: Browse all calls with advanced filtering
- **Evaluation Logs**: QA history and reviewer notes
- **Configuration**: Scoring weights, alert thresholds, SOP categories
- **System Health**: Database status, API health checks

---

## 🔐 Role-Based Access Control (RBAC)

### Role Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  Admin (Highest Privilege)                              │
│  ✓ System-wide access                                   │
│  ✓ User management                                      │
│  ✓ All analytics & reports                              │
│  ✓ Platform configuration                               │
└─────────────────────────────────────────────────────────┘
          ▲
          │
┌─────────────────────────────────────────────────────────┐
│  Supervisor (Team Management)                           │
│  ✓ Team performance analytics                           │
│  ✓ Agent management & coaching                          │
│  ✓ Team call monitoring                                 │
│  ✗ Other team data (can only see own team)              │
└─────────────────────────────────────────────────────────┘
          ▲
          │
┌─────────────────────────────────────────────────────────┐
│  Agent (Individual Contributors)                        │
│  ✓ Personal performance data                            │
│  ✓ Own calls & evaluations                              │
│  ✓ Personal coaching insights                           │
│  ✗ Other agent data                                     │
└─────────────────────────────────────────────────────────┘
```

### Permission Matrix

| Feature | Agent | Supervisor | Admin |
|---------|-------|-----------|-------|
| View own dashboard | ✓ | ✓ | ✓ |
| View own calls | ✓ | ✓ | ✓ |
| View own evaluations | ✓ | ✓ | ✓ |
| View team data | ✗ | ✓ | ✓ |
| View all data | ✗ | ✗ | ✓ |
| Manage users | ✗ | ✗ | ✓ |
| Create SOPs | ✗ | ✓ | ✓ |
| Manage alerts | ✗ | ✓ | ✓ |
| Access coaching | ✓ | ✓ | ✓ |
| Configure scoring | ✗ | ✗ | ✓ |

### Access Control Implementation

Access is controlled via middleware in `/app/api/` routes:

```typescript
// Example: Admin-only endpoint
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Admin logic here
}
```

---

## 🆘 Troubleshooting

### Common Issues

#### Dashboard Showing "0" or "NaN" Values

**Cause**: Seed data not properly loaded or database connection issue

**Solution**:
```bash
# Verify database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"

# Re-seed the database
psql $DATABASE_URL < scripts/setup-database.sql
psql $DATABASE_URL < scripts/seed-data.sql

# Check API logs
npm run dev  # Look for errors in terminal
```

#### "Unauthorized" Error When Logging In

**Cause**: Token not properly generated or expired

**Solution**:
1. Verify `JWT_SECRET` is set in `.env.local`
2. Check that password hash matches in database:
   ```bash
   psql $DATABASE_URL -c "SELECT email, password_hash FROM users LIMIT 5;"
   ```
3. Try regenerating password hash:
   ```bash
   node scripts/hash-password.js
   ```

#### Agent Dashboard Shows Empty Calls

**Cause**: Calls not associated with correct agent_id or agent doesn't exist

**Solution**:
```bash
# Check agents in database
psql $DATABASE_URL -c "SELECT id, name, role FROM users WHERE role='agent';"

# Check calls for specific agent
psql $DATABASE_URL -c "SELECT * FROM calls WHERE agent_id=4;"

# Check agent's supervisor assignment
psql $DATABASE_URL -c "SELECT id, name, supervisor_id FROM users WHERE role='agent';"
```

#### Role-Based Access Not Working

**Cause**: User role not properly set or middleware not checking role

**Solution**:
1. Verify user role in database:
   ```bash
   psql $DATABASE_URL -c "SELECT email, role FROM users WHERE email='supervisor@demo.com';"
   ```
2. Check middleware in API route
3. Clear browser cookies/cache and re-login

#### Evaluations Not Showing for Calls

**Cause**: Evaluations not created for calls or call_id mismatch

**Solution**:
```bash
# Check if evaluations exist
psql $DATABASE_URL -c "SELECT call_id, total_score FROM evaluations LIMIT 10;"

# Check if call_id matches
psql $DATABASE_URL -c "SELECT c.id, c.agent_id, e.id FROM calls c LEFT JOIN evaluations e ON c.id = e.call_id LIMIT 10;"

# Manually create evaluation if needed
psql $DATABASE_URL << EOF
INSERT INTO evaluations (call_id, total_score, category_scores, auto_generated)
VALUES (1, 85, '{"greeting": 90, "resolution": 85, "tone": 80}', true);
EOF
```

#### Database Connection Error

**Cause**: Invalid DATABASE_URL or database server down

**Solution**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT NOW();"

# For Neon, verify connection string:
# postgresql://user:password@host.neon.tech/dbname?sslmode=require

# For local PostgreSQL, verify server is running:
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Services > PostgreSQL > Start
```

#### Seed Data Not Persisting

**Cause**: Transaction rolled back or incorrect SQL syntax

**Solution**:
```bash
# Check for SQL errors
psql $DATABASE_URL -f scripts/seed-data.sql

# Re-run with verbose output
psql $DATABASE_URL -a -f scripts/seed-data.sql

# Verify data was inserted
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM calls;"
```

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/EchoGuard.git
   cd EchoGuard
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Use TypeScript for all new code
   - Add comments for complex logic
   - Test your changes locally

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new coaching feature"
   ```

   **Commit conventions:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation updates
   - `refactor:` Code refactoring
   - `test:` Test additions/updates
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Include screenshots for UI changes
   - Wait for review and address feedback

### Branching Strategy

```
main (production)
  ├─ develop (staging)
  │   ├─ feature/dashboard-improvements
  │   ├─ feature/api-optimization
  │   ├─ fix/login-bug
  │   └─ ...
```

### Code Style Guidelines

- **TypeScript**: Use strict types, avoid `any`
- **React**: Use functional components with hooks
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: Add comments for non-obvious logic
- **Testing**: Write tests for new features

### Development Workflow

```bash
# Install dependencies
pnpm install

# Start development server
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
You are free to:
- ✓ Use commercially
- ✓ Modify the code
- ✓ Distribute the software
- ✓ Use for private purposes

With the condition that:
- ⓘ Include a copy of the license
- ⓘ Include a copyright notice

---

## 📞 Support & Contact

- **Report Issues**: [GitHub Issues](https://github.com/yourusername/EchoGuard/issues)
- **Email**: support@echoguard.example.com
- **Documentation**: [Full API Reference](API_REFERENCE.md)

---

## 🎉 Thank You!

Thank you for using EchoGuard! We hope it helps improve your team's performance and customer satisfaction.

**Happy coaching! 🚀**

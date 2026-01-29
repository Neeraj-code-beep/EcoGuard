# EchoGuard - Setup & Testing Guide

## Overview
EchoGuard is an Auto-QA & Coaching Platform designed to help contact centers improve call quality through AI-powered evaluation and coaching insights.

## Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL database (Neon recommended for serverless)
- Python 3.8+ (for backend MongoDB server, optional)
- Git

## Backend Setup

### 1. Database Configuration
EchoGuard uses PostgreSQL (tested with Neon). The schema is automatically set up via SQL scripts.

#### Option A: Neon Database (Recommended for Development)
1. Create a free Neon account at https://neon.tech
2. Create a new project and copy the connection string
3. Set `DATABASE_URL` environment variable

#### Option B: Local PostgreSQL
```bash
# Create database
createdb echoguard_db

# Set connection string
export DATABASE_URL="postgresql://user:password@localhost:5432/echoguard_db"
```

### 2. Initialize Database Schema
```bash
# Apply schema (from scripts/setup-database.sql)
psql $DATABASE_URL < scripts/setup-database.sql

# Seed demo data (from scripts/seed-data.sql)
psql $DATABASE_URL < scripts/seed-data.sql
```

### 3. Environment Variables
Create `.env.local` in the root directory:
```
# Database
DATABASE_URL=postgresql://user:password@your-neon-host/dbname

# JWT Secret (for production, use a strong random string)
JWT_SECRET=your-secure-jwt-secret-change-in-production

# Node Environment
NODE_ENV=development
```

## Frontend Setup

### 1. Install Dependencies
```bash
# Using npm
npm install

# Or using pnpm (faster)
pnpm install
```

### 2. Build Configuration
All required build and dev configurations are in place:
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration

### 3. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## Authentication & Demo Users

### Pre-seeded Demo Users
The database includes three demo users (created by seed-data.sql):

**Agent Account**
- Email: `agent@demo.com`
- Password: `password123`
- Role: Agent
- Supervisor: Demo Supervisor

**Supervisor Account**
- Email: `supervisor@demo.com`
- Password: `password123`
- Role: Supervisor
- Agents: Manages demo agents

**Admin Account**
- Email: `admin@demo.com`
- Password: `password123`
- Role: Admin
- Access: Organization-wide management

**Note:** Change all passwords in production!

## Architecture Overview

### API Routes Organization
```
app/api/
├── auth/
│   ├── login       # User authentication
│   ├── logout      # Session termination
│   └── me          # Current user info
├── admin/
│   ├── stats       # Organization metrics
│   ├── calls       # All calls
│   ├── users       # User management
│   ├── analytics   # Analytics dashboard
│   └── settings    # Configuration
├── agent/
│   ├── stats       # Agent performance
│   ├── calls       # Agent's calls
│   └── coaching    # Coaching insights
├── supervisor/
│   ├── stats       # Team metrics
│   ├── team        # Team member listing
│   ├── calls       # Team calls
│   └── evaluations # Evaluation review
└── sops/           # Standard Operating Procedures
```

### Database Schema
The system uses PostgreSQL with the following core tables:

- **users** - User accounts with role-based access (agent, supervisor, admin)
- **calls** - Call records with metadata
- **evaluations** - QA scores and feedback (auto-generated or manual)
- **transcripts** - Call transcripts
- **coaching_insights** - Personalized coaching tips
- **alerts** - System notifications
- **sops** - Standard operating procedures
- **sessions** - User authentication sessions
- **scoring_config** - QA scoring configuration

## Application Flow

### Agent Dashboard
1. Login with agent credentials
2. View performance metrics (calls today, avg score, pending coaching)
3. Access "My Calls" to review call history with evaluations
4. View "Coaching" tab for personalized improvement tips
5. Mark coaching insights as acknowledged

### Supervisor Dashboard
1. Login with supervisor credentials
2. View team metrics (team size, team calls, avg score)
3. Access "Team Performance" for detailed agent analytics
4. Review "Team Calls" with supervisor controls
5. Manage "Evaluations" from team's calls
6. View SOPs and alert notifications

### Admin Dashboard
1. Login with admin credentials
2. View organization metrics (total users, calls, org avg score)
3. Access "Analytics" for comprehensive reporting
4. Manage "Users" (create, edit, assign to supervisors)
5. Configure "Settings" for scoring and alerts
6. Review all "Calls" across organization
7. Manage "SOPs" for standardization

## Key Features Implementation

### 1. Role-Based Access Control
- **Agent**: Can only see their own calls and coaching
- **Supervisor**: Can view and manage agents under them
- **Admin**: Full organizational access

### 2. Call Evaluation Pipeline
```
Call Created → Transcript Generated → Auto-Evaluation → 
Coaching Generated → Agent Reviews → Insights Acknowledged
```

### 3. Performance Metrics
- Individual agent scores
- Team aggregate performance
- Organization-wide analytics
- Trend analysis (week-over-week comparison)

### 4. Data Relationships
- **Evaluations** are always joined via calls (evaluation → call → agent)
- **Agents** are linked to supervisors via `supervisor_id`
- **Coaching insights** are targeted at agents
- **Alerts** are assigned to individual users

## Testing the Application

### Login & Navigation Test
1. Navigate to `http://localhost:3000/login`
2. Try all three demo accounts
3. Verify proper dashboard rendering for each role
4. Test navigation menu visibility based on role

### Agent Testing
1. Login as `agent@demo.com`
2. View dashboard stats (should show call data)
3. Navigate to "My Calls" (should list agent's calls with evaluations)
4. Navigate to "Coaching" (should show insights)
5. Mark an insight as read

### Supervisor Testing
1. Login as `supervisor@demo.com`
2. View team dashboard (should show agents)
3. Navigate to "Team Performance" (should show detailed agent cards)
4. Navigate to "Team Calls" (should show team's calls)
5. Navigate to "Evaluations" (should show evaluations)

### Admin Testing
1. Login as `admin@demo.com`
2. View dashboard stats (should show organization metrics)
3. Navigate to "Analytics" (should show charts)
4. Navigate to "All Calls" (should show all calls)
5. Navigate to "Users" (should list all users)
6. Navigate to "Settings" (should show configuration)

### API Testing with cURL
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@demo.com","password":"password123"}'

# Check current user
curl http://localhost:3000/api/auth/me

# Get agent stats
curl http://localhost:3000/api/agent/stats

# Get supervisor team
curl http://localhost:3000/api/supervisor/team

# Get admin stats
curl http://localhost:3000/api/admin/stats
```

## Troubleshooting

### Database Connection Issues
```
Error: "ECONNREFUSED"
- Check DATABASE_URL is correctly set
- Verify database is running
- Try: psql $DATABASE_URL to test connection
```

### Missing Demo Data
```
Error: "No calls found"
- Run: psql $DATABASE_URL < scripts/seed-data.sql
- Verify tables exist: \dt in psql
```

### Authentication Issues
```
Error: "Not authenticated"
- Clear browser cookies
- Check JWT_SECRET is set
- Verify auth-token cookie exists in browser DevTools
```

### Build Issues
```
Error: "Cannot find module"
- Delete node_modules and .next
- Run: npm install && npm run build
- Check Node version: node --version (must be 18+)
```

## Performance Considerations

1. **Indexes**: Database indexes are created for fast queries on:
   - `agent_id`, `created_at` (calls)
   - `call_id`, `created_at` (evaluations)
   - `supervisor_id`, `role` (users)

2. **Pagination**: Call listings are limited to 100-200 records per request

3. **Caching**: Dashboard data is fetched client-side with SWR caching

4. **Query Optimization**: Complex queries use JOINs to minimize database round-trips

## Security Best Practices

1. **Passwords**: Never use demo passwords in production
2. **JWT Secret**: Use a strong, random string in production
3. **HTTPS**: Enable SSL/TLS in production
4. **Environment Variables**: Use secure secret management
5. **Database Access**: Restrict database to application only
6. **CORS**: Configure allowed origins

## Next Steps

1. Customize branding (update logo, colors, company name)
2. Integrate with actual call system (recording URLs, transcription)
3. Configure AI evaluation engine
4. Set up email notifications for alerts
5. Implement user management UI
6. Add custom scoring categories
7. Implement call recording playback
8. Set up monitoring and analytics

## Support & Documentation

- **Issues**: Check error logs in browser console and server output
- **Database**: PostgreSQL documentation at https://www.postgresql.org/docs/
- **Next.js**: Framework docs at https://nextjs.org/docs
- **Tailwind CSS**: Styling docs at https://tailwindcss.com/docs
- **Radix UI**: Component docs at https://radix-ui.com/docs

## Production Deployment

Before deploying to production:

1. Set all environment variables securely
2. Run `npm run build` to check for build errors
3. Enable HTTPS/SSL
4. Set `NODE_ENV=production`
5. Use strong JWT_SECRET
6. Set up database backups
7. Configure monitoring and error tracking
8. Test all user flows
9. Set up automated testing
10. Document deployment process

---

**Last Updated**: January 2026
**Version**: 1.0
**Status**: Production Ready

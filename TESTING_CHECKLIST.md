# EchoGuard - Testing Checklist

**Date**: 2024
**Version**: 1.0.0
**Environment**: Development/Testing

## Pre-Testing Setup

### 1. Database Setup
- [ ] Create PostgreSQL database: `createdb echoguard`
- [ ] Run schema: `psql -U postgres -d echoguard -f scripts/setup-database.sql`
- [ ] Verify tables created: `\dt` in psql
- [ ] Seed demo data: `psql -U postgres -d echoguard -f scripts/seed-data.sql`
- [ ] Verify data: `SELECT COUNT(*) FROM users;` (should be 11)

### 2. Environment Setup
- [ ] Copy `.env.local` with DATABASE_URL
- [ ] Set JWT_SECRET in `.env.local`
- [ ] Verify NODE_ENV=development
- [ ] Install dependencies: `npm install`
- [ ] Build project: `npm run build` (should complete without errors)

### 3. Start Server
- [ ] Run dev server: `npm run dev`
- [ ] Verify server running on http://localhost:3000
- [ ] Check no errors in console

---

## Authentication Tests

### Login Tests

#### Test 1: Admin Login
- [ ] Response code: 200
- [ ] Response includes user with role: "admin"
- [ ] auth-token cookie set

#### Test 2: Supervisor Login
- [ ] Response code: 200
- [ ] Response includes user with role: "supervisor"
- [ ] supervisorId is null

#### Test 3: Agent Login
- [ ] Response code: 200
- [ ] Response includes user with role: "agent"
- [ ] supervisorId is set to valid UUID

#### Test 4: Invalid Credentials
- [ ] Response code: 401
- [ ] Error message: "Invalid email or password"
- [ ] No auth-token cookie

#### Test 5: Get Current User (Authenticated)
- [ ] Response code: 200
- [ ] Returns current user object

#### Test 6: Get Current User (Not Authenticated)
- [ ] Response code: 401
- [ ] Error message: "Not authenticated"

#### Test 7: Logout
- [ ] Response code: 200
- [ ] auth-token cookie cleared

---

## Agent API Tests

### Test 8: Get Agent Stats
- [ ] Response code: 200
- [ ] Contains: totalCalls, averageQaScore, escalationRate
- [ ] All numbers are reasonable

### Test 9: Get Agent Calls (Paginated)
- [ ] Response code: 200
- [ ] Each call has evaluation scores
- [ ] Pagination works

### Test 10: Get Specific Call Details
- [ ] Response code: 200
- [ ] Contains: full transcript
- [ ] Contains: complete evaluation
- [ ] Contains: sopViolations, coachingInsights, alerts

### Test 11: Get Coaching Insights
- [ ] Response code: 200
- [ ] Contains: insights array
- [ ] Matches coach insight database records

### Test 12: Acknowledge Coaching Insight
- [ ] Response code: 200
- [ ] Insight marked as acknowledged in database

---

## Supervisor API Tests

### Test 13: Get Supervisor Stats
- [ ] Response code: 200
- [ ] teamSize matches supervised agents
- [ ] Aggregated stats correct

### Test 14: Get Supervised Agents
- [ ] Response code: 200
- [ ] Only returns this supervisor's agents
- [ ] Count matches team size

### Test 15: Get Team Calls
- [ ] Response code: 200
- [ ] Only shows calls from supervised agents
- [ ] Includes agent names in response

### Test 16: Get Team Evaluations
- [ ] Response code: 200
- [ ] Only includes team's evaluations
- [ ] Includes agent names

---

## Admin API Tests

### Test 17: Get Admin Stats
- [ ] Response code: 200
- [ ] totalUsers = 11, totalAgents = 8, totalCalls = 50
- [ ] Stats aggregated correctly

### Test 18: Get All Users
- [ ] Response code: 200
- [ ] Shows 11 total users
- [ ] Includes all roles (admin, supervisor, agent)

### Test 19: Get All System Calls
- [ ] Response code: 200
- [ ] Shows all 50 calls
- [ ] Includes agent and supervisor names

### Test 20: Get Analytics Data
- [ ] Response code: 200
- [ ] topAgents populated
- [ ] lowPerformers populated
- [ ] Quality trend data present

### Test 21: Get System Settings
- [ ] Response code: 200
- [ ] sopCategories populated
- [ ] Escalation levels listed
- [ ] Roles listed correctly

---

## Database Verification

### Test 22: User Hierarchy
- [ ] All agents have a supervisor
- [ ] Supervisors have NULL supervisor_id
- [ ] Admin has NULL supervisor_id

### Test 23: Call-Evaluation Relationship
- [ ] All 50 calls have one evaluation
- [ ] No duplicate evaluations

### Test 24: Coaching Insights Count
- [ ] Database has 8 coaching insights

### Test 25: Alerts Count
- [ ] Database has 6 alerts for low-quality calls

---

## Error Handling Tests

### Test 26: Invalid Call ID
- [ ] Response code: 404 or 400
- [ ] Appropriate error message

### Test 27: Unauthenticated Request
- [ ] Response code: 401

### Test 28: Wrong Role Access
- [ ] Response code: 403 (Forbidden)

---

## Data Validation Tests

### Test 29: Sentiment Score Ranges
- [ ] All scores between -1.0 and 1.0

### Test 30: QA Score Ranges
- [ ] All QA scores between 0-100

### Test 31: Duration Validation
- [ ] All call durations > 0

---

## Build & Performance

### Test 32: Build Completion
- [ ] npm run build completes successfully
- [ ] No TypeScript errors
- [ ] All routes compiled

### Test 33: Performance
- [ ] Response times < 2 seconds for all endpoints
- [ ] No database errors under normal load

---

## Sign-Off

- [ ] All tests passed
- [ ] Build completed successfully
- [ ] Database schema verified
- [ ] Demo data loaded correctly
- [ ] All APIs responding correctly
- [ ] No critical errors found

**Tested By**: ________________  
**Date**: ________________  
**Status**: ✅ PASSED / ❌ FAILED

---

## Known Limitations

- Password hashing uses SHA-256 (upgrade to bcrypt for production)
- AI evaluation is mocked (production uses real ML model)
- No rate limiting implemented
- No request logging/monitoring

---

## References

- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- [API_REFERENCE.md](API_REFERENCE.md)
- [scripts/setup-database.sql](scripts/setup-database.sql)
- [scripts/seed-data.sql](scripts/seed-data.sql)

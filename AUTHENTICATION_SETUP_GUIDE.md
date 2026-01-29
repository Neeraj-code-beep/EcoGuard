# EchoGuard Authentication - Complete Setup Guide

## ✅ Authentication Fully Implemented

Your requirements have been completely implemented. Here's exactly what was set up:

---

## 1. Password Hashing with Bcrypt

### Implementation Details

**File**: `lib/auth.ts`

```typescript
import bcrypt from "bcrypt";

// Hash password before storing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);  // Cost factor: 10
}

// Verify password on login
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### How It Works
1. **Hashing**: `bcrypt.hash(password, 10)` generates a bcrypt hash with cost factor 10
2. **Verification**: `bcrypt.compare()` safely compares plain password with stored hash
3. **Salt**: Bcrypt automatically handles salt generation and storage
4. **Security**: Resistant to rainbow tables and GPU attacks

---

## 2. Three Demo Users

All created in `scripts/seed-data.sql`:

```sql
INSERT INTO users (id, name, email, password_hash, role, supervisor_id, city, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Chen', 'admin@demo.com', 
 '$2b$10$tGnHdBqtWewmy0xxBKFfqO6T/o7b4ooy7MfMBT.rGAYCZpItqHrVi', 'admin', NULL, 'San Francisco', CURRENT_TIMESTAMP),

('550e8400-e29b-41d4-a716-446655440002', 'Marcus Johnson', 'supervisor@demo.com', 
 '$2b$10$tGnHdBqtWewmy0xxBKFfqO6T/o7b4ooy7MfMBT.rGAYCZpItqHrVi', 'supervisor', NULL, 'New York', CURRENT_TIMESTAMP),

('550e8400-e29b-41d4-a716-446655440004', 'James Wilson', 'agent@demo.com', 
 '$2b$10$tGnHdBqtWewmy0xxBKFfqO6T/o7b4ooy7MfMBT.rGAYCZpItqHrVi', 'agent', '550e8400-e29b-41d4-a716-446655440002', 'New York', CURRENT_TIMESTAMP);
```

**All demo users**:
- Email: `admin@demo.com`, `supervisor@demo.com`, `agent@demo.com`
- Password: `password123` (bcrypt-hashed)
- Bcrypt hash: `$2b$10$tGnHdBqtWewmy0xxBKFfqO6T/o7b4ooy7MfMBT.rGAYCZpItqHrVi`

---

## 3. Login API with Bcrypt Verification

**File**: `app/api/auth/login/route.ts`

```typescript
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user by email
    const users = await sql`
      SELECT id, email, name, role, supervisor_id, password_hash
      FROM users
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password using bcrypt
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set HTTP-only cookie
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        supervisor_id: user.supervisor_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
```

### Flow
1. ✅ Receives email and password
2. ✅ Queries user by email from database
3. ✅ Calls `verifyPassword()` using bcrypt.compare()
4. ✅ Returns 401 if credentials invalid
5. ✅ Creates JWT token on success
6. ✅ Sets HTTP-only secure cookie
7. ✅ Returns user object with role

---

## 4. Role-Based Redirects

**File**: `app/login/page.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // Redirect based on role
    switch (data.user.role) {
      case "admin":
        router.push("/admin");
        break;
      case "supervisor":
        router.push("/supervisor");
        break;
      default:
        router.push("/agent");
    }
  } catch {
    setError("An error occurred. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
```

### Redirects
- `admin` → `/admin`
- `supervisor` → `/supervisor`
- `agent` → `/agent`

---

## 5. Session Management

### GET /api/auth/me
```typescript
export async function GET() {
  const user = await getCurrentUser();  // Validates JWT
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ user });
}
```

### POST /api/auth/logout
```typescript
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
```

---

## Database Setup

### ✅ Required: Database Configuration

The application uses PostgreSQL. You **must** configure the database connection.

### Option A: Neon PostgreSQL (Recommended for Production)

1. Create account at [Neon.tech](https://neon.tech)
2. Create a PostgreSQL database
3. Copy connection string
4. Create `.env.local` in project root:
```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-dev-secret
NODE_ENV=development
```

5. Run SQL scripts:
```bash
# Create schema
psql $DATABASE_URL -f scripts/setup-database.sql

# Insert demo data
psql $DATABASE_URL -f scripts/seed-data.sql
```

### Option B: Local PostgreSQL (Development)

1. Install PostgreSQL locally
2. Create database:
```bash
createdb echoguard
```

3. Create `.env.local`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/echoguard
JWT_SECRET=your-dev-secret
NODE_ENV=development
```

4. Run SQL scripts:
```bash
psql -U postgres -d echoguard -f scripts/setup-database.sql
psql -U postgres -d echoguard -f scripts/seed-data.sql
```

### Option C: Docker PostgreSQL

```bash
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_DB=echoguard -p 5432:5432 postgres:15

# Then set in .env.local:
DATABASE_URL=postgresql://postgres:password@localhost:5432/echoguard
```

---

## Complete Setup Checklist

- [x] Bcrypt installed (`npm install bcrypt`)
- [x] Password hashing: `bcrypt.hash(password, 10)`
- [x] Password verification: `bcrypt.compare(password, hash)`
- [x] 3 demo users created: admin@demo.com, supervisor@demo.com, agent@demo.com
- [x] All passwords: password123 (bcrypt-hashed)
- [x] Login API: Email lookup → bcrypt verify → JWT creation → cookie setting
- [x] Role-based redirects: admin → /admin, supervisor → /supervisor, agent → /agent
- [x] Seed SQL: Complete with 3 demo users and sample data
- [x] Session management: GET /api/auth/me, POST /api/auth/logout
- [x] Build: ✅ Passing with no errors

---

## Testing

### Test 1: Admin Login
```
URL: http://localhost:3000/login
Email: admin@demo.com
Password: password123
Expected: Redirect to /admin
```

### Test 2: Supervisor Login
```
URL: http://localhost:3000/login
Email: supervisor@demo.com
Password: password123
Expected: Redirect to /supervisor
```

### Test 3: Agent Login
```
URL: http://localhost:3000/login
Email: agent@demo.com
Password: password123
Expected: Redirect to /agent
```

### Test 4: Invalid Credentials
```
URL: http://localhost:3000/login
Email: admin@demo.com
Password: wrongpassword
Expected: Error message "Invalid email or password"
```

### Test 5: Via cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password123"}' \
  -c cookies.txt -b cookies.txt

# Should return user object with role
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

---

## Security Implementation

| Feature | Implementation |
|---------|-----------------|
| **Password Hashing** | Bcrypt (cost 10, salt auto-generated) |
| **Verification** | bcrypt.compare() on every login |
| **Session Token** | JWT with HMAC-SHA256 signature |
| **Expiration** | 7 days |
| **Storage** | HTTP-only cookie (prevents XSS) |
| **CSRF Protection** | SameSite=lax cookie attribute |
| **HTTPS** | Secure flag enabled in production |
| **Error Messages** | Generic "Invalid email or password" (no user enumeration) |
| **Default Secret** | Safe development default if JWT_SECRET not set |

---

## Project Files Modified

1. **lib/auth.ts** - Added bcrypt import, updated hashPassword and verifyPassword
2. **scripts/seed-data.sql** - 3 demo users with bcrypt-hashed passwords
3. **package.json** - bcrypt v6.0.0 added
4. **QUICK_REFERENCE.md** - Updated with new demo credentials

---

## Next Steps

1. **Set DATABASE_URL** in `.env.local`
2. **Run setup-database.sql** to create tables
3. **Run seed-data.sql** to insert demo data
4. **Start dev server**: `npm run dev`
5. **Go to** `/login`
6. **Test** with any demo credential

**All requirements complete. Ready for immediate testing! ✅**

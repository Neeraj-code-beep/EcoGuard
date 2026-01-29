-- Auto-QA & Coaching Platform Database Schema
-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS coaching_insights CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS transcripts CASCADE;
DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS sops CASCADE;
DROP TABLE IF EXISTS scoring_config CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table with role-based access
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('agent', 'supervisor', 'admin')),
  supervisor_id INTEGER REFERENCES users(id),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table for authentication
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOPs (Standard Operating Procedures)
CREATE TABLE sops (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100),
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calls table
CREATE TABLE calls (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES users(id),
  customer_phone VARCHAR(50),
  call_type VARCHAR(20) DEFAULT 'inbound' CHECK (call_type IN ('inbound', 'outbound')),
  duration_seconds INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'dropped', 'transferred')),
  recording_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcripts table (full transcript content)
CREATE TABLE transcripts (
  id SERIAL PRIMARY KEY,
  call_id INTEGER NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  speaker_labels JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table (QA scoring breakdown)
CREATE TABLE evaluations (
  id SERIAL PRIMARY KEY,
  call_id INTEGER NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  category_scores JSONB,
  strengths TEXT[],
  improvements TEXT[],
  sop_violations JSONB,
  auto_generated BOOLEAN DEFAULT true,
  reviewed_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coaching Insights
CREATE TABLE coaching_insights (
  id SERIAL PRIMARY KEY,
  agent_id INTEGER NOT NULL REFERENCES users(id),
  call_id INTEGER REFERENCES calls(id) ON DELETE SET NULL,
  insight_type VARCHAR(100) NOT NULL CHECK (insight_type IN ('strength', 'improvement', 'tip', 'warning')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table for supervisors and admins
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  alert_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(50) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  related_call_id INTEGER REFERENCES calls(id),
  related_agent_id INTEGER REFERENCES users(id),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scoring configuration
CREATE TABLE scoring_config (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  weight INTEGER NOT NULL DEFAULT 25,
  criteria JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_calls_agent_id ON calls(agent_id);
CREATE INDEX idx_calls_created_at ON calls(created_at);
CREATE INDEX idx_transcripts_call_id ON transcripts(call_id);
CREATE INDEX idx_evaluations_call_id ON evaluations(call_id);
CREATE INDEX idx_evaluations_created_at ON evaluations(created_at);
CREATE INDEX idx_coaching_insights_agent_id ON coaching_insights(agent_id);
CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_users_supervisor_id ON users(supervisor_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

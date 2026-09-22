-- VaakSuraksha Database Schema
-- Run this on your PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Accuracy metrics table
CREATE TABLE IF NOT EXISTS accuracy_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table for call tracking
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id VARCHAR(255) NOT NULL,
    scenario VARCHAR(100) NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk scores table (time-series data for dashboard)
CREATE TABLE IF NOT EXISTS risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    layer1_score DECIMAL(5,4) NOT NULL,
    layer2_score DECIMAL(5,4) NOT NULL,
    layer3_score DECIMAL(5,4) NOT NULL,
    layer4_score DECIMAL(5,4),
    context_score DECIMAL(5,4) NOT NULL,
    fused_score DECIMAL(5,4) NOT NULL,
    smoothed_score DECIMAL(5,4) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('green', 'amber', 'red'))
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    scenario VARCHAR(100) NOT NULL CHECK (scenario IN ('general_call', 'high_value_transaction', 'privileged_access')),
    amber_threshold DECIMAL(3,2) NOT NULL,
    red_threshold DECIMAL(3,2) NOT NULL,
    on_amber_actions JSONB NOT NULL DEFAULT '[]',
    on_red_actions JSONB NOT NULL DEFAULT '[]',
    context_config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit ledger table (tamper-evident hash chain)
CREATE TABLE IF NOT EXISTS audit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    report_hash VARCHAR(64) NOT NULL,
    previous_hash VARCHAR(64),
    chain_hash VARCHAR(64) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voiceprints table (for enrolled genuine speakers)
CREATE TABLE IF NOT EXISTS voiceprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    embedding BYTEA NOT NULL,  -- Store as binary for efficiency
    embedding_dim INTEGER NOT NULL DEFAULT 192,
    language VARCHAR(10) NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    consent_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_scores_session_time ON risk_scores(session_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_audit_ledger_session ON audit_ledger(session_id);
CREATE INDEX IF NOT EXISTS idx_voiceprints_user ON voiceprints(user_id);

-- Insert default policies
INSERT INTO policies (id, name, scenario, amber_threshold, red_threshold, on_amber_actions, on_red_actions, context_config)
VALUES 
    ('bank-high-value', 'Bank High Value Transaction', 'high_value_transaction', 0.35, 0.65, 
     '["show_banner", "run_challenge"]', 
     '["hold_transaction", "require_callback", "require_mfa", "notify_supervisor", "log_incident"]',
     '{"txn_amount_inr_min": 500000, "new_beneficiary": true}'),
    ('general-call', 'General Call Monitoring', 'general_call', 0.50, 0.80,
     '["show_banner"]',
     '["warning", "suggest_callback"]',
     '{}'),
    ('privileged-access', 'Privileged Access Approval', 'privileged_access', 0.30, 0.60,
     '["show_banner", "run_challenge", "require_second_approver"]',
     '["block", "open_incident", "log_to_ledger"]',
     '{}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample accuracy metrics
INSERT INTO accuracy_metrics (data)
VALUES (
    '{
        "overall": {
            "eer": 0.042,
            "auc": 0.987,
            "f1": 0.943,
            "fprAt95Recall": 0.021
        },
        "perLanguage": {
            "hindi": {"eer": 0.038, "auc": 0.991, "f1": 0.952, "fprAt95Recall": 0.018},
            "english": {"eer": 0.035, "auc": 0.993, "f1": 0.958, "fprAt95Recall": 0.015},
            "marathi": {"eer": 0.045, "auc": 0.984, "f1": 0.935, "fprAt95Recall": 0.024},
            "gujarati": {"eer": 0.048, "auc": 0.982, "f1": 0.928, "fprAt95Recall": 0.027},
            "tamil": {"eer": 0.051, "auc": 0.979, "f1": 0.921, "fprAt95Recall": 0.031},
            "bengali": {"eer": 0.049, "auc": 0.981, "f1": 0.925, "fprAt95Recall": 0.029},
            "telugu": {"eer": 0.053, "auc": 0.977, "f1": 0.918, "fprAt95Recall": 0.033}
        },
        "perCodec": {
            "clean": {"eer": 0.028, "auc": 0.996, "f1": 0.968, "fprAt95Recall": 0.009},
            "g711": {"eer": 0.052, "auc": 0.978, "f1": 0.915, "fprAt95Recall": 0.035},
            "amr": {"eer": 0.061, "auc": 0.971, "f1": 0.898, "fprAt95Recall": 0.042},
            "gsm": {"eer": 0.058, "auc": 0.973, "f1": 0.902, "fprAt95Recall": 0.039},
            "opus": {"eer": 0.039, "auc": 0.989, "f1": 0.945, "fprAt95Recall": 0.019}
        },
        "unseenGenerator": {
            "eer": 0.087,
            "auc": 0.934,
            "f1": 0.856,
            "fprAt95Recall": 0.068
        },
        "lastUpdated": "2026-09-20T10:00:00Z"
    }'::jsonb
)
ON CONFLICT DO NOTHING;

-- View for latest accuracy metrics
CREATE OR REPLACE VIEW latest_accuracy AS
SELECT data FROM accuracy_metrics ORDER BY updated_at DESC LIMIT 1;

-- View for session summary with latest risk score
CREATE OR REPLACE VIEW session_summary AS
SELECT 
    s.id,
    s.policy_id,
    s.scenario,
    s.start_time,
    s.end_time,
    s.status,
    rs.smoothed_score as latest_score,
    rs.status as latest_status,
    rs.timestamp as latest_update
FROM sessions s
LEFT JOIN LATERAL (
    SELECT smoothed_score, status, timestamp 
    FROM risk_scores 
    WHERE session_id = s.id 
    ORDER BY timestamp DESC 
    LIMIT 1
) rs ON true;
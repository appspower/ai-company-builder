-- ============================================================
-- AI Company Builder — Database Schema
-- Supabase (PostgreSQL) + RLS Multi-Tenant
-- Version: 1.0.0
-- Date: 2026-04-03
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";  -- pgvector for RAG

-- ============================================================
-- 1. WORKSPACES (회사)
-- ============================================================

CREATE TABLE workspaces (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon        TEXT DEFAULT '🏢',

  -- 사업자 정보
  business_type     TEXT DEFAULT 'individual' CHECK (business_type IN ('individual', 'corporation', 'freelancer')),
  business_number   TEXT,           -- 사업자등록번호
  representative    TEXT,           -- 대표자명
  business_category TEXT,           -- 업태
  business_item     TEXT,           -- 업종
  address           TEXT,           -- 사업장 주소

  -- 담당자 정보
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,

  -- AI 설정
  default_llm_model TEXT DEFAULT 'claude-sonnet',

  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);

-- ============================================================
-- 2. WORKSPACE_MEMBERS (멤버 관리)
-- ============================================================

CREATE TABLE workspace_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at     TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_wm_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_wm_user ON workspace_members(user_id);

-- ============================================================
-- 3. DEPARTMENTS (부서)
-- ============================================================

CREATE TABLE departments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_departments_workspace ON departments(workspace_id);

-- ============================================================
-- 4. AGENTS (AI 직원)
-- ============================================================

CREATE TABLE agents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  department_id   UUID REFERENCES departments(id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT '',
  instructions    TEXT DEFAULT '',          -- 마크다운 업무 지침
  llm_model       TEXT NOT NULL DEFAULT 'claude-sonnet'
                  CHECK (llm_model IN ('claude-opus', 'claude-sonnet', 'claude-haiku', 'gemini-flash-image')),
  enabled         BOOLEAN DEFAULT TRUE,
  status          TEXT DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'warning', 'error')),
  status_message  TEXT,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agents_workspace ON agents(workspace_id);
CREATE INDEX idx_agents_department ON agents(department_id);

-- ============================================================
-- 5. AGENT_SKILLS (도구/스킬)
-- ============================================================

CREATE TABLE agent_skills (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id    UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon        TEXT DEFAULT '🔧',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_agent ON agent_skills(agent_id);

-- ============================================================
-- 6. KNOWLEDGE_DOCS (참고 자료 / RAG 문서)
-- ============================================================

CREATE TABLE knowledge_docs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id      UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  file_name     TEXT NOT NULL,
  file_type     TEXT NOT NULL,               -- pdf, xlsx, csv, md, txt, etc.
  file_size     BIGINT DEFAULT 0,            -- bytes
  file_path     TEXT,                        -- Supabase Storage path
  status        TEXT DEFAULT 'processing' CHECK (status IN ('ready', 'processing', 'error')),
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kdocs_agent ON knowledge_docs(agent_id);
CREATE INDEX idx_kdocs_workspace ON knowledge_docs(workspace_id);

-- ============================================================
-- 7. DOCUMENT_CHUNKS (RAG 벡터 임베딩)
-- ============================================================

CREATE TABLE document_chunks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_doc_id UUID NOT NULL REFERENCES knowledge_docs(id) ON DELETE CASCADE,
  agent_id        UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  embedding       vector(1536),              -- OpenAI text-embedding-3-small 차원
  chunk_index     INTEGER DEFAULT 0,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chunks_agent ON document_chunks(agent_id);
CREATE INDEX idx_chunks_workspace ON document_chunks(workspace_id);
CREATE INDEX idx_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- 8. MISSIONS (미션)
-- ============================================================

CREATE TABLE missions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  department_id     UUID REFERENCES departments(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  description       TEXT DEFAULT '',
  status            TEXT DEFAULT 'backlog'
                    CHECK (status IN ('backlog', 'in_progress', 'review', 'approval_pending', 'completed')),
  priority          TEXT DEFAULT 'medium'
                    CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  approval_mode     TEXT DEFAULT 'final_only'
                    CHECK (approval_mode IN ('auto', 'final_only', 'step_by_step')),
  progress          INTEGER,                 -- 0-100
  progress_label    TEXT,
  due_date          DATE,
  completed_at      TIMESTAMPTZ,
  rejection_feedback TEXT,
  created_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_missions_workspace ON missions(workspace_id);
CREATE INDEX idx_missions_status ON missions(workspace_id, status);
CREATE INDEX idx_missions_priority ON missions(workspace_id, priority);
CREATE INDEX idx_missions_department ON missions(department_id);

-- ============================================================
-- 9. MISSION_STEPS (미션 단계)
-- ============================================================

CREATE TABLE mission_steps (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id  UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  agent_id    UUID REFERENCES agents(id) ON DELETE SET NULL,
  step_order  INTEGER NOT NULL,
  name        TEXT NOT NULL,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('completed', 'in_progress', 'pending')),
  progress    INTEGER,                       -- 0-100
  started_at  TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_steps_mission ON mission_steps(mission_id);

-- ============================================================
-- 10. MISSION_AGENTS (미션 ↔ 에이전트 다대다)
-- ============================================================

CREATE TABLE mission_agents (
  mission_id  UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  agent_id    UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  PRIMARY KEY (mission_id, agent_id)
);

-- ============================================================
-- 11. ARTIFACTS (산출물)
-- ============================================================

CREATE TABLE artifacts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  mission_id    UUID REFERENCES missions(id) ON DELETE SET NULL,
  agent_id      UUID REFERENCES agents(id) ON DELETE SET NULL,
  file_name     TEXT NOT NULL,
  file_type     TEXT NOT NULL CHECK (file_type IN ('document', 'image', 'video', 'spreadsheet', 'data')),
  file_path     TEXT,                        -- Supabase Storage path
  version       INTEGER DEFAULT 1,
  status        TEXT DEFAULT 'completed'
                CHECK (status IN ('approval_pending', 'review', 'completed', 'published')),
  starred       BOOLEAN DEFAULT FALSE,
  content       TEXT,                        -- 마크다운 콘텐츠 (document 타입)
  metadata      JSONB DEFAULT '{}',          -- llm_model, tokens_used, dimensions, duration, word_count
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_artifacts_workspace ON artifacts(workspace_id);
CREATE INDEX idx_artifacts_mission ON artifacts(mission_id);
CREATE INDEX idx_artifacts_agent ON artifacts(agent_id);
CREATE INDEX idx_artifacts_starred ON artifacts(workspace_id, starred) WHERE starred = TRUE;

-- ============================================================
-- 12. EXECUTION_LOGS (실행 기록)
-- ============================================================

CREATE TABLE execution_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  mission_id      UUID REFERENCES missions(id) ON DELETE SET NULL,
  agent_id        UUID REFERENCES agents(id) ON DELETE SET NULL,
  step_name       TEXT NOT NULL,
  status          TEXT DEFAULT 'running'
                  CHECK (status IN ('running', 'success', 'failed', 'cancelled')),
  llm_model       TEXT,
  tokens_used     INTEGER,
  duration_ms     INTEGER,
  cost_usd        DECIMAL(10, 6),
  error_message   TEXT,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_execlogs_workspace ON execution_logs(workspace_id);
CREATE INDEX idx_execlogs_status ON execution_logs(workspace_id, status);
CREATE INDEX idx_execlogs_mission ON execution_logs(mission_id);
CREATE INDEX idx_execlogs_agent ON execution_logs(agent_id);

-- ============================================================
-- 13. ACTIVITY_EVENTS (이벤트 피드)
-- ============================================================

CREATE TABLE activity_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL,               -- mission_created, agent_status_changed, etc.
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  icon          TEXT DEFAULT '📌',
  related_id    UUID,                        -- 관련 엔티티 ID (mission, agent, artifact)
  related_type  TEXT,                        -- 'mission', 'agent', 'artifact'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_workspace ON activity_events(workspace_id);
CREATE INDEX idx_events_type ON activity_events(workspace_id, event_type);
CREATE INDEX idx_events_created ON activity_events(workspace_id, created_at DESC);

-- ============================================================
-- 14. ROW LEVEL SECURITY (멀티테넌트 격리)
-- ============================================================

-- Helper function: 현재 사용자가 접근 가능한 workspace IDs
CREATE OR REPLACE FUNCTION get_user_workspace_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
$$;

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- Workspaces: 소속 멤버만 접근
CREATE POLICY "workspace_select" ON workspaces FOR SELECT
  USING (id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "workspace_insert" ON workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "workspace_update" ON workspaces FOR UPDATE
  USING (id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "workspace_delete" ON workspaces FOR DELETE
  USING (owner_id = auth.uid());

-- Workspace Members: 같은 워크스페이스 멤버만 조회, owner/admin만 관리
CREATE POLICY "wm_select" ON workspace_members FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "wm_insert" ON workspace_members FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "wm_delete" ON workspace_members FOR DELETE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- 나머지 테이블: workspace_id 기반 격리 (동일 패턴)
-- Departments
CREATE POLICY "dept_select" ON departments FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "dept_insert" ON departments FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "dept_update" ON departments FOR UPDATE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "dept_delete" ON departments FOR DELETE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- Agents
CREATE POLICY "agent_select" ON agents FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "agent_insert" ON agents FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "agent_update" ON agents FOR UPDATE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "agent_delete" ON agents FOR DELETE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- Agent Skills
CREATE POLICY "skill_select" ON agent_skills FOR SELECT
  USING (agent_id IN (SELECT id FROM agents WHERE workspace_id IN (SELECT get_user_workspace_ids())));
CREATE POLICY "skill_all" ON agent_skills FOR ALL
  USING (agent_id IN (SELECT id FROM agents WHERE workspace_id IN (SELECT get_user_workspace_ids())));

-- Knowledge Docs
CREATE POLICY "kdoc_select" ON knowledge_docs FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "kdoc_all" ON knowledge_docs FOR ALL
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- Document Chunks
CREATE POLICY "chunk_select" ON document_chunks FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "chunk_all" ON document_chunks FOR ALL
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- Missions
CREATE POLICY "mission_select" ON missions FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "mission_insert" ON missions FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "mission_update" ON missions FOR UPDATE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "mission_delete" ON missions FOR DELETE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- Mission Steps
CREATE POLICY "step_select" ON mission_steps FOR SELECT
  USING (mission_id IN (SELECT id FROM missions WHERE workspace_id IN (SELECT get_user_workspace_ids())));
CREATE POLICY "step_all" ON mission_steps FOR ALL
  USING (mission_id IN (SELECT id FROM missions WHERE workspace_id IN (SELECT get_user_workspace_ids())));

-- Mission Agents
CREATE POLICY "ma_select" ON mission_agents FOR SELECT
  USING (mission_id IN (SELECT id FROM missions WHERE workspace_id IN (SELECT get_user_workspace_ids())));
CREATE POLICY "ma_all" ON mission_agents FOR ALL
  USING (mission_id IN (SELECT id FROM missions WHERE workspace_id IN (SELECT get_user_workspace_ids())));

-- Artifacts
CREATE POLICY "artifact_select" ON artifacts FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "artifact_insert" ON artifacts FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "artifact_update" ON artifacts FOR UPDATE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "artifact_delete" ON artifacts FOR DELETE
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

-- Execution Logs
CREATE POLICY "execlog_select" ON execution_logs FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "execlog_insert" ON execution_logs FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

-- Activity Events
CREATE POLICY "event_select" ON activity_events FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
CREATE POLICY "event_insert" ON activity_events FOR INSERT
  WITH CHECK (workspace_id IN (SELECT get_user_workspace_ids()));

-- ============================================================
-- 15. TRIGGERS (자동 업데이트)
-- ============================================================

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_agents_updated_at BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_missions_updated_at BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 워크스페이스 생성 시 owner를 멤버로 자동 추가
CREATE OR REPLACE FUNCTION auto_add_owner_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_workspace_auto_member AFTER INSERT ON workspaces
  FOR EACH ROW EXECUTE FUNCTION auto_add_owner_member();

-- ============================================================
-- 16. HELPER FUNCTIONS (RAG 검색)
-- ============================================================

-- 에이전트별 RAG 검색 함수
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  p_agent_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    dc.id,
    dc.content,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE dc.agent_id = p_agent_id
    AND 1 - (dc.embedding <=> query_embedding) > match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
$$;

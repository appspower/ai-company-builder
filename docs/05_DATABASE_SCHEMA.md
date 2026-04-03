# AI Company Builder — Database Schema

> Supabase (PostgreSQL) 기반 멀티테넌트 스키마.
> 마이그레이션 SQL: `supabase/migrations/001_initial_schema.sql`
> 최종 수정일: 2026-04-03

---

## 1. ERD (Entity Relationship Diagram)

```
auth.users (Supabase Auth)
  │
  ├──< workspaces (1:N — 사용자가 여러 회사 소유)
  │     │
  │     ├──< workspace_members (1:N — 회사에 여러 멤버)
  │     │     └── role: owner | admin | member
  │     │
  │     ├──< departments (1:N — 회사에 여러 부서)
  │     │     │
  │     │     └──< agents (1:N — 부서에 여러 에이전트)
  │     │           │
  │     │           ├──< agent_skills (1:N — 에이전트에 여러 도구)
  │     │           │
  │     │           ├──< knowledge_docs (1:N — 에이전트에 여러 참고문서)
  │     │           │     │
  │     │           │     └──< document_chunks (1:N — 문서에 여러 벡터 청크)
  │     │           │
  │     │           ├──< execution_logs (1:N — 에이전트의 실행 기록)
  │     │           │
  │     │           └──>< mission_agents (M:N — 에이전트 ↔ 미션)
  │     │
  │     ├──< missions (1:N — 회사에 여러 미션)
  │     │     │
  │     │     ├──< mission_steps (1:N — 미션에 여러 단계)
  │     │     │
  │     │     ├──< mission_agents (M:N — 미션 ↔ 에이전트)
  │     │     │
  │     │     └──< artifacts (1:N — 미션에서 여러 산출물)
  │     │
  │     ├──< artifacts (1:N — 회사에 여러 산출물)
  │     │
  │     ├──< execution_logs (1:N — 회사의 실행 기록)
  │     │
  │     └──< activity_events (1:N — 회사의 이벤트)
```

---

## 2. 테이블 상세

### 2.1 workspaces (회사)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | UUID PK | |
| name | TEXT | 회사 이름 |
| description | TEXT | 한 줄 설명 |
| icon | TEXT | 이모지 아이콘 |
| business_type | TEXT | 개인사업자/법인사업자/프리랜서 |
| business_number | TEXT | 사업자등록번호 |
| representative | TEXT | 대표자명 |
| business_category | TEXT | 업태 |
| business_item | TEXT | 업종 |
| address | TEXT | 사업장 주소 |
| contact_name | TEXT | 담당자명 |
| contact_email | TEXT | 담당자 이메일 |
| contact_phone | TEXT | 담당자 연락처 |
| default_llm_model | TEXT | 기본 AI 모델 |
| owner_id | UUID FK→auth.users | 소유자 |

### 2.2 agents (AI 직원)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | UUID PK | |
| workspace_id | UUID FK | |
| department_id | UUID FK | 소속 부서 |
| name | TEXT | 이름 |
| role | TEXT | 역할 (한 줄) |
| instructions | TEXT | 마크다운 업무 지침 |
| llm_model | TEXT | claude-opus/sonnet/haiku/gemini |
| enabled | BOOLEAN | 활성/비활성 |
| status | TEXT | active/idle/warning/error |
| status_message | TEXT | 상태 메시지 |

### 2.3 missions (미션)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | UUID PK | |
| workspace_id | UUID FK | |
| department_id | UUID FK | 담당 부서 |
| title | TEXT | 미션 제목 |
| description | TEXT | 설명 |
| status | TEXT | backlog → in_progress → review → approval_pending → completed |
| priority | TEXT | urgent/high/medium/low |
| approval_mode | TEXT | auto/final_only/step_by_step |
| progress | INTEGER | 0-100 |
| due_date | DATE | 마감일 |
| completed_at | TIMESTAMPTZ | 완료일 |
| rejection_feedback | TEXT | 반려 사유 |

### 2.4 artifacts (산출물)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | UUID PK | |
| workspace_id | UUID FK | |
| mission_id | UUID FK | 연결 미션 |
| agent_id | UUID FK | 생성 에이전트 |
| file_name | TEXT | 파일명 |
| file_type | TEXT | document/image/video/spreadsheet/data |
| file_path | TEXT | Supabase Storage 경로 |
| version | INTEGER | 버전 번호 |
| status | TEXT | approval_pending/review/completed/published |
| starred | BOOLEAN | 즐겨찾기 |
| content | TEXT | 마크다운 콘텐츠 |
| metadata | JSONB | llm_model, tokens, dimensions 등 |

### 2.5 document_chunks (RAG 벡터)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | UUID PK | |
| knowledge_doc_id | UUID FK | 원본 문서 |
| agent_id | UUID FK | 소속 에이전트 |
| workspace_id | UUID FK | |
| content | TEXT | 청크 텍스트 |
| embedding | vector(1536) | 벡터 임베딩 |
| chunk_index | INTEGER | 청크 순서 |

---

## 3. RLS (Row Level Security) 정책

**핵심 원칙:** 모든 테이블은 `workspace_id`를 기준으로 격리. 사용자는 자신이 멤버인 워크스페이스의 데이터만 접근 가능.

```sql
-- Helper 함수: 사용자가 접근 가능한 workspace IDs
CREATE FUNCTION get_user_workspace_ids() RETURNS SETOF UUID AS $$
  SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
$$;

-- 모든 테이블에 동일 패턴 적용
CREATE POLICY "select" ON [table] FOR SELECT
  USING (workspace_id IN (SELECT get_user_workspace_ids()));
```

하위 테이블(agent_skills, mission_steps 등)은 부모 테이블의 workspace_id를 통해 간접 격리.

---

## 4. 트리거

| 트리거 | 대상 | 동작 |
|---|---|---|
| updated_at 자동 갱신 | workspaces, agents, missions | UPDATE 시 updated_at = NOW() |
| 오너 자동 멤버 등록 | workspaces | INSERT 시 owner를 workspace_members에 자동 추가 |

---

## 5. RAG 검색 함수

```sql
match_documents(query_embedding, agent_id, threshold, count)
→ Returns: id, content, similarity
```

에이전트별 네임스페이스 격리: `WHERE agent_id = p_agent_id`로 다른 에이전트 문서와 분리.

---

## 6. 인덱스 전략

| 인덱스 | 용도 |
|---|---|
| `idx_*_workspace` | 멀티테넌트 격리 (모든 테이블) |
| `idx_missions_status` | 칸반 컬럼별 조회 |
| `idx_missions_priority` | 우선순위별 그룹핑 |
| `idx_artifacts_starred` | 즐겨찾기 필터 (부분 인덱스) |
| `idx_execlogs_status` | 실행 중/실패 필터 |
| `idx_events_created` | 이벤트 시간순 조회 |
| `idx_chunks_embedding` | pgvector 유사도 검색 (IVFFlat) |

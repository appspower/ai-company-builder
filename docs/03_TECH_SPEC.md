# AI Company Builder — Technical Specification

> "어떻게 만드는가"를 정의합니다. PRD의 기능을 코드로 구현하기 위한 가이드.
> 기술적 결정 변경 시 이 문서를 업데이트하고 DECISION_LOG.md에 기록합니다.
> 최종 수정일: 2026-04-03

---

## 1. 기술 스택

### 1.1 Phase 1 — Frontend (현재 단계)

| 레이어 | 기술 | 버전 | 선택 이유 |
|---|---|---|---|
| 빌드 도구 | Vite | 6.x | 빠른 HMR, 단순한 설정. SSR 불필요한 SPA에 최적 |
| UI 프레임워크 | React | 19.x | 생태계 최대, 라이브러리 호환성 |
| 언어 | TypeScript | 5.x | 타입 안전성, 데이터 모델 명세와 코드 일치 |
| 라우팅 | TanStack Router | 1.x | 타입 안전한 SPA 라우팅, 파일 기반 라우트 |
| UI 컴포넌트 | shadcn/ui + Radix UI | latest | 커스터마이징 자유도, Tailwind 네이티브, 접근성 |
| 스타일링 | Tailwind CSS | 4.x | 유틸리티 퍼스트, shadcn/ui와 통합 |
| 드래그앤드롭 | @hello-pangea/dnd | 16.x | 칸반 특화, react-beautiful-dnd 활성 후속 포크 |
| 클라이언트 상태 | Zustand | 5.x | 경량, 보일러플레이트 최소, 피처별 분리 용이 |
| 서버 상태 | TanStack Query | 5.x | 캐싱/리페칭 자동화, Phase 2 API 연동 대비 |
| 폼 | React Hook Form + Zod | 7.x / 3.x | 복잡한 에이전트 설정 폼에 최적, 타입 안전 검증 |
| 아이콘 | Lucide React | latest | shadcn/ui 기본 아이콘셋 |
| 토스트 | Sonner | latest | shadcn/ui 통합, 깔끔한 UX |

### 1.2 Phase 2 — Backend (향후)

| 레이어 | 기술 | 선택 이유 |
|---|---|---|
| API (CRUD) | Next.js API Routes | 프론트엔드와 같은 TS 생태계 |
| API (AI 오케스트레이션) | FastAPI (Python) | LLM SDK 생태계 최강 |
| 데이터베이스 | Supabase (PostgreSQL) | RLS 멀티테넌트 + Auth + Storage + Realtime 통합 |
| ORM | Prisma | TypeScript 타입 자동 생성 |
| 워크플로우 엔진 | Inngest | HITL waitForEvent, 서버리스, 인프라 불필요 |
| 벡터 DB | pgvector (Supabase 내장) | 에이전트별 RAG 네임스페이스 격리 |
| 파일 저장 | Supabase Storage | S3 호환, 산출물 버전 관리 |
| 실시간 | Supabase Realtime + SSE | 에이전트 상태 업데이트, LLM 스트리밍 |

---

## 2. 프로젝트 폴더 구조

```
ai-company-builder/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.tsx                    # 앱 루트 컴포넌트
│   │   ├── providers.tsx              # 모든 Provider 합성 (Query, Theme 등)
│   │   └── router.tsx                 # TanStack Router 인스턴스
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn/ui 복사 컴포넌트 (수정 금지)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx              # 사이드 패널
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx / sonner.tsx
│   │   │   └── ...
│   │   ├── layout/                    # 레이아웃 컴포넌트
│   │   │   ├── Sidebar.tsx            # 사이드바 (네비게이션)
│   │   │   ├── Header.tsx             # 상단 헤더
│   │   │   ├── PageShell.tsx          # 페이지 래퍼 (사이드바 + 헤더 + 콘텐츠)
│   │   │   └── WorkspaceSwitcher.tsx  # 좌상단 워크스페이스 전환 드롭다운
│   │   └── shared/                    # 앱 공통 재사용 컴포넌트
│   │       ├── EmptyState.tsx         # 빈 상태 패턴 (아이콘 + 메시지 + CTA)
│   │       ├── StatusBadge.tsx        # 에이전트/미션 상태 뱃지
│   │       ├── SidePanel.tsx          # Level 2 사이드 패널 래퍼
│   │       ├── DataTable.tsx          # 범용 테이블 (TanStack Table 기반)
│   │       └── ConfirmDialog.tsx      # 삭제 확인 모달
│   │
│   ├── features/                      # 피처 기반 모듈 (핵심 비즈니스 로직)
│   │   ├── workspace-lobby/
│   │   │   ├── components/
│   │   │   │   ├── WorkspaceCard.tsx
│   │   │   │   ├── WorkspaceGrid.tsx
│   │   │   │   └── CreateWorkspaceDialog.tsx
│   │   │   ├── hooks/
│   │   │   └── store.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── ApprovalQueue.tsx      # 결재함 위젯
│   │   │   │   ├── MissionSummary.tsx     # 미션 현황 요약 위젯
│   │   │   │   ├── AgentActivity.tsx      # 에이전트 활동 위젯
│   │   │   │   └── RecentArtifacts.tsx    # 최근 산출물 위젯
│   │   │   └── hooks/
│   │   │
│   │   ├── agents/
│   │   │   ├── components/
│   │   │   │   ├── DepartmentList.tsx
│   │   │   │   ├── AgentCard.tsx          # 컨텍스트 메뉴 (편집/복제/삭제)
│   │   │   │   ├── AgentGrid.tsx
│   │   │   │   ├── AgentInlineDetail.tsx  # 인라인 스플릿 (4탭: 정보/지침/도구/자료)
│   │   │   │   ├── AgentDetailPanel.tsx   # Sheet 모달 (편집 모드)
│   │   │   │   └── CreateAgentForm.tsx
│   │   │   └── store.ts
│   │   │
│   │   ├── missions/
│   │   │   ├── components/
│   │   │   │   ├── KanbanBoard.tsx        # Group By 5가지 지원
│   │   │   │   ├── KanbanColumn.tsx       # 반응형 (min-w-[200px] flex-1)
│   │   │   │   ├── MissionCard.tsx        # 우선순위/부서/마감일/결재방식 뱃지
│   │   │   │   ├── MissionInlineDetail.tsx # 인라인 스플릿 (읽기)
│   │   │   │   ├── MissionDetailPanel.tsx  # Sheet 모달 (결재 처리)
│   │   │   │   ├── MissionListView.tsx    # 리스트 뷰 테이블
│   │   │   │   ├── MissionTimeline.tsx
│   │   │   │   └── CreateMissionForm.tsx  # 우선순위/마감일/3단계 결재
│   │   │   └── store.ts
│   │   │
│   │   ├── artifacts/
│   │   │   ├── components/
│   │   │   │   ├── ArtifactList.tsx       # 퀵필터/Group By/정렬/즐겨찾기
│   │   │   │   └── ArtifactInlineDetail.tsx # 인라인 스플릿 (미리보기/버전)
│   │   │   └── store.ts
│   │   │
│   │   ├── activity/
│   │   │   ├── components/
│   │   │   │   ├── ExecutionLog.tsx       # 퀵필터/Group By/요약카드/duration바
│   │   │   │   ├── ExecutionDetailPanel.tsx # 인라인 상세 (통계/링크)
│   │   │   │   └── EventFeed.tsx          # 검색/클릭→관련화면 이동
│   │   │
│   │   └── settings/
│   │       └── components/
│   │           ├── CompanyInfoForm.tsx    # 사업자정보 + 담당자
│   │           ├── ApiKeySettings.tsx     # 기본 모델 선택 포함
│   │           ├── MemberSettings.tsx     # 역할 체계 (오너/관리자/멤버)
│   │           ├── UsageSettings.tsx      # 토큰/비용/모델별 사용량
│   │           └── NotificationSettings.tsx
│   │
│   ├── routes/                        # TanStack Router 파일 기반 라우트
│   │   ├── __root.tsx                 # 루트 레이아웃
│   │   ├── index.tsx                  # "/" → 워크스페이스 로비
│   │   ├── $workspaceId.tsx           # 레이아웃 + 워크스페이스 존재 검증
│   │   └── $workspaceId/
│   │       ├── index.tsx              # "/:id" → 홈 대시보드
│   │       ├── agents.tsx             # "/:id/agents"
│   │       ├── missions.tsx           # "/:id/missions"
│   │       ├── activity.tsx           # "/:id/activity"
│   │       ├── artifacts.tsx          # "/:id/artifacts"
│   │       └── settings.tsx           # "/:id/settings"
│   │
│   ├── mocks/                         # 더미 데이터 (Phase 2에서 API로 교체)
│   │   ├── workspaces.ts
│   │   ├── departments.ts
│   │   ├── agents.ts
│   │   ├── missions.ts
│   │   ├── artifacts.ts
│   │   └── activity.ts               # 실행 기록 + 이벤트
│   │
│   ├── hooks/                         # 앱 전역 훅
│   │   ├── useMediaQuery.ts
│   │   └── useDebounce.ts
│   │
│   ├── lib/                           # 유틸리티
│   │   ├── utils.ts                   # cn() 등 shadcn 유틸
│   │   ├── constants.ts              # 상태/우선순위/결재방식 라벨/색상
│   │   └── templates.ts             # 에이전트 업무지침 마크다운 템플릿
│   │
│   ├── types/                         # 전역 공유 타입 (엔티티 인터페이스)
│   │   ├── workspace.ts
│   │   ├── agent.ts                   # Agent + Department + KnowledgeDoc + AgentSkill
│   │   ├── mission.ts                 # Mission + MissionStep + Priority + ApprovalMode
│   │   ├── artifact.ts                # Artifact + starred + content
│   │   └── activity.ts               # ExecutionLog + ActivityEvent
│   │
│   ├── styles/
│   │   └── globals.css                # Tailwind directives + CSS 변수 (디자인 토큰)
│   │
│   └── main.tsx                       # 엔트리포인트
│
├── docs/                              # 프로젝트 문서
│   ├── 01_VISION.md
│   ├── 02_PRD.md
│   ├── 03_TECH_SPEC.md
│   └── 04_DECISION_LOG.md
│
├── CLAUDE.md                          # AI 개발 컨텍스트
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts                 # Tailwind v4에서는 최소화 가능
├── vite.config.ts
├── components.json                    # shadcn/ui 설정
└── .gitignore
```

### 폴더 구조 원칙

| 원칙 | 설명 |
|---|---|
| **피처 기반 구조** | `features/` 아래에 기능 단위로 모든 것(컴포넌트, 훅, 스토어, 타입)을 코로케이션 |
| **라우트는 얇게** | `routes/` 파일은 `features/`의 컴포넌트를 import하여 조합만 함. 비즈니스 로직 없음 |
| **ui/ 는 수정 금지** | shadcn/ui 복사 컴포넌트는 원본 유지. 커스텀이 필요하면 `shared/`에 래핑 |
| **mocks/ 는 교체 대상** | Phase 2에서 API 호출로 교체할 때, import 경로만 변경하면 됨 |
| **타입 공유** | 엔티티 인터페이스는 `types/`에 중앙화. features와 mocks 모두 여기서 import |

---

## 3. 데이터 모델 (TypeScript 인터페이스)

PRD 6장의 더미 데이터와 정확히 일치하는 타입 정의입니다.

```typescript
// types/workspace.ts
export interface Workspace {
  id: string
  name: string
  description: string
  icon: string                    // emoji
  agentCount: number
  activeMissionCount: number
  pendingApprovalCount: number
  lastActivityAt: string          // 상대 시간 문자열
}

// types/agent.ts
export type LlmModel = 'claude-opus' | 'claude-sonnet' | 'claude-haiku' | 'gemini-flash-image'
export type AgentStatus = 'active' | 'idle' | 'warning' | 'error'
export type KnowledgeDocStatus = 'ready' | 'processing' | 'error'

export interface KnowledgeDoc {
  id: string
  fileName: string
  fileType: string
  fileSize: string
  status: KnowledgeDocStatus
  uploadedAt: string
}

export interface AgentSkill {
  id: string
  name: string
  description: string
  icon: string
}

export interface Department {
  id: string
  workspaceId: string
  name: string
  agentCount: number
}

export interface Agent {
  id: string
  workspaceId: string
  departmentId: string
  name: string
  role: string
  instructions: string             // 마크다운 업무 지침 (성격&톤, 프로세스, 규칙, 출력형식)
  llmModel: LlmModel
  knowledgeDocs: KnowledgeDoc[]    // 참고 자료 파일 리스트
  skills: AgentSkill[]             // 할당된 도구/스킬
  enabled: boolean                 // 활성/비활성 토글
  status: AgentStatus
  statusMessage: string | null
  lastActivityAt: string
  recentMissionIds: string[]
}

// types/mission.ts
export type MissionStatus = 'backlog' | 'in_progress' | 'review' | 'approval_pending' | 'completed'
export type MissionPriority = 'urgent' | 'high' | 'medium' | 'low'
export type ApprovalMode = 'auto' | 'final_only' | 'step_by_step'
export type StepStatus = 'completed' | 'in_progress' | 'pending'

export interface MissionStep {
  order: number
  name: string
  status: StepStatus
  agentId: string
  progress: number | null
}

export interface Mission {
  id: string
  workspaceId: string
  title: string
  description: string
  departmentId: string
  assignedAgentIds: string[]
  status: MissionStatus
  priority: MissionPriority
  progress: number | null
  progressLabel: string | null
  approvalMode: ApprovalMode        // auto / final_only / step_by_step
  createdAt: string
  dueDate: string | null
  completedAt: string | null
  artifactCount: number
  rejectionFeedback: string | null  // 반려 사유 보존
  steps: MissionStep[]
}

// types/artifact.ts
export type FileType = 'document' | 'image' | 'video' | 'spreadsheet' | 'data'
export type ArtifactStatus = 'approval_pending' | 'review' | 'completed' | 'published'

export interface Artifact {
  id: string
  workspaceId: string
  missionId: string
  agentId: string
  fileName: string
  fileType: FileType
  version: number
  status: ArtifactStatus
  starred: boolean                  // 즐겨찾기
  content: string | null            // 마크다운 콘텐츠 (document 타입)
  createdAt: string
  metadata: {
    llmModel: string
    tokensUsed?: number
    dimensions?: string
    duration?: string
    wordCount?: number
  }
}

// types/activity.ts
export type ExecutionStatus = 'running' | 'success' | 'failed' | 'cancelled'
export type EventType = 'mission_created' | 'mission_started' | 'mission_completed' |
  'mission_approval_requested' | 'mission_approved' | 'mission_rejected' |
  'agent_created' | 'agent_status_changed' | 'artifact_created' | 'workspace_created'

export interface ExecutionLog {
  id: string
  workspaceId: string
  missionId: string
  missionTitle: string
  agentId: string
  agentName: string
  stepName: string
  status: ExecutionStatus
  llmModel: string
  tokensUsed: number | null
  durationMs: number | null
  costUsd: number | null
  startedAt: string
  completedAt: string | null
  errorMessage: string | null
}

export interface ActivityEvent {
  id: string
  workspaceId: string
  type: EventType
  title: string
  description: string
  timestamp: string
  relatedId: string | null
  icon: string
}
```

---

## 4. 디자인 토큰

### 4.1 색상 체계

shadcn/ui CSS 변수 기반. `globals.css`에서 정의합니다.

**라이트 모드:**
```css
:root {
  --background: 0 0% 100%;           /* #FFFFFF */
  --foreground: 222.2 84% 4.9%;      /* #030712 */
  --card: 210 40% 98%;               /* #F8FAFC — 카드 배경 */
  --primary: 238 84% 67%;            /* #6366F1 — 인디고 (브랜드 액센트) */
  --primary-foreground: 0 0% 100%;   /* 흰색 텍스트 on primary */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
```

**다크 모드:**
```css
.dark {
  --background: 222.2 84% 4.9%;      /* #030712 */
  --foreground: 210 40% 98%;         /* #F8FAFC */
  --card: 217.2 32.6% 11%;           /* #1E293B */
  --primary: 238 84% 67%;            /* #6366F1 동일 */
  --primary-foreground: 0 0% 100%;
  --border: 217.2 32.6% 17.5%;
}
```

**사이드바:**
```css
:root {
  --sidebar-bg: 222.2 47.4% 11.2%;   /* #0F172A — 항상 다크 */
  --sidebar-fg: 210 40% 98%;         /* 흰색 텍스트 */
  --sidebar-accent: 238 84% 67%;     /* 인디고 — 활성 메뉴 */
}
```

**상태 색상:**
| 상태 | 배경 | 텍스트/아이콘 | 용도 |
|---|---|---|---|
| active / success | `#F0FDF4` (green-50) | `#22C55E` (green-500) | 에이전트 활동 중, 미션 완료 |
| idle / neutral | `#F8FAFC` (slate-50) | `#6B7280` (gray-500) | 에이전트 대기, 미정 |
| warning | `#FFFBEB` (amber-50) | `#F59E0B` (amber-500) | API 한도 근접, 지연 |
| error | `#FEF2F2` (red-50) | `#EF4444` (red-500) | 에이전트 에러, 실패 |
| approval_pending | `#EEF2FF` (indigo-50) | `#6366F1` (indigo-500) | CEO 결재 대기 (강조) |

### 4.2 타이포그래피

| 역할 | 크기 | 굵기 | Tailwind 클래스 |
|---|---|---|---|
| 페이지 제목 | 24px | 600 | `text-2xl font-semibold` |
| 섹션 제목 | 18px | 600 | `text-lg font-semibold` |
| 카드 제목 | 16px | 500 | `text-base font-medium` |
| 본문 | 14px | 400 | `text-sm` (기본) |
| 테이블/리스트 | 13px | 400 | `text-[13px]` |
| 캡션/라벨 | 12px | 500 | `text-xs font-medium` |
| KPI 숫자 | 30px | 700 | `text-3xl font-bold` |

- **본문 폰트:** Inter (구글 폰트)
- **모노스페이스:** Geist Mono (숫자, 코드)

### 4.3 간격

4px 기본 단위. Tailwind 기본 스케일 사용.

| 용도 | 값 | Tailwind |
|---|---|---|
| 아이콘과 텍스트 사이 | 8px | `gap-2` |
| 카드 내부 패딩 | 16~24px | `p-4` ~ `p-6` |
| 카드 간 간격 | 16px | `gap-4` |
| 섹션 간 간격 | 24~32px | `gap-6` ~ `gap-8` |
| 페이지 외부 패딩 | 24~32px | `p-6` ~ `p-8` |
| 테이블 셀 패딩 | 8px 세로, 12px 가로 | `py-2 px-3` |

### 4.4 Border Radius

| 요소 | 값 | Tailwind |
|---|---|---|
| 버튼, 입력 필드 | 8px | `rounded-lg` (`--radius`) |
| 카드 | 12px | `rounded-xl` |
| 뱃지 | 9999px (원형) | `rounded-full` |
| 모달 / 사이드 패널 | 12px | `rounded-xl` |

---

## 5. 컴포넌트 구조 설계

### 5.1 사이드바 (layout/Sidebar.tsx)

```
┌─────────────────────┐
│  [🎬 AI 숏폼 팩토리 ▼] │  ← WorkspaceSwitcher (드롭다운)
├─────────────────────┤
│  🏠  홈              │  ← NavItem (active 상태: 인디고 배경)
│  👥  조직 & 에이전트   │
│  🚀  미션 센터  [2]   │  ← 승인 대기 건수 뱃지
│  📦  산출물 보관함     │
│  ⚙️  설정            │
├─────────────────────┤
│  🌓 테마 전환         │  ← 다크/라이트 토글
│  ← 로비로 돌아가기    │
└─────────────────────┘
```

### 5.2 칸반 보드 (missions/KanbanBoard.tsx)

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  대기 (4) │ 진행중 (3)│ 검토중 (2)│ 결재대기(2)│  완료 (2) │
│          │          │          │  ★ 강조   │  회색톤   │
│  [Card]  │  [Card]  │  [Card]  │  [Card]  │  [Card]  │
│  [Card]  │  [Card]  │  [Card]  │  [Card]  │  [Card]  │
│  [Card]  │  [Card]  │          │          │          │
│  [Card]  │          │          │          │          │
└──────────┴──────────┴──────────┴──────────┴──────────┘
← ──────── DragDropContext (가로 스크롤) ──────── →
```

### 5.3 사이드 패널 (shared/SidePanel.tsx)

```
                            ┌──────────────────────┐
                            │  제목          [X]    │
                            ├──────────────────────┤
                            │                      │
                            │   스크롤 가능한 콘텐츠  │
                            │                      │
                            │                      │
                            ├──────────────────────┤
                            │  [반려]      [승인]   │  ← 하단 액션
                            └──────────────────────┘
  ┌────────────────────────┐ ↑
  │   메인 콘텐츠 (반투명 딤)  │ 화면의 40~50%
  └────────────────────────┘
```

---

## 6. 상태 관리 설계

### 6.1 Zustand 스토어 분리

| 스토어 | 파일 | 관리 대상 |
|---|---|---|
| `useWorkspaceStore` | `features/workspace-lobby/store.ts` | 현재 선택된 workspace ID, workspace 목록 |
| `useAgentStore` | `features/agents/store.ts` | 부서/에이전트 목록, 선택된 에이전트 |
| `useMissionStore` | `features/missions/store.ts` | 미션 목록, 칸반 상태, 필터 |
| `useArtifactStore` | `features/artifacts/store.ts` | 산출물 목록, 필터, 뷰 모드 |
| `useUIStore` | `app/ui-store.ts` | 사이드 패널 열림/닫힘, 사이드바 접힘, 테마 |

### 6.2 Phase 2 전환 전략

Phase 1에서는 Zustand 스토어가 `mocks/`에서 데이터를 직접 import합니다.
Phase 2에서는 TanStack Query가 API에서 데이터를 fetch하고, Zustand는 UI 상태만 관리합니다.

```
Phase 1:  Store → import from mocks/*.ts → 컴포넌트
Phase 2:  Store (UI만) + useQuery(API) → 컴포넌트
```

변경 범위: 각 feature의 `store.ts`와 `hooks/` 내부만 수정. 컴포넌트는 변경 없음.

---

## 7. 라우팅 설계

### TanStack Router 라우트 매핑

| URL | 라우트 파일 | 화면 | 레이아웃 |
|---|---|---|---|
| `/` | `routes/index.tsx` | 워크스페이스 로비 | 로비 전용 (사이드바 없음) |
| `/:workspaceId` | `routes/$workspaceId/index.tsx` | 홈 대시보드 | PageShell (사이드바 + 헤더) |
| `/:workspaceId/agents` | `routes/$workspaceId/agents.tsx` | 조직 & 에이전트 | PageShell |
| `/:workspaceId/missions` | `routes/$workspaceId/missions.tsx` | 미션 센터 | PageShell |
| `/:workspaceId/artifacts` | `routes/$workspaceId/artifacts.tsx` | 산출물 보관함 | PageShell |
| `/:workspaceId/settings` | `routes/$workspaceId/settings.tsx` | 설정 | PageShell |

### 레이아웃 전략

- **로비** (`/`): 사이드바 없음. 전체 화면 카드 그리드.
- **회사 내부** (`/:workspaceId/*`): PageShell 레이아웃 (왼쪽 사이드바 + 상단 헤더 + 오른쪽 콘텐츠)

`$workspaceId` 폴더에 `_layout.tsx`를 두어 PageShell을 적용합니다.

---

## 8. Phase별 개발 로드맵

### Phase 1: Frontend Foundation (현재)

| 단계 | 작업 | 산출물 |
|---|---|---|
| **1-1** | 프로젝트 초기화 | Vite + React + TS + Tailwind + shadcn/ui 세팅 |
| **1-2** | 라우팅 + 레이아웃 | TanStack Router 설정, PageShell, Sidebar |
| **1-3** | 디자인 토큰 + 테마 | globals.css, 다크/라이트 모드 |
| **1-4** | 더미 데이터 | mocks/*.ts 파일 (PRD 6장 기반) |
| **1-5** | 워크스페이스 로비 | WorkspaceCard, WorkspaceGrid, CreateDialog |
| **1-6** | 홈 대시보드 | ApprovalQueue, MissionSummary, AgentActivity, RecentArtifacts |
| **1-7** | 조직 & 에이전트 | DepartmentList, AgentCard, AgentDetailPanel |
| **1-8** | 미션 센터 | KanbanBoard, MissionCard, MissionDetailPanel, 드래그앤드롭 |
| **1-9** | 산출물 보관함 | ArtifactList, ArtifactDetailPanel, 필터/검색 |
| **1-10** | 설정 | CompanyInfoForm, ApiKeySettings |
| **1-11** | 통합 QA | 전체 흐름 점검, 반응형, 접근성 |

### Phase 2: Backend Integration (향후)

| 단계 | 작업 |
|---|---|
| 2-1 | Supabase 세팅 (DB 스키마, RLS, Auth) |
| 2-2 | API 라우트 구현 (CRUD) |
| 2-3 | TanStack Query 연동 (mock → API 교체) |
| 2-4 | FastAPI 사이드카 (LLM 오케스트레이션) |
| 2-5 | Inngest 워크플로우 + HITL |
| 2-6 | Supabase Realtime + 에이전트 상태 |
| 2-7 | 파일 업로드/다운로드 (Supabase Storage) |
| 2-8 | RAG 연동 (pgvector) |

### Phase 3: Advanced Features (미래)

| 작업 |
|---|
| 에이전트 간 토론/협업 시스템 |
| 외부 SaaS 연동 (Slack, Google Drive 등) |
| 워크스페이스 템플릿 (CODA 등 외부 시스템 import) |
| 모바일 대응 |
| 멀티 유저 / 팀 협업 |

---

## 9. 개발 컨벤션

### 9.1 네이밍

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `AgentCard.tsx` |
| 훅 파일 | camelCase, use 접두사 | `useAgentStore.ts` |
| 타입 파일 | camelCase | `agent.ts` |
| CSS 클래스 | Tailwind 유틸리티 | `className="flex gap-4 p-6"` |
| 상수 | UPPER_SNAKE_CASE | `MISSION_STATUS_LABELS` |
| 더미 데이터 | camelCase, 복수형 | `mockWorkspaces` |

### 9.2 import 순서

```typescript
// 1. React / 외부 라이브러리
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

// 2. 내부 컴포넌트 (절대 경로)
import { Button } from '@/components/ui/button'
import { SidePanel } from '@/components/shared/SidePanel'

// 3. 같은 feature 내부
import { AgentCard } from './AgentCard'

// 4. 타입
import type { Agent } from '@/types/agent'
```

### 9.3 경로 별칭

```typescript
// tsconfig.json paths
{
  "@/*": ["./src/*"]
}
```

모든 import는 `@/`로 시작 (상대 경로는 같은 feature 내부에서만 허용).

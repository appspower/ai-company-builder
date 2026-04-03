# AI Company Builder — Claude Code Context

## 프로젝트 개요
사용자가 AI 직원으로 구성된 가상 회사를 만들고 운영하는 SaaS 플랫폼.
핵심: "워크플로우 빌더"가 아니라 "회사 경영" 메타포.

## 기술 스택
- **Frontend:** Vite + React 19 + TypeScript + TanStack Router
- **UI:** shadcn/ui + Radix + Tailwind CSS 4
- **칸반:** @hello-pangea/dnd
- **상태:** Zustand (클라이언트) + TanStack Query (서버)
- **폼:** React Hook Form + Zod
- **Backend (Phase 2):** Supabase + FastAPI + Inngest

## 현재 상태
- Phase: **Phase 1 프론트엔드 완료 + 문서 동기화 완료**
- 완료: 7개 화면 전체 구현 + 기능 검토/개선 + 디자인 폴리싱 + 문서 동기화
- 프로젝트 경로: `ai-company-builder/` (AI Company 하위)
- GitHub: https://github.com/appspower/ai-company-builder
- 다음: Phase 2 (백엔드) 또는 배포

## 7개 화면 요약
1. **워크스페이스 로비** — 회사 카드 그리드, 생성 모달
2. **홈 대시보드** — 결재함(인라인 승인), 미션/에이전트 현황, 최근 산출물
3. **조직 & 에이전트** — 인라인 스플릿(4탭: 정보/업무지침/도구/참고자료), 활성토글, 테스트대화, 컨텍스트메뉴
4. **미션 센터** — 칸반DnD + 퀵필터칩5 + GroupBy5 + 리스트뷰 + 3단계결재 + 우선순위/마감일 + 반려피드백
5. **활동 로그** — 실행기록(퀵필터칩4+GroupBy4+인라인상세+duration바) + 이벤트피드(검색+클릭이동)
6. **산출물 보관함** — 인라인스플릿 + 퀵필터칩4 + GroupBy4 + 즐겨찾기 + 마크다운렌더링 + 정렬
7. **설정** — 6탭: 회사정보(사업자정보), AI엔진(기본모델), 멤버관리, 사용량, 알림, 데이터관리

## 폴더 구조
```
src/
├── components/
│   ├── ui/       # shadcn/ui (수정 금지)
│   ├── layout/   # Sidebar, Header, PageShell
│   └── shared/   # 공통 재사용 컴포넌트
├── features/     # 피처 기반 모듈
│   ├── workspace-lobby/  # 로비
│   ├── dashboard/        # 홈 대시보드 위젯
│   ├── agents/           # 조직 & 에이전트
│   ├── missions/         # 미션 센터
│   ├── activity/         # 활동 로그
│   ├── artifacts/        # 산출물 보관함
│   └── settings/         # 설정
├── routes/       # TanStack Router 파일 기반 라우트 (7개)
├── mocks/        # 더미 데이터 6파일 (Phase 2에서 API로 교체)
├── hooks/        # 앱 전역 훅
├── lib/          # utils, constants, templates
├── types/        # 엔티티 인터페이스 5파일
└── styles/       # globals.css (디자인 토큰)
```

## 핵심 컨벤션
- 컴포넌트: PascalCase 파일명 (`AgentCard.tsx`)
- import 순서: 외부 → @/components → 같은 feature → 타입
- 경로 별칭: `@/*` → `./src/*`
- 라우트는 얇게 — features/에서 import하여 조합만
- ui/ 폴더는 shadcn 원본 유지
- 인라인 상세 패널: 모두 w-[400px], space-y-5, mb-2 통일
- 퀵 필터 칩 + Group By 버튼: 미션/산출물/활동 3개 화면 동일 패턴

## 용어 매핑 (코드 ↔ UI 표시)
- Workspace → 회사 | Department → 부서 | Agent → 직원/AI 직원
- Mission → 미션 | Artifact → 산출물 | ExecutionLog → 실행 기록
- ApprovalMode → 결재 방식 (auto=자동완료, final_only=최종결재, step_by_step=단계별결재)
- LlmModel → AI 엔진 | Instructions → 업무 지침 | KnowledgeDoc → 참고 자료
- MissionPriority → 우선순위 (urgent=긴급, high=높음, medium=보통, low=낮음)

## 문서 유지보수 규칙
- 기능 추가/변경 결정 시 → docs/02_PRD.md 업데이트 + docs/04_DECISION_LOG.md에 기록
- 기술적 결정 시 → docs/03_TECH_SPEC.md 업데이트 + docs/04_DECISION_LOG.md에 기록
- 코드 작성/완료 시 → 이 파일(CLAUDE.md)의 "현재 상태" 섹션 업데이트
- docs/01_VISION.md는 대표님의 명시적 지시 없이 절대 수정 금지
- docs/04_DECISION_LOG.md는 삭제/수정 없이 append only

## 디자인 토큰 요약
- 브랜드 액센트: 인디고 `#6366F1`
- 사이드바: 항상 다크 (`#0F172A`)
- 폰트: Inter (본문) + Geist Mono (숫자/코드)
- 기본 radius: 0.5rem
- 상태색: green(활동) / gray(대기) / amber(경고) / red(에러) / indigo(결재대기)
- 우선순위색: red(긴급) / orange(높음) / blue(보통) / gray(낮음)
- 결재방식색: green(자동) / amber(최종) / red(단계별)

import type { ExecutionLog, ActivityEvent } from '@/types/activity'

export const mockExecutionLogs: ExecutionLog[] = [
  // ws-3: AI 숏폼 팩토리 — 현재 진행 중
  { id: 'exec-1', workspaceId: 'ws-3', missionId: 'm-3-5', missionTitle: '"ChatGPT vs Claude 비교" 숏폼 제작', agentId: 'agent-3-3', agentName: '스크립트 라이터', stepName: '대본 작성', status: 'running', llmModel: 'claude-sonnet', tokensUsed: 2340, durationMs: null, costUsd: null, startedAt: '5분 전', completedAt: null, errorMessage: null },
  { id: 'exec-2', workspaceId: 'ws-3', missionId: 'm-3-6', missionTitle: '"혼자 사는 자취생 냉장고 정리" 썸네일', agentId: 'agent-3-5', agentName: '썸네일 디자이너', stepName: '이미지 생성', status: 'running', llmModel: 'gemini-flash-image', tokensUsed: 850, durationMs: null, costUsd: null, startedAt: '12분 전', completedAt: null, errorMessage: null },
  { id: 'exec-3', workspaceId: 'ws-3', missionId: 'm-3-7', missionTitle: '4월 1주차 퍼포먼스 리포트', agentId: 'agent-3-7', agentName: '퍼포먼스 애널리스트', stepName: '데이터 수집', status: 'running', llmModel: 'claude-sonnet', tokensUsed: 1200, durationMs: null, costUsd: null, startedAt: '20분 전', completedAt: null, errorMessage: null },

  // 최근 완료
  { id: 'exec-4', workspaceId: 'ws-3', missionId: 'm-3-10', missionTitle: '"월 100만원 부업 추천" 숏폼 최종본', agentId: 'agent-3-6', agentName: '캡션 & SEO 전문가', stepName: '캡션 작성', status: 'success', llmModel: 'claude-haiku', tokensUsed: 680, durationMs: 45200, costUsd: 0.003, startedAt: '1시간 전', completedAt: '58분 전', errorMessage: null },
  { id: 'exec-5', workspaceId: 'ws-3', missionId: 'm-3-10', missionTitle: '"월 100만원 부업 추천" 숏폼 최종본', agentId: 'agent-3-5', agentName: '썸네일 디자이너', stepName: '썸네일 제작', status: 'success', llmModel: 'gemini-flash-image', tokensUsed: 1100, durationMs: 62000, costUsd: 0.008, startedAt: '2시간 전', completedAt: '1시간 전', errorMessage: null },
  { id: 'exec-6', workspaceId: 'ws-3', missionId: 'm-3-10', missionTitle: '"월 100만원 부업 추천" 숏폼 최종본', agentId: 'agent-3-3', agentName: '스크립트 라이터', stepName: '대본 작성 v3', status: 'success', llmModel: 'claude-sonnet', tokensUsed: 4200, durationMs: 128000, costUsd: 0.025, startedAt: '3시간 전', completedAt: '2시간 전', errorMessage: null },
  { id: 'exec-7', workspaceId: 'ws-3', missionId: 'm-3-11', missionTitle: '"2026 트렌드 키워드" 시리즈 기획안', agentId: 'agent-3-2', agentName: '기획 PD', stepName: '기획안 작성', status: 'success', llmModel: 'claude-opus', tokensUsed: 8500, durationMs: 240000, costUsd: 0.12, startedAt: '5시간 전', completedAt: '4시간 전', errorMessage: null },
  { id: 'exec-8', workspaceId: 'ws-3', missionId: 'm-3-11', missionTitle: '"2026 트렌드 키워드" 시리즈 기획안', agentId: 'agent-3-1', agentName: '트렌드 스카우터', stepName: '트렌드 리서치', status: 'success', llmModel: 'claude-sonnet', tokensUsed: 3100, durationMs: 95000, costUsd: 0.018, startedAt: '6시간 전', completedAt: '5시간 전', errorMessage: null },
  { id: 'exec-9', workspaceId: 'ws-3', missionId: 'm-3-8', missionTitle: '"아이폰 숨은 기능 7가지" 대본 검수', agentId: 'agent-3-3', agentName: '스크립트 라이터', stepName: '대본 작성', status: 'success', llmModel: 'claude-sonnet', tokensUsed: 3800, durationMs: 110000, costUsd: 0.022, startedAt: '1일 전', completedAt: '1일 전', errorMessage: null },

  // 실패
  { id: 'exec-10', workspaceId: 'ws-2', missionId: 'm-2-1', missionTitle: '쿠팡 키워드 리서치', agentId: 'agent-2-5', agentName: '리뷰 매니저', stepName: '리뷰 크롤링', status: 'failed', llmModel: 'claude-haiku', tokensUsed: 120, durationMs: 8500, costUsd: 0.001, startedAt: '3시간 전', completedAt: '3시간 전', errorMessage: '크롤링 차단: 접근이 거부되었습니다 (403)' },

  // ws-1 구매대행
  { id: 'exec-11', workspaceId: 'ws-1', missionId: 'm-1-1', missionTitle: '4월 소싱 리서치', agentId: 'agent-1-1', agentName: '트렌드 헌터', stepName: 'Amazon 베스트셀러 스캔', status: 'success', llmModel: 'claude-sonnet', tokensUsed: 2800, durationMs: 85000, costUsd: 0.016, startedAt: '2시간 전', completedAt: '1시간 전', errorMessage: null },
  { id: 'exec-12', workspaceId: 'ws-1', missionId: 'm-1-1', missionTitle: '4월 소싱 리서치', agentId: 'agent-1-5', agentName: '컴플라이언스 체커', stepName: 'HS코드 검증', status: 'success', llmModel: 'claude-haiku', tokensUsed: 450, durationMs: 12000, costUsd: 0.002, startedAt: '1시간 전', completedAt: '1시간 전', errorMessage: null },

  // ws-4 시니어
  { id: 'exec-13', workspaceId: 'ws-4', missionId: 'm-4-2', missionTitle: '봄나들이 코스 추천', agentId: 'agent-4-2', agentName: '쉬운말 에디터', stepName: '스크립트 작성', status: 'success', llmModel: 'claude-sonnet', tokensUsed: 2100, durationMs: 72000, costUsd: 0.012, startedAt: '1시간 전', completedAt: '30분 전', errorMessage: null },
]

export const mockActivityEvents: ActivityEvent[] = [
  // 최근 이벤트들 (시간순 역순)
  { id: 'evt-1', workspaceId: 'ws-3', type: 'mission_approval_requested', title: '"월 100만원 부업 추천" 결재 요청', description: '캡션 & SEO 전문가가 모든 작업을 완료하고 CEO 결재를 요청했습니다.', timestamp: '1시간 전', relatedId: 'm-3-10', icon: '🔔' },
  { id: 'evt-2', workspaceId: 'ws-3', type: 'artifact_created', title: '산출물 생성: 월100만원_부업_캡션_3플랫폼.md', description: '캡션 & SEO 전문가가 3개 플랫폼용 캡션을 생성했습니다.', timestamp: '1시간 전', relatedId: 'art-3', icon: '📄' },
  { id: 'evt-3', workspaceId: 'ws-3', type: 'artifact_created', title: '산출물 생성: 월100만원_부업_썸네일.png (v2)', description: '썸네일 디자이너가 수정된 썸네일을 생성했습니다.', timestamp: '1시간 전', relatedId: 'art-2', icon: '🖼️' },
  { id: 'evt-4', workspaceId: 'ws-3', type: 'mission_approval_requested', title: '"2026 트렌드 키워드" 기획안 결재 요청', description: '기획 PD가 5편 시리즈 기획안의 CEO 결재를 요청했습니다.', timestamp: '2시간 전', relatedId: 'm-3-11', icon: '🔔' },
  { id: 'evt-5', workspaceId: 'ws-3', type: 'mission_started', title: '"ChatGPT vs Claude 비교" 숏폼 제작 시작', description: '스크립트 라이터가 대본 작성을 시작했습니다.', timestamp: '3시간 전', relatedId: 'm-3-5', icon: '▶️' },
  { id: 'evt-6', workspaceId: 'ws-3', type: 'artifact_created', title: '산출물 생성: 월100만원_부업_스크립트_v3.md', description: '스크립트 라이터가 3차 수정 대본을 완성했습니다.', timestamp: '3시간 전', relatedId: 'art-1', icon: '📄' },
  { id: 'evt-7', workspaceId: 'ws-3', type: 'mission_completed', title: '"감성 브이로그 BGM 추천" 숏폼 완료', description: 'CEO 승인 후 YouTube Shorts에 게시되었습니다. 현재 조회수 12.3K', timestamp: '4일 전', relatedId: 'm-3-12', icon: '✅' },
  { id: 'evt-8', workspaceId: 'ws-3', type: 'artifact_created', title: '산출물 생성: 3월4주차_퍼포먼스.xlsx', description: '퍼포먼스 애널리스트가 주간 리포트를 완성했습니다. CTR 9.2%, 구독자 +340', timestamp: '지난주', relatedId: 'art-6', icon: '📊' },
  { id: 'evt-9', workspaceId: 'ws-3', type: 'mission_created', title: '"봄맞이 다이어트 식단 TOP5" 미션 생성', description: 'CEO가 새 미션을 생성했습니다.', timestamp: '2시간 전', relatedId: 'm-3-1', icon: '🚀' },

  // ws-1
  { id: 'evt-10', workspaceId: 'ws-1', type: 'artifact_created', title: '산출물 생성: amazon_bestseller_0401.csv', description: '트렌드 헌터가 4월 베스트셀러 데이터를 수집했습니다.', timestamp: '2시간 전', relatedId: 'art-8', icon: '📋' },
  { id: 'evt-11', workspaceId: 'ws-1', type: 'agent_status_changed', title: '컴플라이언스 체커 경고', description: 'API 호출 한도의 85%에 도달했습니다. 한도 초과 시 작업이 중단됩니다.', timestamp: '1시간 전', relatedId: 'agent-1-5', icon: '⚠️' },

  // ws-2
  { id: 'evt-12', workspaceId: 'ws-2', type: 'agent_status_changed', title: '리뷰 매니저 에러 발생', description: '쿠팡 리뷰 크롤링 중 접근이 차단되었습니다 (403). IP 변경이 필요합니다.', timestamp: '3시간 전', relatedId: 'agent-2-5', icon: '🔴' },
  { id: 'evt-13', workspaceId: 'ws-2', type: 'artifact_created', title: '산출물 생성: 쿠팡_키워드_분석_0401.xlsx', description: '키워드 분석가가 4월 키워드 분석을 완료했습니다.', timestamp: '5시간 전', relatedId: 'art-9', icon: '📊' },

  // ws-4
  { id: 'evt-14', workspaceId: 'ws-4', type: 'artifact_created', title: '산출물 생성: 시니어_봄나들이_스크립트.md (v2)', description: '쉬운말 에디터가 수정된 스크립트를 완성했습니다.', timestamp: '1시간 전', relatedId: 'art-10', icon: '📄' },
  { id: 'evt-15', workspaceId: 'ws-4', type: 'agent_status_changed', title: '건강정보 검증자 검증 대기', description: '"1일 1식 간헐적 단식" 콘텐츠의 의학 정보 팩트체크가 지연되고 있습니다.', timestamp: '2시간 전', relatedId: 'agent-4-3', icon: '⚠️' },
]

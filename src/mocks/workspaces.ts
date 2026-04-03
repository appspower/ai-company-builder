import type { Workspace } from '@/types/workspace'

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: '미국/독일 구매대행',
    description: '해외 소싱 → 통관 → 국내 판매 자동화',
    icon: '🌍',
    agentCount: 6,
    activeMissionCount: 5,
    pendingApprovalCount: 1,
    lastActivityAt: '2시간 전',
  },
  {
    id: 'ws-2',
    name: '쿠팡 로켓그로스',
    description: '쿠팡 입점 상품 최적화 및 광고 관리',
    icon: '🚀',
    agentCount: 5,
    activeMissionCount: 4,
    pendingApprovalCount: 0,
    lastActivityAt: '5시간 전',
  },
  {
    id: 'ws-3',
    name: 'AI 숏폼 팩토리',
    description: 'AI 기반 숏폼 콘텐츠 대량 생산',
    icon: '🎬',
    agentCount: 7,
    activeMissionCount: 6,
    pendingApprovalCount: 2,
    lastActivityAt: '30분 전',
  },
  {
    id: 'ws-4',
    name: '시니어 타겟 SNS',
    description: '50+ 세대 맞춤 SNS 콘텐츠 운영',
    icon: '💜',
    agentCount: 5,
    activeMissionCount: 4,
    pendingApprovalCount: 1,
    lastActivityAt: '1시간 전',
  },
]

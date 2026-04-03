import type { Department } from '@/types/agent'

export const mockDepartments: Department[] = [
  // ws-1: 미국/독일 구매대행
  { id: 'dept-1-1', workspaceId: 'ws-1', name: '소싱팀', agentCount: 2 },
  { id: 'dept-1-2', workspaceId: 'ws-1', name: '상품팀', agentCount: 2 },
  { id: 'dept-1-3', workspaceId: 'ws-1', name: '통관팀', agentCount: 1 },
  { id: 'dept-1-4', workspaceId: 'ws-1', name: 'CS팀', agentCount: 1 },
  // ws-2: 쿠팡 로켓그로스
  { id: 'dept-2-1', workspaceId: 'ws-2', name: 'MD팀', agentCount: 2 },
  { id: 'dept-2-2', workspaceId: 'ws-2', name: '광고팀', agentCount: 1 },
  { id: 'dept-2-3', workspaceId: 'ws-2', name: '재고팀', agentCount: 1 },
  { id: 'dept-2-4', workspaceId: 'ws-2', name: 'CS팀', agentCount: 1 },
  // ws-3: AI 숏폼 팩토리
  { id: 'dept-3-1', workspaceId: 'ws-3', name: '기획팀', agentCount: 2 },
  { id: 'dept-3-2', workspaceId: 'ws-3', name: '제작팀', agentCount: 3 },
  { id: 'dept-3-3', workspaceId: 'ws-3', name: '배포팀', agentCount: 1 },
  { id: 'dept-3-4', workspaceId: 'ws-3', name: '분석팀', agentCount: 1 },
  // ws-4: 시니어 타겟 SNS
  { id: 'dept-4-1', workspaceId: 'ws-4', name: '기획팀', agentCount: 1 },
  { id: 'dept-4-2', workspaceId: 'ws-4', name: '콘텐츠팀', agentCount: 2 },
  { id: 'dept-4-3', workspaceId: 'ws-4', name: '디자인팀', agentCount: 1 },
  { id: 'dept-4-4', workspaceId: 'ws-4', name: '운영팀', agentCount: 1 },
]

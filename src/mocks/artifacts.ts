import type { Artifact } from '@/types/artifact'

export const mockArtifacts: Artifact[] = [
  { id: 'art-1', workspaceId: 'ws-3', missionId: 'm-3-10', agentId: 'agent-3-3', fileName: '월100만원_부업_스크립트_v3.md', fileType: 'document', version: 3, status: 'approval_pending', createdAt: '1일 전', metadata: { llmModel: 'claude-sonnet', wordCount: 420 } },
  { id: 'art-2', workspaceId: 'ws-3', missionId: 'm-3-10', agentId: 'agent-3-5', fileName: '월100만원_부업_썸네일.png', fileType: 'image', version: 2, status: 'approval_pending', createdAt: '1일 전', metadata: { llmModel: 'gemini-flash-image', dimensions: '1080x1920' } },
  { id: 'art-3', workspaceId: 'ws-3', missionId: 'm-3-10', agentId: 'agent-3-6', fileName: '월100만원_부업_캡션_3플랫폼.md', fileType: 'document', version: 1, status: 'approval_pending', createdAt: '1일 전', metadata: { llmModel: 'claude-haiku', wordCount: 180 } },
  { id: 'art-4', workspaceId: 'ws-3', missionId: 'm-3-8', agentId: 'agent-3-3', fileName: '아이폰_숨은기능_스크립트_v2.md', fileType: 'document', version: 2, status: 'review', createdAt: '2일 전', metadata: { llmModel: 'claude-sonnet', wordCount: 350 } },
  { id: 'art-5', workspaceId: 'ws-3', missionId: 'm-3-12', agentId: 'agent-3-3', fileName: '감성브이로그_BGM_최종.mp4', fileType: 'video', version: 1, status: 'published', createdAt: '4일 전', metadata: { llmModel: 'claude-sonnet', duration: '00:47' } },
  { id: 'art-6', workspaceId: 'ws-3', missionId: 'm-3-13', agentId: 'agent-3-7', fileName: '3월4주차_퍼포먼스.xlsx', fileType: 'spreadsheet', version: 1, status: 'completed', createdAt: '지난주', metadata: { llmModel: 'claude-sonnet' } },
  { id: 'art-7', workspaceId: 'ws-3', missionId: 'm-3-11', agentId: 'agent-3-2', fileName: '2026트렌드_기획안.md', fileType: 'document', version: 1, status: 'approval_pending', createdAt: '2일 전', metadata: { llmModel: 'claude-opus', wordCount: 1200 } },
  { id: 'art-8', workspaceId: 'ws-1', missionId: 'm-1-1', agentId: 'agent-1-1', fileName: 'amazon_bestseller_0401.csv', fileType: 'data', version: 1, status: 'completed', createdAt: '2시간 전', metadata: { llmModel: 'claude-sonnet' } },
  { id: 'art-9', workspaceId: 'ws-2', missionId: 'm-2-1', agentId: 'agent-2-1', fileName: '쿠팡_키워드_분석_0401.xlsx', fileType: 'spreadsheet', version: 1, status: 'completed', createdAt: '5시간 전', metadata: { llmModel: 'claude-sonnet' } },
  { id: 'art-10', workspaceId: 'ws-4', missionId: 'm-4-2', agentId: 'agent-4-2', fileName: '시니어_봄나들이_스크립트.md', fileType: 'document', version: 2, status: 'review', createdAt: '1시간 전', metadata: { llmModel: 'claude-sonnet', wordCount: 280 } },
]

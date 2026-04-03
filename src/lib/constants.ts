import type { MissionStatus } from '@/types/mission'
import type { AgentStatus } from '@/types/agent'
import type { FileType } from '@/types/artifact'

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  backlog: '대기',
  in_progress: '진행 중',
  review: '검토 중',
  approval_pending: '결재 대기',
  completed: '완료',
}

export const MISSION_STATUS_COLORS: Record<MissionStatus, string> = {
  backlog: 'text-muted-foreground',
  in_progress: 'text-blue-500',
  review: 'text-amber-500',
  approval_pending: 'text-primary',
  completed: 'text-green-500',
}

export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  active: '활동 중',
  idle: '대기',
  warning: '경고',
  error: '에러',
}

export const AGENT_STATUS_COLORS: Record<AgentStatus, { dot: string; bg: string }> = {
  active: { dot: 'bg-green-500', bg: 'bg-[var(--status-active-bg)]' },
  idle: { dot: 'bg-gray-400', bg: 'bg-[var(--status-idle-bg)]' },
  warning: { dot: 'bg-amber-500', bg: 'bg-[var(--status-warning-bg)]' },
  error: { dot: 'bg-red-500', bg: 'bg-[var(--status-error-bg)]' },
}

export const FILE_TYPE_ICONS: Record<FileType, string> = {
  document: '📄',
  image: '🖼️',
  video: '🎬',
  spreadsheet: '📊',
  data: '📋',
}

export const LLM_MODEL_LABELS: Record<string, string> = {
  'claude-opus': 'Opus',
  'claude-sonnet': 'Sonnet',
  'claude-haiku': 'Haiku',
  'gemini-flash-image': 'Gemini',
}

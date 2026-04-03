import type { MissionStatus, MissionPriority, ApprovalMode } from '@/types/mission'
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

export const MISSION_PRIORITY_LABELS: Record<MissionPriority, string> = {
  urgent: '긴급',
  high: '높음',
  medium: '보통',
  low: '낮음',
}

export const MISSION_PRIORITY_COLORS: Record<MissionPriority, { dot: string; text: string; bg: string }> = {
  urgent: { dot: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-500/10' },
  high: { dot: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10' },
  medium: { dot: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' },
  low: { dot: 'bg-gray-400', text: 'text-gray-400', bg: 'bg-gray-400/10' },
}

export const APPROVAL_MODE_LABELS: Record<ApprovalMode, string> = {
  auto: '자동 완료',
  final_only: '최종 결재',
  step_by_step: '단계별 결재',
}

export const APPROVAL_MODE_COLORS: Record<ApprovalMode, { dot: string; text: string; bg: string }> = {
  auto: { dot: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-500/10' },
  final_only: { dot: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-500/10' },
  step_by_step: { dot: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-500/10' },
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

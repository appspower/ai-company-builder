export type ExecutionStatus = 'running' | 'success' | 'failed' | 'cancelled'

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

export type EventType =
  | 'mission_created'
  | 'mission_started'
  | 'mission_completed'
  | 'mission_approval_requested'
  | 'mission_approved'
  | 'mission_rejected'
  | 'agent_created'
  | 'agent_status_changed'
  | 'artifact_created'
  | 'workspace_created'

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

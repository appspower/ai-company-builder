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
  approvalMode: ApprovalMode
  createdAt: string
  dueDate: string | null
  completedAt: string | null
  artifactCount: number
  rejectionFeedback: string | null
  steps: MissionStep[]
}

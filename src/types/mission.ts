export type MissionStatus = 'backlog' | 'in_progress' | 'review' | 'approval_pending' | 'completed'
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
  progress: number | null
  progressLabel: string | null
  requiresApproval: boolean
  createdAt: string
  artifactCount: number
  steps: MissionStep[]
}

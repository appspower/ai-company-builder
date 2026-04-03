export interface Workspace {
  id: string
  name: string
  description: string
  icon: string
  agentCount: number
  activeMissionCount: number
  pendingApprovalCount: number
  lastActivityAt: string
}

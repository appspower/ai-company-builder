import { Link } from '@tanstack/react-router'
import type { Workspace } from '@/types/workspace'

interface WorkspaceCardProps {
  workspace: Workspace
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return (
    <Link
      to="/$workspaceId"
      params={{ workspaceId: workspace.id }}
      className="block rounded-xl border bg-card p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="text-3xl mb-3">{workspace.icon}</div>
        <span className="text-xs text-muted-foreground">{workspace.lastActivityAt}</span>
      </div>
      <h2 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
        {workspace.name}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">{workspace.description}</p>
      <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
        <span>직원 {workspace.agentCount}명</span>
        <span>미션 {workspace.activeMissionCount}건</span>
        {workspace.pendingApprovalCount > 0 ? (
          <span className="text-primary font-medium">
            승인대기 {workspace.pendingApprovalCount}건
          </span>
        ) : (
          <span>승인대기 0건</span>
        )}
      </div>
    </Link>
  )
}

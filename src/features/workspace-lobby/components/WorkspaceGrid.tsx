import type { Workspace } from '@/types/workspace'
import { WorkspaceCard } from './WorkspaceCard'
import { CreateWorkspaceCard } from './CreateWorkspaceCard'

interface WorkspaceGridProps {
  workspaces: Workspace[]
  onCreateClick: () => void
}

export function WorkspaceGrid({ workspaces, onCreateClick }: WorkspaceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspaces.map((ws) => (
        <WorkspaceCard key={ws.id} workspace={ws} />
      ))}
      <CreateWorkspaceCard onClick={onCreateClick} />
    </div>
  )
}

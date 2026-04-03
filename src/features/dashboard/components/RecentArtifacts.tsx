import { useNavigate, useParams } from '@tanstack/react-router'
import type { Artifact } from '@/types/artifact'
import type { Agent } from '@/types/agent'
import { FILE_TYPE_ICONS } from '@/lib/constants'

interface RecentArtifactsProps {
  artifacts: Artifact[]
  agents: Agent[]
}

export function RecentArtifacts({ artifacts, agents }: RecentArtifactsProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }
  const recent = artifacts.slice(0, 5)

  const getAgentName = (agentId: string) => {
    return agents.find((a) => a.id === agentId)?.name ?? '알 수 없음'
  }

  if (recent.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">최근 산출물</h2>
        <p className="text-sm text-muted-foreground py-4 text-center">
          아직 산출물이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">최근 산출물</h2>
      <div className="space-y-1">
        {recent.map((artifact) => (
          <button
            key={artifact.id}
            onClick={() => navigate({ to: `/${workspaceId}/artifacts` })}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors w-full text-left"
          >
            <span className="text-lg shrink-0">
              {FILE_TYPE_ICONS[artifact.fileType]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{artifact.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {getAgentName(artifact.agentId)}
                {artifact.version > 1 && <span className="ml-1">· v{artifact.version}</span>}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{artifact.createdAt}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

import { useNavigate, useParams } from '@tanstack/react-router'
import type { Agent } from '@/types/agent'
import type { AgentStatus } from '@/types/agent'
import { AGENT_STATUS_LABELS, AGENT_STATUS_COLORS } from '@/lib/constants'

interface AgentActivityProps {
  agents: Agent[]
}

const STATUS_ORDER: AgentStatus[] = ['active', 'idle', 'warning', 'error']

export function AgentActivity({ agents }: AgentActivityProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }

  const counts = STATUS_ORDER.map((status) => ({
    status,
    label: AGENT_STATUS_LABELS[status],
    count: agents.filter((a) => a.status === status).length,
  }))

  const recentAgents = [...agents]
    .filter((a) => a.status === 'active')
    .slice(0, 4)

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">에이전트 현황</h2>
      <div className="grid grid-cols-4 gap-2 text-center mb-4">
        {counts.map((item) => {
          const colors = AGENT_STATUS_COLORS[item.status]
          return (
            <button
              key={item.status}
              onClick={() => navigate({ to: `/${workspaceId}/agents` })}
              className="hover:bg-muted/50 rounded-lg py-2 transition-colors cursor-pointer"
            >
              <div className="text-3xl font-bold">{item.count}</div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            </button>
          )
        })}
      </div>
      {recentAgents.length > 0 && (
        <div className="border-t pt-3">
          <p className="text-xs text-muted-foreground mb-2">최근 활동</p>
          <div className="space-y-1.5">
            {recentAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => navigate({ to: `/${workspaceId}/agents` })}
                className="flex items-center justify-between text-sm w-full hover:bg-muted/50 rounded-lg px-2 py-1 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${AGENT_STATUS_COLORS[agent.status].dot}`} />
                  <span className="font-medium truncate">{agent.name}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{agent.lastActivityAt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import type { Mission } from '@/types/mission'
import type { Agent } from '@/types/agent'

interface ApprovalQueueProps {
  missions: Mission[]
  agents: Agent[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ApprovalQueue({ missions, agents, onApprove, onReject }: ApprovalQueueProps) {
  const pendingMissions = missions.filter((m) => m.status === 'approval_pending')

  const getAgentName = (agentIds: string[]) => {
    const agent = agents.find((a) => agentIds.includes(a.id))
    return agent?.name ?? '담당자 없음'
  }

  if (pendingMissions.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">결재함</h2>
        <p className="text-sm text-muted-foreground py-4 text-center">
          승인 대기 건이 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        결재함
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
          {pendingMissions.length}건
        </span>
      </h2>
      <div className="space-y-3">
        {pendingMissions.map((mission) => (
          <div
            key={mission.id}
            className="flex items-center justify-between p-3 rounded-lg bg-[var(--status-approval-bg)] border border-[var(--status-approval)]/20"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{mission.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getAgentName(mission.assignedAgentIds)} · {mission.createdAt}
                {mission.artifactCount > 0 && (
                  <span className="ml-2">· 산출물 {mission.artifactCount}건</span>
                )}
              </p>
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button
                onClick={() => onReject(mission.id)}
                className="px-3 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
              >
                반려
              </button>
              <button
                onClick={() => onApprove(mission.id)}
                className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                승인
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

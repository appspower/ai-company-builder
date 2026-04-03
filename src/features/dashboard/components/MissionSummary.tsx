import { useNavigate, useParams } from '@tanstack/react-router'
import type { Mission } from '@/types/mission'
import type { MissionStatus } from '@/types/mission'
import { MISSION_STATUS_LABELS, MISSION_STATUS_COLORS } from '@/lib/constants'

interface MissionSummaryProps {
  missions: Mission[]
}

const STATUS_ORDER: MissionStatus[] = ['backlog', 'in_progress', 'review', 'approval_pending', 'completed']

export function MissionSummary({ missions }: MissionSummaryProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }

  const counts = STATUS_ORDER.map((status) => ({
    status,
    label: MISSION_STATUS_LABELS[status],
    color: MISSION_STATUS_COLORS[status],
    count: missions.filter((m) => m.status === status).length,
  }))

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">미션 현황</h2>
      <div className="grid grid-cols-5 gap-2 text-center">
        {counts.map((item) => (
          <button
            key={item.status}
            onClick={() => navigate({ to: `/${workspaceId}/missions` })}
            className="hover:bg-muted/50 rounded-lg py-2 transition-colors cursor-pointer"
          >
            <div className={`text-3xl font-bold ${item.color}`}>{item.count}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

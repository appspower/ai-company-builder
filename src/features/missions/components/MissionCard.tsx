import type { Mission } from '@/types/mission'
import { Package, Clock, AlertTriangle } from 'lucide-react'
import { MISSION_PRIORITY_COLORS, MISSION_PRIORITY_LABELS, APPROVAL_MODE_LABELS, APPROVAL_MODE_COLORS } from '@/lib/constants'
import { mockDepartments } from '@/mocks/departments'

interface MissionCardProps {
  mission: Mission
  onClick: () => void
}

export function MissionCard({ mission, onClick }: MissionCardProps) {
  const dept = mockDepartments.find((d) => d.id === mission.departmentId)
  const priorityColors = MISSION_PRIORITY_COLORS[mission.priority]
  const isOverdue = mission.dueDate?.includes('4월 3') && mission.status !== 'completed'

  return (
    <div
      onClick={onClick}
      className="rounded-lg border bg-card p-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* 상단: 우선순위 + 부서 */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${priorityColors.dot}`} />
          <span className={`text-[10px] font-medium ${priorityColors.text}`}>
            {MISSION_PRIORITY_LABELS[mission.priority]}
          </span>
        </div>
        {dept && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {dept.name}
          </span>
        )}
      </div>

      {/* 제목 */}
      <p className="text-sm font-medium line-clamp-2 mb-2">{mission.title}</p>

      {/* 진행률 바 */}
      {mission.progress !== null && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{mission.progressLabel}</span>
            <span>{mission.progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${mission.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 하단 메타 */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{mission.createdAt}</span>
          {mission.dueDate && (
            <span className={`flex items-center gap-0.5 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
              {isOverdue && <AlertTriangle className="w-3 h-3" />}
              <Clock className="w-3 h-3" />
              {mission.dueDate}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {mission.artifactCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Package className="w-3 h-3" />
              {mission.artifactCount}
            </span>
          )}
          {mission.approvalMode !== 'auto' && (
            <span className={`text-[10px] px-1 py-0.5 rounded ${APPROVAL_MODE_COLORS[mission.approvalMode].bg} ${APPROVAL_MODE_COLORS[mission.approvalMode].text}`}>
              {APPROVAL_MODE_LABELS[mission.approvalMode]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

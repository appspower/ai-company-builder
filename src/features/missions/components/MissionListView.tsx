import type { Mission } from '@/types/mission'
import { MISSION_STATUS_LABELS, MISSION_STATUS_COLORS, MISSION_PRIORITY_LABELS, MISSION_PRIORITY_COLORS } from '@/lib/constants'
import { Package, Clock, AlertTriangle } from 'lucide-react'
import { mockDepartments } from '@/mocks/departments'

interface MissionListViewProps {
  missions: Mission[]
  onMissionClick: (id: string) => void
}

export function MissionListView({ missions, onMissionClick }: MissionListViewProps) {
  if (missions.length === 0) {
    return (
      <div className="text-center py-16 text-sm text-muted-foreground">
        조건에 맞는 미션이 없습니다.
      </div>
    )
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground w-8"></th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">미션</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">부서</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">상태</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">진행률</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">마감일</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">산출물</th>
          </tr>
        </thead>
        <tbody>
          {missions.map((mission) => {
            const dept = mockDepartments.find((d) => d.id === mission.departmentId)
            const priorityColors = MISSION_PRIORITY_COLORS[mission.priority]
            const isOverdue = mission.dueDate?.includes('4월 3') && mission.status !== 'completed'

            return (
              <tr
                key={mission.id}
                onClick={() => onMissionClick(mission.id)}
                className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                {/* 우선순위 도트 */}
                <td className="px-4 py-3">
                  <span className={`w-2.5 h-2.5 rounded-full inline-block ${priorityColors.dot}`}
                    title={MISSION_PRIORITY_LABELS[mission.priority]}
                  />
                </td>

                {/* 미션 제목 */}
                <td className="px-4 py-3">
                  <p className="font-medium truncate max-w-[300px]">{mission.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{mission.createdAt}</p>
                </td>

                {/* 부서 */}
                <td className="px-4 py-3 text-muted-foreground">
                  {dept?.name ?? '-'}
                </td>

                {/* 상태 */}
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${MISSION_STATUS_COLORS[mission.status]}`}>
                    {MISSION_STATUS_LABELS[mission.status]}
                  </span>
                </td>

                {/* 진행률 */}
                <td className="px-4 py-3">
                  {mission.progress !== null ? (
                    <div className="flex items-center gap-2 w-24">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden flex-1">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${mission.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{mission.progress}%</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>

                {/* 마감일 */}
                <td className="px-4 py-3">
                  {mission.dueDate ? (
                    <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                      {isOverdue && <AlertTriangle className="w-3 h-3" />}
                      <Clock className="w-3 h-3" />
                      {mission.dueDate}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>

                {/* 산출물 */}
                <td className="px-4 py-3">
                  {mission.artifactCount > 0 ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="w-3 h-3" />
                      {mission.artifactCount}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

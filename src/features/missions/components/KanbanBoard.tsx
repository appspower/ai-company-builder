import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Mission, MissionStatus, MissionPriority, ApprovalMode } from '@/types/mission'
import { KanbanColumn } from './KanbanColumn'
import { MISSION_STATUS_LABELS, MISSION_PRIORITY_LABELS, APPROVAL_MODE_LABELS } from '@/lib/constants'
import { mockAgents } from '@/mocks/agents'
import { mockDepartments } from '@/mocks/departments'

export type GroupByMode = 'status' | 'priority' | 'agent' | 'approval' | 'department'

interface KanbanBoardProps {
  missions: Mission[]
  groupBy: GroupByMode
  onMissionClick: (id: string) => void
  onMissionMove: (missionId: string, newStatus: MissionStatus) => void
}

const STATUS_ORDER: MissionStatus[] = ['backlog', 'in_progress', 'review', 'approval_pending', 'completed']
const PRIORITY_ORDER: MissionPriority[] = ['urgent', 'high', 'medium', 'low']
const APPROVAL_ORDER: ApprovalMode[] = ['step_by_step', 'final_only', 'auto']

const COLUMN_STYLES_MAP: Record<string, string> = {
  backlog: 'border-t-muted-foreground/30',
  in_progress: 'border-t-blue-500',
  review: 'border-t-amber-500',
  approval_pending: 'border-t-primary',
  completed: 'border-t-green-500',
  urgent: 'border-t-red-500',
  high: 'border-t-orange-500',
  medium: 'border-t-blue-500',
  low: 'border-t-gray-400',
  step_by_step: 'border-t-red-500',
  final_only: 'border-t-amber-500',
  auto: 'border-t-green-500',
}

function getColumns(groupBy: GroupByMode, missions: Mission[]): { key: string; label: string; missions: Mission[] }[] {
  if (groupBy === 'status') {
    return STATUS_ORDER.map((s) => ({
      key: s,
      label: MISSION_STATUS_LABELS[s],
      missions: missions.filter((m) => m.status === s),
    }))
  }
  if (groupBy === 'priority') {
    return PRIORITY_ORDER.map((p) => ({
      key: p,
      label: MISSION_PRIORITY_LABELS[p],
      missions: missions.filter((m) => m.priority === p),
    }))
  }
  if (groupBy === 'approval') {
    return APPROVAL_ORDER.map((a) => ({
      key: a,
      label: APPROVAL_MODE_LABELS[a],
      missions: missions.filter((m) => m.approvalMode === a),
    }))
  }
  if (groupBy === 'department') {
    const deptIds = [...new Set(missions.map((m) => m.departmentId))]
    return deptIds.map((deptId) => {
      const dept = mockDepartments.find((d) => d.id === deptId)
      return {
        key: deptId,
        label: dept?.name ?? '미지정',
        missions: missions.filter((m) => m.departmentId === deptId),
      }
    })
  }
  if (groupBy === 'agent') {
    const agentIds = [...new Set(missions.flatMap((m) => m.assignedAgentIds))]
    const cols = agentIds.map((agentId) => {
      const agent = mockAgents.find((a) => a.id === agentId)
      return {
        key: agentId,
        label: agent?.name ?? '미지정',
        missions: missions.filter((m) => m.assignedAgentIds.includes(agentId)),
      }
    })
    const unassigned = missions.filter((m) => m.assignedAgentIds.length === 0)
    if (unassigned.length > 0) {
      cols.push({ key: 'unassigned', label: '미지정', missions: unassigned })
    }
    return cols
  }
  return []
}

export function KanbanBoard({ missions, groupBy, onMissionClick, onMissionMove }: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    if (groupBy !== 'status') return // 상태별 그룹만 드래그 이동 허용
    const newStatus = result.destination.droppableId as MissionStatus
    if (result.source.droppableId === newStatus) return
    onMissionMove(result.draggableId, newStatus)
  }

  const columns = getColumns(groupBy, missions)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4 h-full">
        {columns.map((col) => (
          <KanbanColumn
            key={col.key}
            status={col.key as MissionStatus}
            label={col.label}
            missions={col.missions}
            onMissionClick={onMissionClick}
            colorClass={COLUMN_STYLES_MAP[col.key] ?? 'border-t-muted-foreground/30'}
            isDragDisabled={groupBy !== 'status'}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

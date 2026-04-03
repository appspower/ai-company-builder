import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Mission, MissionStatus } from '@/types/mission'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  missions: Mission[]
  onMissionClick: (id: string) => void
  onMissionMove: (missionId: string, newStatus: MissionStatus) => void
}

const COLUMN_ORDER: MissionStatus[] = ['backlog', 'in_progress', 'review', 'approval_pending', 'completed']

export function KanbanBoard({ missions, onMissionClick, onMissionMove }: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const newStatus = result.destination.droppableId as MissionStatus
    if (result.source.droppableId === newStatus) return
    onMissionMove(result.draggableId, newStatus)
  }

  const groupedMissions: Record<MissionStatus, Mission[]> = {
    backlog: [],
    in_progress: [],
    review: [],
    approval_pending: [],
    completed: [],
  }

  missions.forEach((m) => {
    groupedMissions[m.status].push(m)
  })

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            missions={groupedMissions[status]}
            onMissionClick={onMissionClick}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

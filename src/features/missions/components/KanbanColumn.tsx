import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { Mission, MissionStatus } from '@/types/mission'
import { MissionCard } from './MissionCard'
import { MISSION_STATUS_LABELS } from '@/lib/constants'

interface KanbanColumnProps {
  status: MissionStatus
  missions: Mission[]
  onMissionClick: (id: string) => void
}

const COLUMN_STYLES: Record<MissionStatus, string> = {
  backlog: 'border-t-muted-foreground/30',
  in_progress: 'border-t-blue-500',
  review: 'border-t-amber-500',
  approval_pending: 'border-t-primary',
  completed: 'border-t-green-500',
}

export function KanbanColumn({ status, missions, onMissionClick }: KanbanColumnProps) {
  return (
    <div className={`flex flex-col w-72 shrink-0 rounded-xl bg-muted/30 border-t-2 ${COLUMN_STYLES[status]}`}>
      {/* 컬럼 헤더 */}
      <div className="px-3 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{MISSION_STATUS_LABELS[status]}</h3>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
          {missions.length}
        </span>
      </div>

      {/* 드롭 영역 */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-2 pb-2 space-y-2 min-h-[100px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-primary/5' : ''
            }`}
          >
            {missions.map((mission, index) => (
              <Draggable key={mission.id} draggableId={mission.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'opacity-90 rotate-1' : ''}
                  >
                    <MissionCard
                      mission={mission}
                      onClick={() => onMissionClick(mission.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {missions.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-xs text-muted-foreground text-center py-8 border border-dashed rounded-lg">
                카드 없음
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

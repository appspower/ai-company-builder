import { Droppable, Draggable } from '@hello-pangea/dnd'
import type { Mission, MissionStatus } from '@/types/mission'
import { MissionCard } from './MissionCard'

interface KanbanColumnProps {
  status: MissionStatus | string
  label: string
  missions: Mission[]
  onMissionClick: (id: string) => void
  colorClass?: string
  isDragDisabled?: boolean
}

export function KanbanColumn({ status, label, missions, onMissionClick, colorClass, isDragDisabled }: KanbanColumnProps) {
  const borderClass = colorClass ?? 'border-t-muted-foreground/30'

  return (
    <div className={`flex flex-col min-w-[200px] flex-1 rounded-xl bg-muted/30 border-t-2 ${borderClass}`}>
      <div className="px-3 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
          {missions.length}
        </span>
      </div>

      <Droppable droppableId={status} isDropDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-2 pb-2 space-y-2 min-h-[100px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-primary/5' : ''
            }`}
          >
            {missions.map((mission, index) => (
              <Draggable key={mission.id} draggableId={mission.id} index={index} isDragDisabled={isDragDisabled}>
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

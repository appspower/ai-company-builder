import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ActivityEvent, EventType } from '@/types/activity'

interface EventFeedProps {
  events: ActivityEvent[]
}

const EVENT_TYPE_LABELS: Partial<Record<EventType, string>> = {
  mission_created: '미션 생성',
  mission_started: '미션 시작',
  mission_completed: '미션 완료',
  mission_approval_requested: '결재 요청',
  mission_approved: '미션 승인',
  mission_rejected: '미션 반려',
  agent_created: '직원 추가',
  agent_status_changed: '상태 변경',
  artifact_created: '산출물 생성',
  workspace_created: '회사 생성',
}

const EVENT_TYPE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: '전체 이벤트' },
  { value: 'mission', label: '미션 관련' },
  { value: 'agent', label: '직원 관련' },
  { value: 'artifact', label: '산출물 관련' },
]

function getTypeColor(type: EventType): string {
  if (type.includes('completed') || type.includes('approved')) return 'border-l-green-500'
  if (type.includes('approval_requested')) return 'border-l-primary'
  if (type.includes('rejected') || type.includes('status_changed')) return 'border-l-amber-500'
  if (type.includes('failed')) return 'border-l-red-500'
  if (type.includes('created') || type.includes('started')) return 'border-l-blue-500'
  return 'border-l-muted-foreground'
}

export function EventFeed({ events }: EventFeedProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all')

  let filtered = events
  if (filterCategory !== 'all') {
    filtered = filtered.filter((e) => e.type.startsWith(filterCategory))
  }

  return (
    <div>
      {/* 필터 */}
      <div className="mb-4">
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v ?? 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPE_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 타임라인 */}
      <div className="space-y-0">
        {filtered.map((event, index) => {
          const isFirst = index === 0
          const prevEvent = index > 0 ? filtered[index - 1] : null
          const showDateSeparator = !prevEvent || prevEvent.timestamp !== event.timestamp

          return (
            <div key={event.id}>
              {/* 날짜 구분선 (같은 시간이 아닐 때) */}
              {showDateSeparator && index > 0 && (
                <div className="flex items-center gap-3 py-3">
                  <div className="flex-1 border-t" />
                </div>
              )}

              <div
                className={`flex gap-4 p-4 rounded-lg border-l-[3px] mb-2 bg-card hover:shadow-sm transition-shadow ${getTypeColor(event.type)} ${
                  isFirst ? 'ring-1 ring-primary/10' : ''
                }`}
              >
                {/* 아이콘 */}
                <div className="text-xl shrink-0 mt-0.5">{event.icon}</div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
                      <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                        {EVENT_TYPE_LABELS[event.type]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              {events.length === 0 ? '아직 활동 기록이 없습니다.' : '선택한 유형의 이벤트가 없습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

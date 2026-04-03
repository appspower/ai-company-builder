import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ActivityEvent, EventType } from '@/types/activity'

interface EventFeedProps {
  events: ActivityEvent[]
}

const EVENT_TYPE_LABELS: Partial<Record<EventType, string>> = {
  mission_created: '미션 생성', mission_started: '미션 시작', mission_completed: '미션 완료',
  mission_approval_requested: '결재 요청', mission_approved: '미션 승인', mission_rejected: '미션 반려',
  agent_created: '직원 추가', agent_status_changed: '상태 변경',
  artifact_created: '산출물 생성', workspace_created: '회사 생성',
}

const FILTER_OPTIONS = [
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
  return 'border-l-blue-500'
}

function getNavigationTarget(type: EventType): string | null {
  if (type.startsWith('mission')) return 'missions'
  if (type.startsWith('agent')) return 'agents'
  if (type.startsWith('artifact')) return 'artifacts'
  return null
}

export function EventFeed({ events }: EventFeedProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  let filtered = events
  if (filterCategory !== 'all') filtered = filtered.filter((e) => e.type.startsWith(filterCategory))
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
  }

  const handleEventClick = (event: ActivityEvent) => {
    const target = getNavigationTarget(event.type)
    if (target && workspaceId) {
      navigate({ to: `/${workspaceId}/${target}` })
    }
  }

  return (
    <div>
      {/* 필터 바 */}
      <div className="flex items-center gap-3 mb-4">
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v ?? 'all')}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{FILTER_OPTIONS.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent>
        </Select>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="이벤트 검색" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
        </div>
      </div>

      {/* 타임라인 */}
      <div className="space-y-2">
        {filtered.map((event, index) => {
          const target = getNavigationTarget(event.type)
          return (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className={`flex gap-4 p-4 rounded-lg border-l-[3px] bg-card transition-all ${getTypeColor(event.type)} ${
                index === 0 ? 'ring-1 ring-primary/10' : ''
              } ${target ? 'cursor-pointer hover:shadow-sm hover:bg-muted/30' : ''}`}
            >
              <div className="text-xl shrink-0 mt-0.5">{event.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
                    {target && (
                      <p className="text-[10px] text-primary mt-1.5">{target === 'missions' ? '미션 센터에서 보기 →' : target === 'agents' ? '조직 & 에이전트에서 보기 →' : '산출물 보관함에서 보기 →'}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{EVENT_TYPE_LABELS[event.type]}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16"><p className="text-muted-foreground text-sm">{events.length === 0 ? '아직 활동 기록이 없습니다.' : '검색 조건에 맞는 이벤트가 없습니다.'}</p></div>
        )}
      </div>
    </div>
  )
}

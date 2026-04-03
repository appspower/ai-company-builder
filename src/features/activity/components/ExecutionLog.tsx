import { useState } from 'react'
import { Search, Loader2, CheckCircle2, XCircle, Ban, Clock, Zap, DollarSign, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { ExecutionLog as ExecutionLogType, ExecutionStatus } from '@/types/activity'
import { LLM_MODEL_LABELS } from '@/lib/constants'

export type ExecGroupBy = 'none' | 'agent' | 'mission' | 'status'

const STATUS_CONFIG: Record<ExecutionStatus, { icon: typeof Loader2; label: string; color: string; bg: string }> = {
  running: { icon: Loader2, label: '실행 중', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { icon: CheckCircle2, label: '성공', color: 'text-green-500', bg: 'bg-green-500/10' },
  failed: { icon: XCircle, label: '실패', color: 'text-red-500', bg: 'bg-red-500/10' },
  cancelled: { icon: Ban, label: '취소', color: 'text-gray-500', bg: 'bg-gray-500/10' },
}

interface QuickFilterDef {
  id: string; label: string; icon: typeof Loader2; activeColor: string
  filter: (l: ExecutionLogType) => boolean
}

const QUICK_FILTERS: QuickFilterDef[] = [
  { id: 'running', label: '실행 중', icon: Loader2, activeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/30', filter: (l) => l.status === 'running' },
  { id: 'failed', label: '실패', icon: XCircle, activeColor: 'bg-red-500/10 text-red-600 border-red-500/30', filter: (l) => l.status === 'failed' },
  { id: 'today', label: '오늘', icon: Clock, activeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30', filter: (l) => l.startedAt.includes('분') || l.startedAt.includes('시간') },
  { id: 'costly', label: '고비용', icon: DollarSign, activeColor: 'bg-green-500/10 text-green-700 border-green-500/30', filter: (l) => (l.costUsd ?? 0) >= 0.02 },
]

const GROUP_BY_OPTIONS: { mode: ExecGroupBy; label: string }[] = [
  { mode: 'none', label: '전체' },
  { mode: 'agent', label: '직원별' },
  { mode: 'mission', label: '미션별' },
  { mode: 'status', label: '상태별' },
]

function formatDuration(ms: number | null): string {
  if (!ms) return '-'
  if (ms < 60000) return `${(ms / 1000).toFixed(0)}초`
  return `${(ms / 60000).toFixed(1)}분`
}

function formatCost(cost: number | null): string {
  if (!cost) return '-'
  return `$${cost < 0.01 ? cost.toFixed(4) : cost.toFixed(3)}`
}

function groupLogs(logs: ExecutionLogType[], groupBy: ExecGroupBy): { label: string; items: ExecutionLogType[] }[] {
  if (groupBy === 'none') return [{ label: '', items: logs }]
  const map = new Map<string, ExecutionLogType[]>()
  for (const log of logs) {
    const key = groupBy === 'agent' ? log.agentName : groupBy === 'mission' ? log.missionTitle : STATUS_CONFIG[log.status].label
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(log)
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
}

const MAX_DURATION = 300000 // 5분 기준

interface ExecutionLogProps {
  logs: ExecutionLogType[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function ExecutionLog({ logs, selectedId, onSelect }: ExecutionLogProps) {
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [groupBy, setGroupBy] = useState<ExecGroupBy>('none')

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }

  let filtered = logs
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((l) => l.missionTitle.toLowerCase().includes(q) || l.agentName.toLowerCase().includes(q) || l.stepName.toLowerCase().includes(q))
  }
  if (activeFilters.size > 0) {
    const activeQFs = QUICK_FILTERS.filter((f) => activeFilters.has(f.id))
    for (const qf of activeQFs) filtered = filtered.filter(qf.filter)
  }

  const runningCount = logs.filter((l) => l.status === 'running').length
  const totalTokens = logs.reduce((sum, l) => sum + (l.tokensUsed ?? 0), 0)
  const totalCost = logs.reduce((sum, l) => sum + (l.costUsd ?? 0), 0)

  const sections = groupLogs(filtered, groupBy)

  return (
    <div>
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><Loader2 className="w-3.5 h-3.5 text-blue-500" /><span className="text-xs font-medium">실행 중</span></div>
          <p className="text-2xl font-bold">{runningCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs font-medium">전체 실행</span></div>
          <p className="text-2xl font-bold">{logs.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><Zap className="w-3.5 h-3.5 text-amber-500" /><span className="text-xs font-medium">총 토큰</span></div>
          <p className="text-2xl font-bold">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><DollarSign className="w-3.5 h-3.5 text-green-600" /><span className="text-xs font-medium">총 비용</span></div>
          <p className="text-2xl font-bold">${totalCost.toFixed(3)}</p>
        </div>
      </div>

      {/* 퀵 필터 칩 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {QUICK_FILTERS.map((qf) => {
          const isActive = activeFilters.has(qf.id)
          const Icon = qf.icon
          return (
            <button key={qf.id} onClick={() => toggleFilter(qf.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isActive ? qf.activeColor : 'border-border text-muted-foreground hover:bg-muted'}`}>
              <Icon className={`w-3 h-3 ${qf.id === 'running' && isActive ? 'animate-spin' : ''}`} />{qf.label}
            </button>
          )
        })}
        <div className="w-px h-5 bg-border mx-1" />
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="검색" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 w-40 text-xs" />
        </div>
      </div>

      {/* Group By */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 mb-4 w-fit">
        {GROUP_BY_OPTIONS.map((opt) => (
          <button key={opt.mode} onClick={() => setGroupBy(opt.mode)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${groupBy === opt.mode ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* 실행 기록 리스트 */}
      {sections.map((section) => (
        <div key={section.label || 'all'} className="mb-5">
          {groupBy !== 'none' && (
            <div className="flex items-center gap-2 mb-2 pb-1 border-b">
              <h3 className="text-sm font-semibold">{section.label}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{section.items.length}</span>
            </div>
          )}
          <div className="space-y-2">
            {section.items.map((log) => {
              const config = STATUS_CONFIG[log.status]
              const StatusIcon = config.icon
              const isSelected = selectedId === log.id

              return (
                <div
                  key={log.id}
                  onClick={() => onSelect(isSelected ? null : log.id)}
                  className={`rounded-lg border p-3.5 transition-all cursor-pointer ${
                    log.status === 'running' ? 'border-blue-500/30 bg-blue-500/[0.02]' : ''
                  } ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:shadow-sm'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${config.color} ${log.status === 'running' ? 'animate-spin' : ''}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{log.stepName}</span>
                          <span className="text-xs text-muted-foreground truncate">{log.missionTitle}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{log.agentName}</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">{LLM_MODEL_LABELS[log.llmModel] ?? log.llmModel}</Badge>
                          {log.tokensUsed && <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Zap className="w-3 h-3" />{log.tokensUsed.toLocaleString()}</span>}
                          {log.costUsd && <span className="text-xs text-muted-foreground">{formatCost(log.costUsd)}</span>}
                        </div>
                        {/* duration 바 */}
                        {log.durationMs && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px]">
                              <div
                                className={`h-full rounded-full ${log.status === 'success' ? 'bg-green-500/60' : log.status === 'failed' ? 'bg-red-500/60' : 'bg-blue-500/60'}`}
                                style={{ width: `${Math.min(100, (log.durationMs / MAX_DURATION) * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">{formatDuration(log.durationMs)}</span>
                          </div>
                        )}
                        {log.errorMessage && (
                          <div className="mt-1.5 flex items-start gap-1 text-xs text-red-500 bg-red-500/5 rounded px-2 py-1">
                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />{log.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="secondary" className={`text-[10px] ${config.color}`}>{config.label}</Badge>
                      <p className="text-[11px] text-muted-foreground mt-1">{log.startedAt}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16"><p className="text-muted-foreground text-sm">{logs.length === 0 ? '아직 실행 기록이 없습니다.' : '검색 조건에 맞는 기록이 없습니다.'}</p></div>
      )}
    </div>
  )
}

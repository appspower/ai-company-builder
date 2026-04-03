import { useState } from 'react'
import { Search, Loader2, CheckCircle2, XCircle, Ban, Clock, Zap, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { ExecutionLog as ExecutionLogType, ExecutionStatus } from '@/types/activity'
import { LLM_MODEL_LABELS } from '@/lib/constants'

interface ExecutionLogProps {
  logs: ExecutionLogType[]
}

const STATUS_CONFIG: Record<ExecutionStatus, { icon: typeof Loader2; label: string; color: string; bg: string }> = {
  running: { icon: Loader2, label: '실행 중', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { icon: CheckCircle2, label: '성공', color: 'text-green-500', bg: 'bg-green-500/10' },
  failed: { icon: XCircle, label: '실패', color: 'text-red-500', bg: 'bg-red-500/10' },
  cancelled: { icon: Ban, label: '취소', color: 'text-gray-500', bg: 'bg-gray-500/10' },
}

function formatDuration(ms: number | null): string {
  if (!ms) return '-'
  if (ms < 60000) return `${(ms / 1000).toFixed(0)}초`
  return `${(ms / 60000).toFixed(1)}분`
}

function formatCost(cost: number | null): string {
  if (!cost) return '-'
  if (cost < 0.01) return `$${cost.toFixed(4)}`
  return `$${cost.toFixed(3)}`
}

export function ExecutionLog({ logs }: ExecutionLogProps) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<ExecutionStatus | 'all'>('all')

  let filtered = logs
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((l) =>
      l.missionTitle.toLowerCase().includes(q) ||
      l.agentName.toLowerCase().includes(q) ||
      l.stepName.toLowerCase().includes(q)
    )
  }
  if (filterStatus !== 'all') {
    filtered = filtered.filter((l) => l.status === filterStatus)
  }

  const runningCount = logs.filter((l) => l.status === 'running').length
  const totalTokens = logs.reduce((sum, l) => sum + (l.tokensUsed ?? 0), 0)
  const totalCost = logs.reduce((sum, l) => sum + (l.costUsd ?? 0), 0)

  return (
    <div>
      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Loader2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium">실행 중</span>
          </div>
          <p className="text-2xl font-bold">{runningCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs font-medium">전체 실행</span>
          </div>
          <p className="text-2xl font-bold">{logs.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium">총 토큰</span>
          </div>
          <p className="text-2xl font-bold">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-medium">총 비용</span>
          </div>
          <p className="text-2xl font-bold">${totalCost.toFixed(3)}</p>
        </div>
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="미션, 직원, 작업 이름으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus((v ?? 'all') as ExecutionStatus | 'all')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="running">실행 중</SelectItem>
            <SelectItem value="success">성공</SelectItem>
            <SelectItem value="failed">실패</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 실행 기록 리스트 */}
      <div className="space-y-2">
        {filtered.map((log) => {
          const config = STATUS_CONFIG[log.status]
          const StatusIcon = config.icon

          return (
            <div
              key={log.id}
              className={`rounded-lg border p-4 transition-colors hover:shadow-sm ${
                log.status === 'running' ? 'border-blue-500/30 bg-blue-500/[0.02]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <StatusIcon className={`w-4 h-4 ${config.color} ${log.status === 'running' ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{log.stepName}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground truncate">{log.missionTitle}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground">{log.agentName}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                        {LLM_MODEL_LABELS[log.llmModel] ?? log.llmModel}
                      </Badge>
                      {log.tokensUsed && (
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <Zap className="w-3 h-3" />
                          {log.tokensUsed.toLocaleString()}
                        </span>
                      )}
                      {log.durationMs && (
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDuration(log.durationMs)}
                        </span>
                      )}
                      {log.costUsd && (
                        <span className="text-xs text-muted-foreground">
                          {formatCost(log.costUsd)}
                        </span>
                      )}
                    </div>
                    {log.errorMessage && (
                      <p className="text-xs text-red-500 mt-1.5 bg-red-500/5 rounded px-2 py-1">
                        {log.errorMessage}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="secondary" className={`text-[10px] ${config.color}`}>
                    {config.label}
                  </Badge>
                  <p className="text-[11px] text-muted-foreground mt-1">{log.startedAt}</p>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              {logs.length === 0 ? '아직 실행 기록이 없습니다.' : '검색 조건에 맞는 기록이 없습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

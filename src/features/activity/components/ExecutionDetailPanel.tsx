import { useNavigate, useParams } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { X, ExternalLink, Clock, Zap, DollarSign, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import type { ExecutionLog } from '@/types/activity'
import { LLM_MODEL_LABELS } from '@/lib/constants'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Loader2 }> = {
  running: { label: '실행 중', color: 'text-blue-500', icon: Loader2 },
  success: { label: '성공', color: 'text-green-500', icon: CheckCircle2 },
  failed: { label: '실패', color: 'text-red-500', icon: XCircle },
  cancelled: { label: '취소', color: 'text-gray-500', icon: XCircle },
}

function formatDuration(ms: number | null): string {
  if (!ms) return '-'
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}초`
  return `${(ms / 60000).toFixed(1)}분`
}

interface ExecutionDetailPanelProps {
  execution: ExecutionLog
  onClose: () => void
}

export function ExecutionDetailPanel({ execution, onClose }: ExecutionDetailPanelProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }
  const config = STATUS_CONFIG[execution.status]
  const StatusIcon = config.icon

  return (
    <div className="w-[400px] shrink-0 border-l bg-card overflow-y-auto h-full">
      <div className="px-5 pt-5 pb-3 sticky top-0 bg-card z-10 border-b">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-base font-semibold leading-snug">{execution.stepName}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 shrink-0">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${config.color} ${execution.status === 'running' ? 'animate-spin' : ''}`} />
          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
          <Badge variant="outline" className="text-[10px] font-mono">{LLM_MODEL_LABELS[execution.llmModel] ?? execution.llmModel}</Badge>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* 에러 메시지 */}
        {execution.errorMessage && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
            <p className="text-xs font-medium text-red-500 mb-1">에러 상세</p>
            <p className="text-sm">{execution.errorMessage}</p>
          </div>
        )}

        {/* 실행 통계 */}
        <section>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">실행 통계</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3 text-center">
              <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold">{execution.tokensUsed?.toLocaleString() ?? '-'}</p>
              <p className="text-[10px] text-muted-foreground">토큰</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold">{formatDuration(execution.durationMs)}</p>
              <p className="text-[10px] text-muted-foreground">소요 시간</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <p className="text-lg font-bold">{execution.costUsd ? `$${execution.costUsd.toFixed(4)}` : '-'}</p>
              <p className="text-[10px] text-muted-foreground">비용</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-lg font-bold text-sm mt-2">{execution.startedAt}</p>
              <p className="text-[10px] text-muted-foreground">시작 시간</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* 소요 시간 바 */}
        {execution.durationMs && (
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">소요 시간</h4>
            <div className="relative h-6 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${execution.status === 'success' ? 'bg-green-500/60' : execution.status === 'running' ? 'bg-blue-500/60 animate-pulse' : 'bg-red-500/60'}`}
                style={{ width: `${Math.min(100, (execution.durationMs / 300000) * 100)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {formatDuration(execution.durationMs)}
              </span>
            </div>
          </section>
        )}

        <Separator />

        {/* 관련 엔티티 */}
        <section>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">관련 정보</h4>
          <div className="space-y-2">
            <button
              onClick={() => navigate({ to: `/${workspaceId}/missions` })}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-full text-left text-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">미션</p>
                <p className="truncate font-medium">{execution.missionTitle}</p>
              </div>
            </button>
            <button
              onClick={() => navigate({ to: `/${workspaceId}/agents` })}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-full text-left text-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">담당 직원</p>
                <p className="truncate font-medium">{execution.agentName}</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

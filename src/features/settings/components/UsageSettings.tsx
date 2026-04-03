import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Zap, DollarSign, Activity, FileText } from 'lucide-react'

const USAGE_DATA = {
  currentMonth: '2026년 4월',
  totalTokens: 31240,
  totalCost: 0.227,
  totalExecutions: 13,
  totalArtifacts: 10,
  modelBreakdown: [
    { model: 'Claude Opus', tokens: 8500, cost: 0.12, executions: 1, pct: 53 },
    { model: 'Claude Sonnet', tokens: 17740, cost: 0.095, executions: 8, pct: 42 },
    { model: 'Claude Haiku', tokens: 3050, cost: 0.004, executions: 2, pct: 2 },
    { model: 'Gemini Flash Image', tokens: 1950, cost: 0.008, executions: 2, pct: 3 },
  ],
  dailyUsage: [
    { date: '4월 1일', tokens: 12400, cost: 0.089 },
    { date: '4월 2일', tokens: 10340, cost: 0.076 },
    { date: '4월 3일', tokens: 8500, cost: 0.062 },
  ],
}

export function UsageSettings() {
  return (
    <div className="space-y-8">
      {/* 이번 달 요약 */}
      <section>
        <h3 className="text-sm font-semibold mb-1">{USAGE_DATA.currentMonth} 사용량</h3>
        <p className="text-xs text-muted-foreground mb-4">이번 달 AI 엔진 사용 현황입니다.</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium">총 토큰 사용량</span>
            </div>
            <p className="text-2xl font-bold">{USAGE_DATA.totalTokens.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium">총 비용</span>
            </div>
            <p className="text-2xl font-bold">${USAGE_DATA.totalCost.toFixed(3)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium">총 실행 횟수</span>
            </div>
            <p className="text-2xl font-bold">{USAGE_DATA.totalExecutions}</p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">생성된 산출물</span>
            </div>
            <p className="text-2xl font-bold">{USAGE_DATA.totalArtifacts}</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* 모델별 사용량 */}
      <section>
        <h3 className="text-sm font-semibold mb-4">모델별 사용량</h3>
        <div className="space-y-3">
          {USAGE_DATA.modelBreakdown.map((model) => (
            <div key={model.model} className="flex items-center gap-4 p-3 rounded-lg border">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{model.model}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{model.tokens.toLocaleString()} 토큰</span>
                    <span>${model.cost.toFixed(3)}</span>
                    <Badge variant="secondary" className="text-[10px]">{model.executions}회</Badge>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/60 rounded-full transition-all"
                    style={{ width: `${model.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* 일별 사용량 */}
      <section>
        <h3 className="text-sm font-semibold mb-4">일별 사용량</h3>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">날짜</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">토큰</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">비용</th>
              </tr>
            </thead>
            <tbody>
              {USAGE_DATA.dailyUsage.map((day) => (
                <tr key={day.date} className="border-b last:border-0">
                  <td className="px-4 py-2.5">{day.date}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{day.tokens.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">${day.cost.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

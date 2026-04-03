import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Activity, ScrollText } from 'lucide-react'
import { ExecutionLog } from '@/features/activity/components/ExecutionLog'
import { EventFeed } from '@/features/activity/components/EventFeed'
import { ExecutionDetailPanel } from '@/features/activity/components/ExecutionDetailPanel'
import { mockExecutionLogs, mockActivityEvents } from '@/mocks/activity'

export const Route = createFileRoute('/$workspaceId/activity')({
  component: ActivityPage,
})

type ActivityTab = 'executions' | 'events'

function ActivityPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/activity' })
  const [activeTab, setActiveTab] = useState<ActivityTab>('executions')
  const [selectedExecId, setSelectedExecId] = useState<string | null>(null)

  const wsLogs = mockExecutionLogs.filter((l) => l.workspaceId === workspaceId)
  const wsEvents = mockActivityEvents.filter((e) => e.workspaceId === workspaceId)

  const runningCount = wsLogs.filter((l) => l.status === 'running').length
  const selectedExec = selectedExecId ? wsLogs.find((l) => l.id === selectedExecId) ?? null : null

  const tabs: { id: ActivityTab; label: string; icon: typeof Activity; count?: number }[] = [
    { id: 'executions', label: '실행 기록', icon: Activity, count: runningCount > 0 ? runningCount : undefined },
    { id: 'events', label: '이벤트 피드', icon: ScrollText },
  ]

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">활동 로그</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI 직원들의 실행 기록과 주요 이벤트를 모니터링합니다.
          </p>
        </div>

        {/* 탭 */}
        <div className="flex items-center gap-1 mb-6 border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedExecId(null) }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />{tab.label}
                {tab.count && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-500 text-white font-medium">{tab.count}</span>}
              </button>
            )
          })}
        </div>

        {activeTab === 'executions' && (
          <ExecutionLog logs={wsLogs} selectedId={selectedExecId} onSelect={setSelectedExecId} />
        )}
        {activeTab === 'events' && <EventFeed events={wsEvents} />}
      </div>

      {/* 인라인 상세 패널 */}
      {activeTab === 'executions' && selectedExec && (
        <ExecutionDetailPanel
          execution={selectedExec}
          onClose={() => setSelectedExecId(null)}
        />
      )}
    </div>
  )
}

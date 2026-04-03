import type { MissionStep } from '@/types/mission'
import { Check, Loader2, Circle } from 'lucide-react'
import { mockAgents } from '@/mocks/agents'

interface MissionTimelineProps {
  steps: MissionStep[]
}

export function MissionTimeline({ steps }: MissionTimelineProps) {
  const getAgentName = (agentId: string) => {
    if (!agentId) return 'CEO'
    return mockAgents.find((a) => a.id === agentId)?.name ?? agentId
  }

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.order} className="flex gap-3">
          {/* 아이콘 + 라인 */}
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              step.status === 'completed' ? 'bg-green-500 text-white' :
              step.status === 'in_progress' ? 'bg-primary text-primary-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {step.status === 'completed' && <Check className="w-3.5 h-3.5" />}
              {step.status === 'in_progress' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {step.status === 'pending' && <Circle className="w-3 h-3" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 min-h-[24px] ${
                step.status === 'completed' ? 'bg-green-500/30' : 'bg-border'
              }`} />
            )}
          </div>

          {/* 내용 */}
          <div className="pb-4 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                step.status === 'completed' ? 'text-foreground' :
                step.status === 'in_progress' ? 'text-primary' :
                'text-muted-foreground'
              }`}>
                {step.name}
              </span>
              {step.progress !== null && step.status === 'in_progress' && (
                <span className="text-xs text-primary">{step.progress}%</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{getAgentName(step.agentId)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

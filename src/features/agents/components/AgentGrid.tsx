import type { Agent } from '@/types/agent'
import { AgentCard } from './AgentCard'
import { Plus } from 'lucide-react'

interface AgentGridProps {
  agents: Agent[]
  onAgentClick: (agentId: string) => void
  onEditClick: (agentId: string) => void
  onDuplicate: (agentId: string) => void
  onDelete: (agentId: string) => void
  onAddClick: () => void
}

export function AgentGrid({ agents, onAgentClick, onEditClick, onDuplicate, onDelete, onAddClick }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">👤</div>
        <h3 className="text-sm font-medium text-foreground mb-1">아직 직원이 없습니다</h3>
        <p className="text-xs text-muted-foreground mb-4">이 부서에 AI 직원을 추가해 보세요.</p>
        <button
          onClick={onAddClick}
          className="px-3 py-1.5 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          직원 추가
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onClick={() => onAgentClick(agent.id)}
          onEdit={() => onEditClick(agent.id)}
          onDuplicate={() => onDuplicate(agent.id)}
          onDelete={() => onDelete(agent.id)}
        />
      ))}
      <button
        onClick={onAddClick}
        className="rounded-xl border border-dashed p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-all min-h-[120px]"
      >
        <Plus className="w-4 h-4" />
        직원 추가
      </button>
    </div>
  )
}

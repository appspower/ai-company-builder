import { MoreHorizontal, Pencil, Copy, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { Agent } from '@/types/agent'
import { AGENT_STATUS_COLORS, LLM_MODEL_LABELS } from '@/lib/constants'

interface AgentCardProps {
  agent: Agent
  onClick: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export function AgentCard({ agent, onClick, onEdit, onDuplicate, onDelete }: AgentCardProps) {
  const statusColors = AGENT_STATUS_COLORS[agent.status]

  return (
    <div
      onClick={onClick}
      className="rounded-xl border bg-card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group relative"
    >
      {/* 컨텍스트 메뉴 */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              />
            }
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit() }} className="cursor-pointer">
              <Pencil className="w-3.5 h-3.5 mr-2" />
              편집
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate() }} className="cursor-pointer">
              <Copy className="w-3.5 h-3.5 mr-2" />
              복제
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onDelete() }}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-start justify-between mb-3 pr-6">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors.dot}`} />
          <h3 className="font-medium text-sm">{agent.name}</h3>
        </div>
        <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
          {LLM_MODEL_LABELS[agent.llmModel] ?? agent.llmModel}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{agent.role}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{agent.lastActivityAt}</span>
        {agent.statusMessage && (
          <span className={`${agent.status === 'error' ? 'text-red-500' : 'text-amber-500'}`}>
            {agent.statusMessage}
          </span>
        )}
      </div>
    </div>
  )
}

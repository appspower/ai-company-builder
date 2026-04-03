import type { Mission } from '@/types/mission'
import { Package } from 'lucide-react'

interface MissionCardProps {
  mission: Mission
  onClick: () => void
}

export function MissionCard({ mission, onClick }: MissionCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg border bg-card p-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-medium line-clamp-2 mb-2">{mission.title}</p>

      {/* 진행률 바 */}
      {mission.progress !== null && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{mission.progressLabel}</span>
            <span>{mission.progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${mission.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 하단 메타 */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{mission.createdAt}</span>
        <div className="flex items-center gap-2">
          {mission.artifactCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Package className="w-3 h-3" />
              {mission.artifactCount}
            </span>
          )}
          {mission.requiresApproval && (
            <span className="text-[10px] px-1 py-0.5 rounded bg-primary/10 text-primary">결재</span>
          )}
        </div>
      </div>
    </div>
  )
}

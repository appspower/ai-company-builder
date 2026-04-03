import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Mission } from '@/types/mission'
import { MISSION_STATUS_LABELS, MISSION_STATUS_COLORS, FILE_TYPE_ICONS } from '@/lib/constants'
import { MissionTimeline } from './MissionTimeline'
import { mockArtifacts } from '@/mocks/artifacts'
import { mockAgents } from '@/mocks/agents'
import { mockDepartments } from '@/mocks/departments'

interface MissionDetailPanelProps {
  mission: Mission | null
  open: boolean
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function MissionDetailPanel({ mission, open, onClose, onApprove, onReject }: MissionDetailPanelProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }

  if (!mission) return null

  const artifacts = mockArtifacts.filter((a) => a.missionId === mission.id)
  const dept = mockDepartments.find((d) => d.id === mission.departmentId)
  const assignedAgents = mockAgents.filter((a) => mission.assignedAgentIds.includes(a.id))

  const handleGoToAgents = () => {
    onClose()
    navigate({ to: `/${workspaceId}/agents` })
  }

  const handleGoToArtifacts = () => {
    onClose()
    navigate({ to: `/${workspaceId}/artifacts` })
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg leading-snug">{mission.title}</SheetTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={MISSION_STATUS_COLORS[mission.status]}>
              {MISSION_STATUS_LABELS[mission.status]}
            </Badge>
            {mission.requiresApproval && (
              <Badge variant="secondary" className="text-[10px]">결재 필요</Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {mission.description && (
            <section>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">설명</h4>
              <p className="text-sm">{mission.description}</p>
            </section>
          )}

          <section className="flex gap-6 text-sm">
            <div>
              <label className="text-xs text-muted-foreground">담당 부서</label>
              <p className="mt-0.5 font-medium">{dept?.name ?? '미지정'}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">생성일</label>
              <p className="mt-0.5">{mission.createdAt}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">산출물</label>
              <p className="mt-0.5">{mission.artifactCount}건</p>
            </div>
          </section>

          {assignedAgents.length > 0 && (
            <>
              <Separator />
              <section>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">담당 직원</h4>
                <div className="flex flex-wrap gap-2">
                  {assignedAgents.map((a) => (
                    <Badge
                      key={a.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                      onClick={handleGoToAgents}
                    >
                      {a.name}
                    </Badge>
                  ))}
                </div>
              </section>
            </>
          )}

          <Separator />

          {mission.steps.length > 0 && (
            <section>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">진행 단계</h4>
              <MissionTimeline steps={mission.steps} />
            </section>
          )}

          {artifacts.length > 0 && (
            <>
              <Separator />
              <section>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">산출물</h4>
                <div className="space-y-1.5">
                  {artifacts.map((art) => (
                    <button
                      key={art.id}
                      onClick={handleGoToArtifacts}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm w-full text-left hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span>{FILE_TYPE_ICONS[art.fileType]}</span>
                      <span className="truncate flex-1">{art.fileName}</span>
                      <span className="text-xs text-muted-foreground">v{art.version}</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {mission.status === 'approval_pending' && (
            <ApprovalActions
              missionId={mission.id}
              onApprove={onApprove}
              onReject={onReject}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ApprovalActions({
  missionId,
  onApprove,
  onReject,
}: {
  missionId: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleReject = () => {
    onReject(missionId)
    setShowRejectInput(false)
    setFeedback('')
  }

  return (
    <>
      <Separator />
      <section className="space-y-3">
        {showRejectInput ? (
          <>
            <textarea
              autoFocus
              placeholder="반려 사유를 입력해 주세요"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowRejectInput(false); setFeedback('') }}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
              >
                반려 확정
              </Button>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setShowRejectInput(true)}
            >
              반려
            </Button>
            <Button
              className="flex-1"
              onClick={() => onApprove(missionId)}
            >
              승인
            </Button>
          </div>
        )}
      </section>
    </>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { Mission } from '@/types/mission'
import { MISSION_STATUS_LABELS, MISSION_STATUS_COLORS, MISSION_PRIORITY_LABELS, MISSION_PRIORITY_COLORS, FILE_TYPE_ICONS } from '@/lib/constants'
import { MissionTimeline } from './MissionTimeline'
import { mockArtifacts } from '@/mocks/artifacts'
import { mockAgents } from '@/mocks/agents'
import { mockDepartments } from '@/mocks/departments'

interface MissionDetailPanelProps {
  mission: Mission | null
  open: boolean
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string, feedback: string) => void
}

export function MissionDetailPanel({ mission, open, onClose, onApprove, onReject }: MissionDetailPanelProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }

  if (!mission) return null

  const artifacts = mockArtifacts.filter((a) => a.missionId === mission.id)
  const dept = mockDepartments.find((d) => d.id === mission.departmentId)
  const assignedAgents = mockAgents.filter((a) => mission.assignedAgentIds.includes(a.id))
  const priorityColors = MISSION_PRIORITY_COLORS[mission.priority]
  const isOverdue = mission.dueDate?.includes('4월 3') && mission.status !== 'completed'

  const handleGoToAgents = () => { onClose(); navigate({ to: `/${workspaceId}/agents` }) }
  const handleGoToArtifacts = () => { onClose(); navigate({ to: `/${workspaceId}/artifacts` }) }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg leading-snug">{mission.title}</SheetTitle>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className={MISSION_STATUS_COLORS[mission.status]}>
              {MISSION_STATUS_LABELS[mission.status]}
            </Badge>
            <Badge variant="secondary" className={`${priorityColors.text} ${priorityColors.bg} border-0`}>
              {MISSION_PRIORITY_LABELS[mission.priority]}
            </Badge>
            {mission.requiresApproval && (
              <Badge variant="secondary" className="text-[10px]">결재 필요</Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* 반려 사유 (있으면 최상단에 경고로 표시) */}
          {mission.rejectionFeedback && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                반려 사유
              </div>
              <p className="text-sm">{mission.rejectionFeedback}</p>
            </div>
          )}

          {/* 완료 요약 */}
          {mission.status === 'completed' && (
            <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mb-2">
                <CheckCircle2 className="w-4 h-4" />
                미션 완료
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">{mission.steps.length}</p>
                  <p className="text-[11px] text-muted-foreground">총 단계</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{mission.artifactCount}</p>
                  <p className="text-[11px] text-muted-foreground">산출물</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{mission.completedAt ?? '-'}</p>
                  <p className="text-[11px] text-muted-foreground">완료일</p>
                </div>
              </div>
            </div>
          )}

          {/* 설명 */}
          {mission.description && (
            <section>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">설명</h4>
              <p className="text-sm">{mission.description}</p>
            </section>
          )}

          {/* 메타 정보 */}
          <section className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-xs text-muted-foreground">담당 부서</label>
              <p className="mt-0.5 font-medium">{dept?.name ?? '미지정'}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">생성일</label>
              <p className="mt-0.5">{mission.createdAt}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">마감일</label>
              <p className={`mt-0.5 flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                {isOverdue && <AlertTriangle className="w-3 h-3" />}
                {mission.dueDate ? (
                  <><Clock className="w-3 h-3" /> {mission.dueDate}</>
                ) : (
                  <span className="text-muted-foreground">미설정</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">산출물</label>
              <p className="mt-0.5">{mission.artifactCount}건</p>
            </div>
          </section>

          {/* 담당 에이전트 */}
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

          {/* 타임라인 */}
          {mission.steps.length > 0 && (
            <section>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">진행 단계</h4>
              <MissionTimeline steps={mission.steps} />
            </section>
          )}

          {/* 산출물 */}
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

          {/* 승인/반려 */}
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
  onReject: (id: string, feedback: string) => void
}) {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleReject = () => {
    onReject(missionId, feedback)
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
              <Button variant="outline" className="flex-1" onClick={() => { setShowRejectInput(false); setFeedback('') }}>
                취소
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject}>
                반려 확정
              </Button>
            </div>
          </>
        ) : (
          <div className="flex gap-3">
            <Button variant="destructive" className="flex-1" onClick={() => setShowRejectInput(true)}>
              반려
            </Button>
            <Button className="flex-1" onClick={() => onApprove(missionId)}>
              승인
            </Button>
          </div>
        )}
      </section>
    </>
  )
}

import { useNavigate, useParams } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { X, Clock, AlertTriangle, CheckCircle2, Pencil } from 'lucide-react'
import type { Mission } from '@/types/mission'
import { MISSION_STATUS_LABELS, MISSION_STATUS_COLORS, MISSION_PRIORITY_LABELS, MISSION_PRIORITY_COLORS, APPROVAL_MODE_LABELS, APPROVAL_MODE_COLORS, FILE_TYPE_ICONS } from '@/lib/constants'
import { MissionTimeline } from './MissionTimeline'
import { mockArtifacts } from '@/mocks/artifacts'
import { mockAgents } from '@/mocks/agents'
import { mockDepartments } from '@/mocks/departments'

interface MissionInlineDetailProps {
  mission: Mission
  onClose: () => void
  onApproveClick: () => void
}

export function MissionInlineDetail({ mission, onClose, onApproveClick }: MissionInlineDetailProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }

  const artifacts = mockArtifacts.filter((a) => a.missionId === mission.id)
  const dept = mockDepartments.find((d) => d.id === mission.departmentId)
  const assignedAgents = mockAgents.filter((a) => mission.assignedAgentIds.includes(a.id))
  const priorityColors = MISSION_PRIORITY_COLORS[mission.priority]
  const isOverdue = mission.dueDate?.includes('4월 3') && mission.status !== 'completed'

  const handleGoToAgents = () => navigate({ to: `/${workspaceId}/agents` })
  const handleGoToArtifacts = () => navigate({ to: `/${workspaceId}/artifacts` })

  return (
    <div className="w-[400px] shrink-0 border-l bg-card overflow-y-auto h-full">
      {/* 헤더 */}
      <div className="px-5 pt-5 pb-3 sticky top-0 bg-card z-10 border-b">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-base font-semibold leading-snug">{mission.title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 shrink-0">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={MISSION_STATUS_COLORS[mission.status]}>
            {MISSION_STATUS_LABELS[mission.status]}
          </Badge>
          <Badge variant="secondary" className={`${priorityColors.text} ${priorityColors.bg} border-0`}>
            {MISSION_PRIORITY_LABELS[mission.priority]}
          </Badge>
          <Badge variant="secondary" className={`text-[10px] ${APPROVAL_MODE_COLORS[mission.approvalMode].text} ${APPROVAL_MODE_COLORS[mission.approvalMode].bg} border-0`}>
            {APPROVAL_MODE_LABELS[mission.approvalMode]}
          </Badge>
        </div>

        {/* 승인 대기 시 액션 버튼 */}
        {mission.status === 'approval_pending' && (
          <div className="mt-3">
            <Button size="sm" className="w-full" onClick={onApproveClick}>
              <Pencil className="w-3 h-3 mr-1" />
              결재 처리하기
            </Button>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="px-5 py-4 space-y-5">
        {/* 반려 사유 */}
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
          <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium mb-2">
              <CheckCircle2 className="w-4 h-4" />
              미션 완료
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold">{mission.steps.length}</p>
                <p className="text-[10px] text-muted-foreground">총 단계</p>
              </div>
              <div>
                <p className="text-lg font-bold">{mission.artifactCount}</p>
                <p className="text-[10px] text-muted-foreground">산출물</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[13px]">{mission.completedAt ?? '-'}</p>
                <p className="text-[10px] text-muted-foreground">완료일</p>
              </div>
            </div>
          </div>
        )}

        {/* 설명 */}
        {mission.description && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">설명</h4>
            <p className="text-sm">{mission.description}</p>
          </div>
        )}

        {/* 메타 정보 */}
        <div className="grid grid-cols-2 gap-3 text-sm">
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
              {mission.dueDate ? (<><Clock className="w-3 h-3" /> {mission.dueDate}</>) : <span className="text-muted-foreground">미설정</span>}
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">산출물</label>
            <p className="mt-0.5">{mission.artifactCount}건</p>
          </div>
        </div>

        {/* 담당 에이전트 */}
        {assignedAgents.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">담당 직원</h4>
              <div className="flex flex-wrap gap-1.5">
                {assignedAgents.map((a) => (
                  <Badge
                    key={a.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-xs"
                    onClick={handleGoToAgents}
                  >
                    {a.name}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 타임라인 */}
        {mission.steps.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">진행 단계</h4>
              <MissionTimeline steps={mission.steps} />
            </div>
          </>
        )}

        {/* 산출물 */}
        {artifacts.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">산출물</h4>
              <div className="space-y-1">
                {artifacts.map((art) => (
                  <button
                    key={art.id}
                    onClick={handleGoToArtifacts}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm w-full text-left hover:bg-muted transition-colors"
                  >
                    <span>{FILE_TYPE_ICONS[art.fileType]}</span>
                    <span className="truncate flex-1">{art.fileName}</span>
                    <span className="text-xs text-muted-foreground">v{art.version}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { useNavigate, useParams } from '@tanstack/react-router'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download, ExternalLink } from 'lucide-react'
import type { Artifact } from '@/types/artifact'
import { FILE_TYPE_ICONS, LLM_MODEL_LABELS } from '@/lib/constants'
import { mockAgents } from '@/mocks/agents'
import { mockMissions } from '@/mocks/missions'

const STATUS_LABELS: Record<string, string> = {
  approval_pending: '승인 대기',
  review: '검토 중',
  completed: '완료',
  published: '게시 완료',
}

interface ArtifactDetailPanelProps {
  artifact: Artifact | null
  open: boolean
  onClose: () => void
}

export function ArtifactDetailPanel({ artifact, open, onClose }: ArtifactDetailPanelProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }

  if (!artifact) return null

  const agent = mockAgents.find((a) => a.id === artifact.agentId)
  const mission = mockMissions.find((m) => m.id === artifact.missionId)

  const handleGoToMission = () => {
    onClose()
    navigate({ to: `/${workspaceId}/missions` })
  }

  // 같은 미션의 다른 버전 시뮬레이션
  const versionHistory = Array.from({ length: artifact.version }, (_, i) => ({
    version: i + 1,
    label: i + 1 === artifact.version ? '현재' : `v${i + 1}`,
    date: i + 1 === artifact.version ? artifact.createdAt : `${artifact.version - i}일 전`,
  })).reverse()

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{FILE_TYPE_ICONS[artifact.fileType]}</span>
            <SheetTitle className="text-lg leading-snug">{artifact.fileName}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* 미리보기 */}
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">미리보기</h4>
            <div className="rounded-lg border bg-muted/30 p-6 flex flex-col items-center justify-center min-h-[160px]">
              <span className="text-4xl mb-2">{FILE_TYPE_ICONS[artifact.fileType]}</span>
              <p className="text-sm text-muted-foreground">
                {artifact.fileType === 'document' && '마크다운 문서 미리보기'}
                {artifact.fileType === 'image' && '이미지 미리보기'}
                {artifact.fileType === 'video' && '영상 미리보기'}
                {artifact.fileType === 'spreadsheet' && '스프레드시트 미리보기'}
                {artifact.fileType === 'data' && '데이터 파일 미리보기'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">(Phase 2에서 실제 파일 연동)</p>
            </div>
          </section>

          <Separator />

          {/* 메타 정보 */}
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">정보</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="text-xs text-muted-foreground">상태</label>
                <p className="mt-0.5">
                  <Badge variant="secondary">{STATUS_LABELS[artifact.status]}</Badge>
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">버전</label>
                <p className="mt-0.5 font-mono">v{artifact.version}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">생성 직원</label>
                <p className="mt-0.5 font-medium">{agent?.name ?? '알 수 없음'}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">AI 엔진</label>
                <p className="mt-0.5">
                  <Badge variant="outline" className="font-mono text-xs">
                    {LLM_MODEL_LABELS[artifact.metadata.llmModel] ?? artifact.metadata.llmModel}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">생성일</label>
                <p className="mt-0.5">{artifact.createdAt}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">부가 정보</label>
                <p className="mt-0.5 text-muted-foreground">
                  {artifact.metadata.wordCount && `${artifact.metadata.wordCount}자`}
                  {artifact.metadata.dimensions && artifact.metadata.dimensions}
                  {artifact.metadata.duration && artifact.metadata.duration}
                  {!artifact.metadata.wordCount && !artifact.metadata.dimensions && !artifact.metadata.duration && '-'}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* 연결 미션 */}
          {mission && (
            <section>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">연결 미션</h4>
              <button
                onClick={handleGoToMission}
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors w-full text-left"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm truncate">{mission.title}</span>
              </button>
            </section>
          )}

          <Separator />

          {/* 버전 이력 */}
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">버전 이력</h4>
            <div className="space-y-2">
              {versionHistory.map((v) => (
                <div
                  key={v.version}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${
                    v.version === artifact.version
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50 hover:bg-muted cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">v{v.version}</span>
                    {v.version === artifact.version && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">현재</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{v.date}</span>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* 다운로드 버튼 */}
          <Button className="w-full" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            다운로드
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

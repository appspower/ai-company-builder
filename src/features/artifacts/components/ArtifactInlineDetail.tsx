import { useNavigate, useParams } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { X, Download, ExternalLink, Star, StarOff } from 'lucide-react'
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

const STATUS_DOT: Record<string, string> = {
  approval_pending: 'bg-primary',
  review: 'bg-amber-500',
  completed: 'bg-green-500',
  published: 'bg-blue-500',
}

interface ArtifactInlineDetailProps {
  artifact: Artifact
  onClose: () => void
  onToggleStarred: () => void
}

export function ArtifactInlineDetail({ artifact, onClose, onToggleStarred }: ArtifactInlineDetailProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }

  const agent = mockAgents.find((a) => a.id === artifact.agentId)
  const mission = mockMissions.find((m) => m.id === artifact.missionId)

  const versionHistory = Array.from({ length: artifact.version }, (_, i) => ({
    version: i + 1,
    isCurrent: i + 1 === artifact.version,
    date: i + 1 === artifact.version ? artifact.createdAt : `${artifact.version - i}일 전`,
  })).reverse()

  return (
    <div className="w-[400px] shrink-0 border-l bg-card overflow-y-auto h-full">
      {/* 헤더 */}
      <div className="px-5 pt-5 pb-3 sticky top-0 bg-card z-10 border-b">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl shrink-0">{FILE_TYPE_ICONS[artifact.fileType]}</span>
            <h2 className="text-base font-semibold truncate">{artifact.fileName}</h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleStarred}
              className={`p-1.5 rounded-md transition-colors ${artifact.starred ? 'text-amber-500 hover:bg-amber-500/10' : 'text-muted-foreground hover:bg-muted'}`}
            >
              {artifact.starred ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[artifact.status]}`} />
            <span className="text-xs">{STATUS_LABELS[artifact.status]}</span>
          </div>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground font-mono">v{artifact.version}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <Badge variant="outline" className="text-[10px] font-mono">{LLM_MODEL_LABELS[artifact.metadata.llmModel] ?? artifact.metadata.llmModel}</Badge>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* 마크다운 미리보기 */}
        {artifact.content ? (
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">미리보기</h4>
            <div className="rounded-lg border bg-muted/20 p-4 text-sm whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto font-mono">
              {artifact.content}
            </div>
          </section>
        ) : (
          <section>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">미리보기</h4>
            <div className="rounded-lg border bg-muted/20 p-6 flex flex-col items-center justify-center min-h-[120px]">
              <span className="text-3xl mb-2">{FILE_TYPE_ICONS[artifact.fileType]}</span>
              <p className="text-xs text-muted-foreground">
                {artifact.fileType === 'image' && '이미지 미리보기 (Phase 2)'}
                {artifact.fileType === 'video' && `영상 ${artifact.metadata.duration ?? ''} (Phase 2)`}
                {artifact.fileType === 'spreadsheet' && '스프레드시트 미리보기 (Phase 2)'}
                {artifact.fileType === 'data' && '데이터 파일 (Phase 2)'}
              </p>
            </div>
          </section>
        )}

        <Separator />

        {/* 메타 정보 */}
        <section className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-xs text-muted-foreground">생성 직원</label>
            <p className="mt-0.5 font-medium">{agent?.name ?? '알 수 없음'}</p>
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
        </section>

        {/* 연결 미션 */}
        {mission && (
          <>
            <Separator />
            <section>
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">연결 미션</h4>
              <button
                onClick={() => navigate({ to: `/${workspaceId}/missions` })}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors w-full text-left text-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{mission.title}</span>
              </button>
            </section>
          </>
        )}

        {/* 버전 이력 */}
        <Separator />
        <section>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">버전 이력</h4>
          <div className="space-y-1.5">
            {versionHistory.map((v) => (
              <div
                key={v.version}
                className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                  v.isCurrent ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">v{v.version}</span>
                  {v.isCurrent && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">현재</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">{v.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 다운로드 */}
        <Button className="w-full" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          다운로드
        </Button>
      </div>
    </div>
  )
}

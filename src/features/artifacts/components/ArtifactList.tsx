import { Search, List, LayoutGrid } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Artifact, FileType, ArtifactStatus } from '@/types/artifact'
import type { Agent } from '@/types/agent'
import { FILE_TYPE_ICONS } from '@/lib/constants'

const STATUS_LABELS: Record<ArtifactStatus, string> = {
  approval_pending: '승인 대기',
  review: '검토 중',
  completed: '완료',
  published: '게시 완료',
}

const STATUS_DOT: Record<ArtifactStatus, string> = {
  approval_pending: 'bg-primary',
  review: 'bg-amber-500',
  completed: 'bg-green-500',
  published: 'bg-blue-500',
}

interface ArtifactListProps {
  artifacts: Artifact[]
  agents: Agent[]
  viewMode: 'list' | 'grid'
  searchQuery: string
  filterFileType: FileType | 'all'
  filterStatus: ArtifactStatus | 'all'
  filterAgentId: string
  onSearch: (q: string) => void
  onFilterFileType: (t: FileType | 'all') => void
  onFilterStatus: (s: ArtifactStatus | 'all') => void
  onFilterAgent: (id: string) => void
  onViewMode: (m: 'list' | 'grid') => void
  onArtifactClick: (id: string) => void
}

export function ArtifactList({
  artifacts, agents, viewMode, searchQuery,
  filterFileType, filterStatus, filterAgentId,
  onSearch, onFilterFileType, onFilterStatus, onFilterAgent, onViewMode,
  onArtifactClick,
}: ArtifactListProps) {
  const getAgentName = (agentId: string) =>
    agents.find((a) => a.id === agentId)?.name ?? '알 수 없음'

  // 필터링
  let filtered = artifacts
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter((a) =>
      a.fileName.toLowerCase().includes(q) || getAgentName(a.agentId).toLowerCase().includes(q)
    )
  }
  if (filterFileType !== 'all') {
    filtered = filtered.filter((a) => a.fileType === filterFileType)
  }
  if (filterStatus !== 'all') {
    filtered = filtered.filter((a) => a.status === filterStatus)
  }
  if (filterAgentId !== 'all') {
    filtered = filtered.filter((a) => a.agentId === filterAgentId)
  }

  return (
    <div>
      {/* 필터 바 */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="파일명 또는 직원 이름으로 검색"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterFileType} onValueChange={(v) => onFilterFileType(v as FileType | 'all')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 유형</SelectItem>
            <SelectItem value="document">📄 문서</SelectItem>
            <SelectItem value="image">🖼️ 이미지</SelectItem>
            <SelectItem value="video">🎬 영상</SelectItem>
            <SelectItem value="spreadsheet">📊 스프레드시트</SelectItem>
            <SelectItem value="data">📋 데이터</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAgentId} onValueChange={(v) => onFilterAgent(v ?? 'all')}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="직원" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 직원</SelectItem>
            {agents.map((a) => (
              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => onFilterStatus(v as ArtifactStatus | 'all')}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="approval_pending">승인 대기</SelectItem>
            <SelectItem value="review">검토 중</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
            <SelectItem value="published">게시 완료</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => onViewMode('list')}
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewMode('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 결과 없음 */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">
            {artifacts.length === 0
              ? '아직 산출물이 없습니다. 미션을 실행하면 여기에 결과물이 쌓입니다.'
              : '검색 조건에 맞는 산출물이 없습니다.'}
          </p>
        </div>
      )}

      {/* 리스트 뷰 */}
      {filtered.length > 0 && viewMode === 'list' && (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">파일명</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">생성 직원</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">버전</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">상태</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">생성일</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((art) => (
                <tr
                  key={art.id}
                  onClick={() => onArtifactClick(art.id)}
                  className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{FILE_TYPE_ICONS[art.fileType]}</span>
                      <span className="font-medium truncate max-w-[280px]">{art.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{getAgentName(art.agentId)}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">v{art.version}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[art.status]}`} />
                      <span className="text-xs">{STATUS_LABELS[art.status]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{art.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 그리드 뷰 */}
      {filtered.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((art) => (
            <div
              key={art.id}
              onClick={() => onArtifactClick(art.id)}
              className="rounded-xl border bg-card p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{FILE_TYPE_ICONS[art.fileType]}</div>
              <p className="text-sm font-medium truncate">{art.fileName}</p>
              <p className="text-xs text-muted-foreground mt-1">{getAgentName(art.agentId)}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[art.status]}`} />
                  <span className="text-xs text-muted-foreground">{STATUS_LABELS[art.status]}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">v{art.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { Star, Search, List, LayoutGrid, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Artifact, FileType, ArtifactStatus } from '@/types/artifact'
import type { Agent } from '@/types/agent'
import { FILE_TYPE_ICONS } from '@/lib/constants'
import { mockMissions } from '@/mocks/missions'
import type { ArtifactSortBy } from '@/features/artifacts/store'

const STATUS_LABELS: Record<ArtifactStatus, string> = {
  approval_pending: '승인 대기', review: '검토 중', completed: '완료', published: '게시 완료',
}
const STATUS_DOT: Record<ArtifactStatus, string> = {
  approval_pending: 'bg-primary', review: 'bg-amber-500', completed: 'bg-green-500', published: 'bg-blue-500',
}

interface QuickFilterDef {
  id: string; label: string; icon: typeof Star
  color: string; activeColor: string
  filter: (a: Artifact) => boolean
}

const QUICK_FILTERS: QuickFilterDef[] = [
  { id: 'starred', label: '즐겨찾기', icon: Star, color: 'text-muted-foreground', activeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30', filter: (a) => a.starred },
  { id: 'pending', label: '승인 대기', icon: Clock, color: 'text-muted-foreground', activeColor: 'bg-primary/10 text-primary border-primary/30', filter: (a) => a.status === 'approval_pending' },
  { id: 'recent', label: '최근 생성', icon: AlertTriangle, color: 'text-muted-foreground', activeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/30', filter: (a) => a.createdAt.includes('시간') || a.createdAt.includes('분') },
  { id: 'published', label: '게시 완료', icon: CheckCircle2, color: 'text-muted-foreground', activeColor: 'bg-green-500/10 text-green-600 border-green-500/30', filter: (a) => a.status === 'published' },
]

interface ArtifactListProps {
  artifacts: Artifact[]
  agents: Agent[]
  viewMode: 'list' | 'grid'
  searchQuery: string
  filterFileType: FileType | 'all'
  filterStatus: ArtifactStatus | 'all'
  filterAgentId: string
  filterMissionId: string
  sortBy: ArtifactSortBy
  activeQuickFilters: Set<string>
  onSearch: (q: string) => void
  onFilterFileType: (t: FileType | 'all') => void
  onFilterStatus: (s: ArtifactStatus | 'all') => void
  onFilterAgent: (id: string) => void
  onFilterMission: (id: string) => void
  onSortBy: (s: ArtifactSortBy) => void
  onToggleQuickFilter: (id: string) => void
  onViewMode: (m: 'list' | 'grid') => void
  onArtifactClick: (id: string) => void
  onToggleStarred: (id: string) => void
}

export function ArtifactList({
  artifacts, agents, viewMode, searchQuery,
  filterFileType, filterStatus, filterAgentId, filterMissionId, sortBy, activeQuickFilters,
  onSearch, onFilterFileType, onFilterMission, onSortBy, onToggleQuickFilter,
  onViewMode, onArtifactClick, onToggleStarred,
}: ArtifactListProps) {
  const getAgentName = (agentId: string) => agents.find((a) => a.id === agentId)?.name ?? '알 수 없음'
  const getMissionTitle = (missionId: string) => mockMissions.find((m) => m.id === missionId)?.title ?? '-'

  const wsMissions = mockMissions.filter((m) => artifacts.some((a) => a.missionId === m.id))

  // 필터링
  let filtered = artifacts
  if (searchQuery) { const q = searchQuery.toLowerCase(); filtered = filtered.filter((a) => a.fileName.toLowerCase().includes(q) || getAgentName(a.agentId).toLowerCase().includes(q)) }
  if (filterFileType !== 'all') filtered = filtered.filter((a) => a.fileType === filterFileType)
  if (filterStatus !== 'all') filtered = filtered.filter((a) => a.status === filterStatus)
  if (filterAgentId !== 'all') filtered = filtered.filter((a) => a.agentId === filterAgentId)
  if (filterMissionId !== 'all') filtered = filtered.filter((a) => a.missionId === filterMissionId)
  // 퀵 필터
  if (activeQuickFilters.size > 0) {
    const activeQFs = QUICK_FILTERS.filter((f) => activeQuickFilters.has(f.id))
    for (const qf of activeQFs) filtered = filtered.filter(qf.filter)
  }
  // 정렬
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.fileName.localeCompare(b.fileName)
    if (sortBy === 'version') return b.version - a.version
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    return 0 // date는 이미 시간순
  })

  return (
    <div>
      {/* 퀵 필터 칩 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {QUICK_FILTERS.map((qf) => {
          const isActive = activeQuickFilters.has(qf.id)
          const Icon = qf.icon
          return (
            <button key={qf.id} onClick={() => onToggleQuickFilter(qf.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isActive ? qf.activeColor : 'border-border text-muted-foreground hover:bg-muted'}`}>
              <Icon className="w-3 h-3" />{qf.label}
            </button>
          )
        })}
        <div className="w-px h-5 bg-border mx-1" />
        <Select value={filterFileType} onValueChange={(v) => onFilterFileType((v ?? 'all') as FileType | 'all')}>
          <SelectTrigger className="w-28 h-8 text-xs border-dashed"><SelectValue placeholder="유형" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 유형</SelectItem>
            <SelectItem value="document">📄 문서</SelectItem>
            <SelectItem value="image">🖼️ 이미지</SelectItem>
            <SelectItem value="video">🎬 영상</SelectItem>
            <SelectItem value="spreadsheet">📊 시트</SelectItem>
            <SelectItem value="data">📋 데이터</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterMissionId} onValueChange={(v) => onFilterMission(v ?? 'all')}>
          <SelectTrigger className="w-36 h-8 text-xs border-dashed"><SelectValue placeholder="미션" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 미션</SelectItem>
            {wsMissions.map((m) => (<SelectItem key={m.id} value={m.id}><span className="truncate">{m.title}</span></SelectItem>))}
          </SelectContent>
        </Select>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="검색" value={searchQuery} onChange={(e) => onSearch(e.target.value)} className="pl-8 h-8 w-40 text-xs" />
        </div>
        <div className="flex border rounded-lg overflow-hidden">
          <button onClick={() => onViewMode('list')} className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}><List className="w-3.5 h-3.5" /></button>
          <button onClick={() => onViewMode('grid')} className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16"><p className="text-muted-foreground text-sm">{artifacts.length === 0 ? '아직 산출물이 없습니다.' : '검색 조건에 맞는 산출물이 없습니다.'}</p></div>
      )}

      {/* 리스트 뷰 */}
      {filtered.length > 0 && viewMode === 'list' && (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="w-8 px-2 py-3"></th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSortBy('name')}>파일명 {sortBy === 'name' && '↓'}</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground">직원</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground">연결 미션</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSortBy('version')}>버전 {sortBy === 'version' && '↓'}</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSortBy('status')}>상태 {sortBy === 'status' && '↓'}</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => onSortBy('date')}>생성일 {sortBy === 'date' && '↓'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((art) => (
                <tr key={art.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer transition-colors">
                  <td className="px-2 py-3">
                    <button onClick={(e) => { e.stopPropagation(); onToggleStarred(art.id) }}
                      className={`p-0.5 rounded ${art.starred ? 'text-amber-500' : 'text-muted-foreground/30 hover:text-muted-foreground'}`}>
                      <Star className={`w-3.5 h-3.5 ${art.starred ? 'fill-current' : ''}`} />
                    </button>
                  </td>
                  <td className="px-3 py-3" onClick={() => onArtifactClick(art.id)}>
                    <div className="flex items-center gap-2">
                      <span>{FILE_TYPE_ICONS[art.fileType]}</span>
                      <span className="font-medium truncate max-w-[220px]">{art.fileName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground" onClick={() => onArtifactClick(art.id)}>{getAgentName(art.agentId)}</td>
                  <td className="px-3 py-3 text-muted-foreground" onClick={() => onArtifactClick(art.id)}>
                    <span className="truncate block max-w-[180px]">{getMissionTitle(art.missionId)}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground font-mono" onClick={() => onArtifactClick(art.id)}>v{art.version}</td>
                  <td className="px-3 py-3" onClick={() => onArtifactClick(art.id)}>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[art.status]}`} />
                      <span className="text-xs">{STATUS_LABELS[art.status]}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground" onClick={() => onArtifactClick(art.id)}>{art.createdAt}</td>
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
            <div key={art.id} onClick={() => onArtifactClick(art.id)}
              className="rounded-xl border bg-card p-4 cursor-pointer hover:shadow-md transition-shadow relative group">
              <button onClick={(e) => { e.stopPropagation(); onToggleStarred(art.id) }}
                className={`absolute top-3 right-3 p-1 rounded opacity-0 group-hover:opacity-100 transition-all ${art.starred ? 'opacity-100 text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}>
                <Star className={`w-3.5 h-3.5 ${art.starred ? 'fill-current' : ''}`} />
              </button>
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

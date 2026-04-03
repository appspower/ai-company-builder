import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Plus, Search, LayoutGrid, List, AlertTriangle, Clock, CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { KanbanBoard, type GroupByMode } from '@/features/missions/components/KanbanBoard'
import { MissionListView } from '@/features/missions/components/MissionListView'
import { MissionInlineDetail } from '@/features/missions/components/MissionInlineDetail'
import { MissionDetailPanel } from '@/features/missions/components/MissionDetailPanel'
import { CreateMissionForm } from '@/features/missions/components/CreateMissionForm'
import { useMissionStore } from '@/features/missions/store'
import { useAgentStore } from '@/features/agents/store'
import { toast } from 'sonner'

export const Route = createFileRoute('/$workspaceId/missions')({
  component: MissionsPage,
})

interface QuickFilter {
  id: string
  label: string
  icon: typeof AlertTriangle
  color: string
  activeColor: string
  filter: (m: { status: string; priority: string; dueDate: string | null; approvalMode: string }) => boolean
}

const QUICK_FILTERS: QuickFilter[] = [
  { id: 'urgent', label: '긴급', icon: Zap, color: 'text-muted-foreground', activeColor: 'bg-red-500/10 text-red-600 border-red-500/30', filter: (m) => m.priority === 'urgent' || m.priority === 'high' },
  { id: 'approval', label: '결재 대기', icon: Clock, color: 'text-muted-foreground', activeColor: 'bg-primary/10 text-primary border-primary/30', filter: (m) => m.status === 'approval_pending' },
  { id: 'overdue', label: '마감 임박', icon: AlertTriangle, color: 'text-muted-foreground', activeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/30', filter: (m) => m.dueDate !== null && (m.dueDate.includes('4월 3') || m.dueDate.includes('4월 4')) },
  { id: 'active', label: '진행 중', icon: LayoutGrid, color: 'text-muted-foreground', activeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/30', filter: (m) => m.status === 'in_progress' || m.status === 'review' },
  { id: 'hide_done', label: '완료 제외', icon: CheckCircle2, color: 'text-muted-foreground', activeColor: 'bg-muted text-foreground border-border', filter: (m) => m.status !== 'completed' },
]

const GROUP_BY_OPTIONS: { mode: GroupByMode; label: string }[] = [
  { mode: 'status', label: '상태별' },
  { mode: 'priority', label: '우선순위별' },
  { mode: 'agent', label: '담당직원별' },
  { mode: 'approval', label: '결재방식별' },
]

function MissionsPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/missions' })
  const [createOpen, setCreateOpen] = useState(false)
  const [approvalMissionId, setApprovalMissionId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [groupBy, setGroupBy] = useState<GroupByMode>('status')
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [filterDept, setFilterDept] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { missions, selectedMissionId, selectMission, moveMission, approveMission, rejectMission, addMission } = useMissionStore()
  const { departments } = useAgentStore()

  const wsMissions = missions.filter((m) => m.workspaceId === workspaceId)
  const wsDepartments = departments.filter((d) => d.workspaceId === workspaceId)

  // 필터 적용
  let filteredMissions = wsMissions
  if (filterDept !== 'all') filteredMissions = filteredMissions.filter((m) => m.departmentId === filterDept)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    filteredMissions = filteredMissions.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
  }
  // 퀵 필터 — 활성 필터가 있으면 모든 필터의 AND 적용
  if (activeFilters.size > 0) {
    const activeQuickFilters = QUICK_FILTERS.filter((f) => activeFilters.has(f.id))
    for (const qf of activeQuickFilters) {
      filteredMissions = filteredMissions.filter(qf.filter)
    }
  }

  const selectedMission = selectedMissionId ? wsMissions.find((m) => m.id === selectedMissionId) ?? null : null
  const approvalMission = approvalMissionId ? wsMissions.find((m) => m.id === approvalMissionId) ?? null : null
  const isFiltered = filterDept !== 'all' || searchQuery.trim() || activeFilters.size > 0

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleApprove = (id: string) => {
    approveMission(id); setApprovalMissionId(null); selectMission(null)
    toast.success('미션이 승인되었습니다.')
  }

  const handleReject = (id: string, feedback: string) => {
    rejectMission(id, feedback); setApprovalMissionId(null); selectMission(null)
    toast.error('미션이 반려되었습니다.')
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">미션 센터</h1>
            <p className="text-sm text-muted-foreground mt-1">
              전체 {wsMissions.length}건{isFiltered && ` · 필터 적용: ${filteredMissions.length}건`}
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />새 미션
          </Button>
        </div>

        {/* 퀵 필터 칩 바 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {QUICK_FILTERS.map((qf) => {
            const isActive = activeFilters.has(qf.id)
            const Icon = qf.icon
            return (
              <button
                key={qf.id}
                onClick={() => toggleFilter(qf.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isActive ? qf.activeColor : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3 h-3" />
                {qf.label}
              </button>
            )
          })}
          <div className="w-px h-5 bg-border mx-1" />
          <Select value={filterDept} onValueChange={(v) => setFilterDept(v ?? 'all')}>
            <SelectTrigger className="w-28 h-8 text-xs border-dashed"><SelectValue placeholder="부서" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 부서</SelectItem>
              {wsDepartments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input placeholder="검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-8 w-40 text-xs" />
          </div>
        </div>

        {/* Group By 버튼 + 뷰 전환 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5">
            {GROUP_BY_OPTIONS.map((opt) => (
              <button
                key={opt.mode}
                onClick={() => setGroupBy(opt.mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  groupBy === opt.mode
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('board')} className={`p-1.5 transition-colors ${viewMode === 'board' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}>
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 콘텐츠 */}
        {filteredMissions.length > 0 ? (
          <div className="flex-1 overflow-auto">
            {viewMode === 'board' ? (
              <KanbanBoard missions={filteredMissions} groupBy={groupBy} onMissionClick={(id) => selectMission(id)} onMissionMove={moveMission} />
            ) : (
              <MissionListView missions={filteredMissions} onMissionClick={(id) => selectMission(id)} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-lg font-medium mb-2">{isFiltered ? '조건에 맞는 미션이 없습니다' : '아직 미션이 없습니다'}</h2>
            <p className="text-sm text-muted-foreground mb-6">{isFiltered ? '필터를 변경하거나 새 미션을 만들어 보세요.' : '첫 미션을 만들어 보세요.'}</p>
            <Button onClick={() => setCreateOpen(true)}>새 미션 만들기</Button>
          </div>
        )}
      </div>

      {selectedMission && (
        <MissionInlineDetail
          mission={selectedMission}
          onClose={() => selectMission(null)}
          onApproveClick={() => setApprovalMissionId(selectedMission.id)}
        />
      )}

      <MissionDetailPanel mission={approvalMission} open={!!approvalMissionId} onClose={() => setApprovalMissionId(null)} onApprove={handleApprove} onReject={handleReject} />
      <CreateMissionForm open={createOpen} onClose={() => setCreateOpen(false)} departments={wsDepartments} onCreate={(input) => addMission({ workspaceId, ...input })} />
    </div>
  )
}

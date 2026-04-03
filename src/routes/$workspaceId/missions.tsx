import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Plus, Search, LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { KanbanBoard } from '@/features/missions/components/KanbanBoard'
import { MissionListView } from '@/features/missions/components/MissionListView'
import { MissionDetailPanel } from '@/features/missions/components/MissionDetailPanel'
import { CreateMissionForm } from '@/features/missions/components/CreateMissionForm'
import { useMissionStore } from '@/features/missions/store'
import { useAgentStore } from '@/features/agents/store'
import { MISSION_PRIORITY_LABELS, MISSION_PRIORITY_COLORS } from '@/lib/constants'
import type { MissionPriority } from '@/types/mission'
import { toast } from 'sonner'

export const Route = createFileRoute('/$workspaceId/missions')({
  component: MissionsPage,
})

function MissionsPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/missions' })
  const [createOpen, setCreateOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [filterDept, setFilterDept] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    missions,
    selectedMissionId,
    selectMission,
    moveMission,
    approveMission,
    rejectMission,
    addMission,
  } = useMissionStore()

  const { departments } = useAgentStore()

  const wsMissions = missions.filter((m) => m.workspaceId === workspaceId)
  const wsDepartments = departments.filter((d) => d.workspaceId === workspaceId)

  // 필터링
  let filteredMissions = wsMissions
  if (filterDept !== 'all') {
    filteredMissions = filteredMissions.filter((m) => m.departmentId === filterDept)
  }
  if (filterPriority !== 'all') {
    filteredMissions = filteredMissions.filter((m) => m.priority === filterPriority)
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    filteredMissions = filteredMissions.filter((m) =>
      m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    )
  }

  const selectedMission = selectedMissionId
    ? wsMissions.find((m) => m.id === selectedMissionId) ?? null
    : null

  const isFiltered = filterDept !== 'all' || filterPriority !== 'all' || searchQuery.trim()

  const handleApprove = (id: string) => {
    approveMission(id)
    selectMission(null)
    toast.success('미션이 승인되었습니다.')
  }

  const handleReject = (id: string, feedback: string) => {
    rejectMission(id, feedback)
    selectMission(null)
    toast.error('미션이 반려되었습니다. 검토 단계로 돌아갑니다.')
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">미션 센터</h1>
          <p className="text-sm text-muted-foreground mt-1">
            전체 {wsMissions.length}건
            {isFiltered && ` (필터 적용: ${filteredMissions.length}건)`}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          새 미션
        </Button>
      </div>

      {/* 필터 바 */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="미션 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={filterDept} onValueChange={(v) => setFilterDept(v ?? 'all')}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="부서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 부서</SelectItem>
            {wsDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v ?? 'all')}>
          <SelectTrigger className="w-32 h-9">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 우선순위</SelectItem>
            {(['urgent', 'high', 'medium', 'low'] as MissionPriority[]).map((p) => (
              <SelectItem key={p} value={p}>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${MISSION_PRIORITY_COLORS[p].dot}`} />
                  {MISSION_PRIORITY_LABELS[p]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex border rounded-lg overflow-hidden ml-auto">
          <button
            onClick={() => setViewMode('board')}
            className={`p-2 transition-colors ${viewMode === 'board' ? 'bg-muted' : 'hover:bg-muted/50'}`}
            title="보드 뷰"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}`}
            title="리스트 뷰"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 콘텐츠 */}
      {filteredMissions.length > 0 ? (
        <div className="flex-1 overflow-hidden">
          {viewMode === 'board' ? (
            <KanbanBoard
              missions={filteredMissions}
              onMissionClick={(id) => selectMission(id)}
              onMissionMove={moveMission}
            />
          ) : (
            <MissionListView
              missions={filteredMissions}
              onMissionClick={(id) => selectMission(id)}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-lg font-medium text-foreground mb-2">
            {isFiltered ? '조건에 맞는 미션이 없습니다' : '아직 미션이 없습니다'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {isFiltered ? '필터를 변경하거나 새 미션을 만들어 보세요.' : '첫 미션을 만들어 AI 직원들에게 업무를 지시해 보세요.'}
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            {isFiltered ? '새 미션 만들기' : '첫 미션 만들기'}
          </Button>
        </div>
      )}

      <MissionDetailPanel
        mission={selectedMission}
        open={!!selectedMissionId}
        onClose={() => selectMission(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <CreateMissionForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        departments={wsDepartments}
        onCreate={(input) => addMission({ workspaceId, ...input })}
      />
    </div>
  )
}

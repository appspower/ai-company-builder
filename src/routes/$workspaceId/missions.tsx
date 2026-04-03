import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { KanbanBoard } from '@/features/missions/components/KanbanBoard'
import { MissionDetailPanel } from '@/features/missions/components/MissionDetailPanel'
import { CreateMissionForm } from '@/features/missions/components/CreateMissionForm'
import { useMissionStore } from '@/features/missions/store'
import { useAgentStore } from '@/features/agents/store'
import { toast } from 'sonner'

export const Route = createFileRoute('/$workspaceId/missions')({
  component: MissionsPage,
})

function MissionsPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/missions' })
  const [createOpen, setCreateOpen] = useState(false)
  const [filterDept, setFilterDept] = useState<string>('all')

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

  const filteredMissions = filterDept === 'all'
    ? wsMissions
    : wsMissions.filter((m) => m.departmentId === filterDept)

  const selectedMission = selectedMissionId
    ? wsMissions.find((m) => m.id === selectedMissionId) ?? null
    : null

  const handleApprove = (id: string) => {
    approveMission(id)
    selectMission(null)
    toast.success('미션이 승인되었습니다.')
  }

  const handleReject = (id: string) => {
    rejectMission(id)
    selectMission(null)
    toast.error('미션이 반려되었습니다. 검토 단계로 돌아갑니다.')
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* 헤더 + 필터 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">미션 센터</h1>
          <p className="text-sm text-muted-foreground mt-1">
            전체 {wsMissions.length}건의 미션을 관리합니다.
            {filterDept !== 'all' && (
              <span> (필터 적용: {filteredMissions.length}건)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterDept} onValueChange={(v) => setFilterDept(v ?? 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="부서 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 부서</SelectItem>
              {wsDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            새 미션
          </Button>
        </div>
      </div>

      {/* 칸반 보드 */}
      {filteredMissions.length > 0 ? (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            missions={filteredMissions}
            onMissionClick={(id) => selectMission(id)}
            onMissionMove={moveMission}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-lg font-medium text-foreground mb-2">
            {filterDept !== 'all' ? '이 부서에 해당하는 미션이 없습니다' : '아직 미션이 없습니다'}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {filterDept !== 'all' ? '필터를 변경하거나 새 미션을 만들어 보세요.' : '첫 미션을 만들어 AI 직원들에게 업무를 지시해 보세요.'}
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            {filterDept !== 'all' ? '새 미션 만들기' : '첫 미션 만들기'}
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

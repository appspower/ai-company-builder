import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { DepartmentList } from '@/features/agents/components/DepartmentList'
import { AgentGrid } from '@/features/agents/components/AgentGrid'
import { AgentInlineDetail } from '@/features/agents/components/AgentInlineDetail'
import { AgentDetailPanel } from '@/features/agents/components/AgentDetailPanel'
import { CreateAgentForm } from '@/features/agents/components/CreateAgentForm'
import { useAgentStore } from '@/features/agents/store'
import { toast } from 'sonner'

export const Route = createFileRoute('/$workspaceId/agents')({
  component: AgentsPage,
})

function AgentsPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/agents' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null)

  const {
    departments,
    agents,
    selectedDepartmentId,
    selectedAgentId,
    selectDepartment,
    selectAgent,
    addDepartment,
    addAgent,
    updateAgent,
    toggleEnabled,
    duplicateAgent,
    deleteAgent,
  } = useAgentStore()

  const wsDepartments = departments.filter((d) => d.workspaceId === workspaceId)
  const wsAgents = agents.filter((a) => a.workspaceId === workspaceId)

  const filteredAgents = selectedDepartmentId
    ? wsAgents.filter((a) => a.departmentId === selectedDepartmentId)
    : wsAgents

  const selectedAgent = selectedAgentId ? wsAgents.find((a) => a.id === selectedAgentId) ?? null : null
  const selectedAgentDept = selectedAgent
    ? wsDepartments.find((d) => d.id === selectedAgent.departmentId) ?? null
    : null

  const editingAgent = editingAgentId ? wsAgents.find((a) => a.id === editingAgentId) ?? null : null
  const editingAgentDept = editingAgent
    ? wsDepartments.find((d) => d.id === editingAgent.departmentId) ?? null
    : null

  const handleEdit = (agentId: string) => {
    setEditingAgentId(agentId)
  }

  const handleDuplicate = (agentId: string) => {
    duplicateAgent(agentId)
    const agent = wsAgents.find((a) => a.id === agentId)
    toast.success(`"${agent?.name}" 직원이 복제되었습니다.`)
  }

  const handleDelete = (agentId: string) => {
    const agent = wsAgents.find((a) => a.id === agentId)
    deleteAgent(agentId)
    toast.success(`"${agent?.name}" 직원이 삭제되었습니다.`)
  }

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* 부서 목록 */}
      <DepartmentList
        departments={wsDepartments}
        selectedId={selectedDepartmentId}
        onSelect={selectDepartment}
        onAdd={(name) => addDepartment(workspaceId, name)}
      />

      {/* 에이전트 그리드 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">조직 & 에이전트</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDepartmentId
                ? `${wsDepartments.find((d) => d.id === selectedDepartmentId)?.name} 소속 직원`
                : `전체 직원 ${wsAgents.length}명`
              }
            </p>
          </div>
        </div>

        {wsDepartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🏗️</div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              아직 만든 부서가 없습니다
            </h2>
            <p className="text-sm text-muted-foreground">
              왼쪽에서 + 버튼을 눌러 첫 번째 부서를 만들어 보세요.
            </p>
          </div>
        ) : (
          <AgentGrid
            agents={filteredAgents}
            onAgentClick={(id) => selectAgent(id)}
            onEditClick={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onAddClick={() => setCreateOpen(true)}
          />
        )}
      </div>

      {/* 인라인 상세 패널 (읽기 모드) — 딤 없이 옆에 나란히 */}
      {selectedAgent && (
        <AgentInlineDetail
          agent={selectedAgent}
          department={selectedAgentDept}
          onClose={() => selectAgent(null)}
          onEditClick={() => {
            setEditingAgentId(selectedAgent.id)
          }}
          onToggleEnabled={() => {
            toggleEnabled(selectedAgent.id)
            toast.success(selectedAgent.enabled ? '직원이 비활성화되었습니다.' : '직원이 활성화되었습니다.')
          }}
        />
      )}

      {/* 편집 모달 (Sheet — 편집 모드만) */}
      <AgentDetailPanel
        agent={editingAgent}
        department={editingAgentDept}
        departments={wsDepartments}
        open={!!editingAgentId}
        onClose={() => setEditingAgentId(null)}
        onUpdate={(id, updates) => {
          updateAgent(id, updates)
          setEditingAgentId(null)
          toast.success('직원 정보가 저장되었습니다.')
        }}
      />

      {/* 에이전트 생성 폼 */}
      <CreateAgentForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        departments={wsDepartments}
        defaultDepartmentId={selectedDepartmentId}
        onCreate={(input) => addAgent({ workspaceId, ...input })}
      />
    </div>
  )
}

import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { DepartmentList } from '@/features/agents/components/DepartmentList'
import { AgentGrid } from '@/features/agents/components/AgentGrid'
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

  const handleEdit = (agentId: string) => {
    selectAgent(agentId)
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
      <DepartmentList
        departments={wsDepartments}
        selectedId={selectedDepartmentId}
        onSelect={selectDepartment}
        onAdd={(name) => addDepartment(workspaceId, name)}
      />

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

      <AgentDetailPanel
        agent={selectedAgent}
        department={selectedAgentDept}
        departments={wsDepartments}
        open={!!selectedAgentId}
        onClose={() => selectAgent(null)}
        onUpdate={updateAgent}
      />

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

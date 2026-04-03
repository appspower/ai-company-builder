import { createFileRoute, useParams } from '@tanstack/react-router'
import { ApprovalQueue } from '@/features/dashboard/components/ApprovalQueue'
import { MissionSummary } from '@/features/dashboard/components/MissionSummary'
import { AgentActivity } from '@/features/dashboard/components/AgentActivity'
import { RecentArtifacts } from '@/features/dashboard/components/RecentArtifacts'
import { mockAgents } from '@/mocks/agents'
import { mockArtifacts } from '@/mocks/artifacts'
import { useWorkspaceStore } from '@/features/workspace-lobby/store'
import { useMissionStore } from '@/features/missions/store'
import { toast } from 'sonner'

export const Route = createFileRoute('/$workspaceId/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/' })
  const { workspaces } = useWorkspaceStore()
  const { missions, approveMission, rejectMission } = useMissionStore()
  const workspace = workspaces.find((ws) => ws.id === workspaceId)

  const wsMissions = missions.filter((m) => m.workspaceId === workspaceId)
  const agents = mockAgents.filter((a) => a.workspaceId === workspaceId)
  const artifacts = mockArtifacts.filter((a) => a.workspaceId === workspaceId)

  const handleApprove = (id: string) => {
    approveMission(id)
    toast.success('미션이 승인되었습니다.')
  }

  const handleReject = (id: string) => {
    rejectMission(id, '')
    toast.error('미션이 반려되었습니다.')
  }

  if (!workspace) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">회사를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const hasData = agents.length > 0 || wsMissions.length > 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">홈</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {workspace.icon} {workspace.name}의 현황을 한눈에 확인하세요.
        </p>
      </div>

      {hasData ? (
        <div className="space-y-6">
          {/* 결재함 — 최상단, 가장 눈에 띄게 */}
          <ApprovalQueue missions={wsMissions} agents={agents} onApprove={handleApprove} onReject={handleReject} />

          {/* 미션 현황 & 에이전트 현황 — 나란히 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MissionSummary missions={wsMissions} />
            <AgentActivity agents={agents} />
          </div>

          {/* 최근 산출물 */}
          <RecentArtifacts artifacts={artifacts} agents={agents} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-lg font-medium text-foreground mb-2">
            아직 세팅된 부서와 직원이 없습니다
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            부서와 AI 직원을 먼저 배치해 보세요.
          </p>
        </div>
      )}
    </div>
  )
}

import { createFileRoute, useParams } from '@tanstack/react-router'
import { ArtifactList } from '@/features/artifacts/components/ArtifactList'
import { ArtifactDetailPanel } from '@/features/artifacts/components/ArtifactDetailPanel'
import { useArtifactStore } from '@/features/artifacts/store'
import { mockArtifacts } from '@/mocks/artifacts'
import { mockAgents } from '@/mocks/agents'

export const Route = createFileRoute('/$workspaceId/artifacts')({
  component: ArtifactsPage,
})

function ArtifactsPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/artifacts' })

  const {
    selectedArtifactId,
    viewMode,
    searchQuery,
    filterFileType,
    filterStatus,
    filterAgentId,
    selectArtifact,
    setViewMode,
    setSearchQuery,
    setFilterFileType,
    setFilterStatus,
    setFilterAgent,
  } = useArtifactStore()

  const wsArtifacts = mockArtifacts.filter((a) => a.workspaceId === workspaceId)
  const wsAgents = mockAgents.filter((a) => a.workspaceId === workspaceId)
  const selectedArtifact = selectedArtifactId
    ? wsArtifacts.find((a) => a.id === selectedArtifactId) ?? null
    : null

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">산출물 보관함</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI 직원이 만든 결과물 {wsArtifacts.length}건을 관리합니다.
        </p>
      </div>

      <ArtifactList
        artifacts={wsArtifacts}
        agents={wsAgents}
        viewMode={viewMode}
        searchQuery={searchQuery}
        filterFileType={filterFileType}
        filterStatus={filterStatus}
        filterAgentId={filterAgentId}
        onSearch={setSearchQuery}
        onFilterFileType={setFilterFileType}
        onFilterStatus={setFilterStatus}
        onFilterAgent={setFilterAgent}
        onViewMode={setViewMode}
        onArtifactClick={(id) => selectArtifact(id)}
      />

      <ArtifactDetailPanel
        artifact={selectedArtifact}
        open={!!selectedArtifactId}
        onClose={() => selectArtifact(null)}
      />
    </div>
  )
}

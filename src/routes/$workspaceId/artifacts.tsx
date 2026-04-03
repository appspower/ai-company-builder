import { createFileRoute, useParams } from '@tanstack/react-router'
import { ArtifactList } from '@/features/artifacts/components/ArtifactList'
import { ArtifactInlineDetail } from '@/features/artifacts/components/ArtifactInlineDetail'
import { useArtifactStore } from '@/features/artifacts/store'
import { mockAgents } from '@/mocks/agents'
import { toast } from 'sonner'

export const Route = createFileRoute('/$workspaceId/artifacts')({
  component: ArtifactsPage,
})

function ArtifactsPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/artifacts' })

  const {
    artifacts,
    selectedArtifactId,
    viewMode,
    searchQuery,
    filterFileType,
    filterStatus,
    filterAgentId,
    filterMissionId,
    sortBy,
    groupBy,
    activeQuickFilters,
    selectArtifact,
    setViewMode,
    setSearchQuery,
    setFilterFileType,
    setFilterStatus,
    setFilterAgent,
    setFilterMission,
    setSortBy,
    setGroupBy,
    toggleQuickFilter,
    toggleStarred,
  } = useArtifactStore()

  const wsArtifacts = artifacts.filter((a) => a.workspaceId === workspaceId)
  const wsAgents = mockAgents.filter((a) => a.workspaceId === workspaceId)
  const selectedArtifact = selectedArtifactId
    ? wsArtifacts.find((a) => a.id === selectedArtifactId) ?? null
    : null

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
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
          filterMissionId={filterMissionId}
          sortBy={sortBy}
          groupBy={groupBy}
          activeQuickFilters={activeQuickFilters}
          onSearch={setSearchQuery}
          onFilterFileType={setFilterFileType}
          onFilterStatus={setFilterStatus}
          onFilterAgent={setFilterAgent}
          onFilterMission={setFilterMission}
          onSortBy={setSortBy}
          onGroupBy={setGroupBy}
          onToggleQuickFilter={toggleQuickFilter}
          onViewMode={setViewMode}
          onArtifactClick={(id) => selectArtifact(id)}
          onToggleStarred={(id) => {
            toggleStarred(id)
            const art = wsArtifacts.find((a) => a.id === id)
            toast.success(art?.starred ? '즐겨찾기에서 제거했습니다.' : '즐겨찾기에 추가했습니다.')
          }}
        />
      </div>

      {/* 인라인 상세 패널 */}
      {selectedArtifact && (
        <ArtifactInlineDetail
          artifact={selectedArtifact}
          onClose={() => selectArtifact(null)}
          onToggleStarred={() => {
            toggleStarred(selectedArtifact.id)
            toast.success(selectedArtifact.starred ? '즐겨찾기에서 제거했습니다.' : '즐겨찾기에 추가했습니다.')
          }}
        />
      )}
    </div>
  )
}

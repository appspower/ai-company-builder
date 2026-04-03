import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { WorkspaceGrid } from '@/features/workspace-lobby/components/WorkspaceGrid'
import { CreateWorkspaceDialog } from '@/features/workspace-lobby/components/CreateWorkspaceDialog'
import { useWorkspaceStore } from '@/features/workspace-lobby/store'

export const Route = createFileRoute('/')({
  component: WorkspaceLobbyPage,
})

function WorkspaceLobbyPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { workspaces, addWorkspace } = useWorkspaceStore()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          AI Company Builder
        </h1>
        <p className="text-muted-foreground mb-8">
          운영 중인 회사를 선택하거나, 새 회사를 만들어 보세요.
        </p>

        {workspaces.length > 0 ? (
          <WorkspaceGrid
            workspaces={workspaces}
            onCreateClick={() => setCreateOpen(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🏗️</div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              아직 만든 회사가 없습니다
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              첫 번째 AI 회사를 만들어 보세요. 5분이면 충분합니다.
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              첫 번째 회사 만들기
            </button>
          </div>
        )}

        <CreateWorkspaceDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreate={addWorkspace}
        />
      </div>
    </div>
  )
}

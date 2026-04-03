import { createFileRoute, useParams, Link } from '@tanstack/react-router'
import { PageShell } from '@/components/layout/PageShell'
import { useWorkspaceStore } from '@/features/workspace-lobby/store'

export const Route = createFileRoute('/$workspaceId')({
  component: WorkspaceLayout,
})

function WorkspaceLayout() {
  const { workspaceId } = useParams({ from: '/$workspaceId' })
  const { workspaces } = useWorkspaceStore()
  const exists = workspaces.some((ws) => ws.id === workspaceId)

  if (!exists) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-semibold mb-2">회사를 찾을 수 없습니다</h1>
        <p className="text-sm text-muted-foreground mb-6">
          존재하지 않거나 삭제된 회사입니다.
        </p>
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          로비로 돌아가기
        </Link>
      </div>
    )
  }

  return <PageShell />
}

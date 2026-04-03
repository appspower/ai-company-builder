import { create } from 'zustand'
import type { Workspace } from '@/types/workspace'
import { mockWorkspaces } from '@/mocks/workspaces'

interface WorkspaceStore {
  workspaces: Workspace[]
  addWorkspace: (ws: { name: string; description: string; icon: string }) => void
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: mockWorkspaces,
  addWorkspace: (input) =>
    set((state) => ({
      workspaces: [
        ...state.workspaces,
        {
          id: `ws-${Date.now()}`,
          name: input.name,
          description: input.description,
          icon: input.icon,
          agentCount: 0,
          activeMissionCount: 0,
          pendingApprovalCount: 0,
          lastActivityAt: '방금 전',
        },
      ],
    })),
}))

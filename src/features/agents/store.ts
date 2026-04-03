import { create } from 'zustand'
import type { Department, Agent, LlmModel } from '@/types/agent'
import { mockDepartments } from '@/mocks/departments'
import { mockAgents } from '@/mocks/agents'

interface AgentStore {
  departments: Department[]
  agents: Agent[]
  selectedDepartmentId: string | null
  selectedAgentId: string | null

  selectDepartment: (id: string | null) => void
  selectAgent: (id: string | null) => void
  addDepartment: (workspaceId: string, name: string) => void
  addAgent: (input: {
    workspaceId: string
    departmentId: string
    name: string
    role: string
    instructions: string
    llmModel: LlmModel
  }) => void
  updateAgent: (id: string, updates: Partial<Agent>) => void
  toggleEnabled: (id: string) => void
  duplicateAgent: (id: string) => void
  deleteAgent: (id: string) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  departments: mockDepartments,
  agents: mockAgents,
  selectedDepartmentId: null,
  selectedAgentId: null,

  selectDepartment: (id) => set({ selectedDepartmentId: id, selectedAgentId: null }),
  selectAgent: (id) => set({ selectedAgentId: id }),

  addDepartment: (workspaceId, name) =>
    set((state) => ({
      departments: [
        ...state.departments,
        {
          id: `dept-${Date.now()}`,
          workspaceId,
          name,
          agentCount: 0,
        },
      ],
    })),

  addAgent: (input) =>
    set((state) => ({
      agents: [
        ...state.agents,
        {
          id: `agent-${Date.now()}`,
          ...input,
          knowledgeDocs: [],
          skills: [],
          enabled: true,
          status: 'idle',
          statusMessage: null,
          lastActivityAt: '방금 전',
          recentMissionIds: [],
        },
      ],
      departments: state.departments.map((d) =>
        d.id === input.departmentId ? { ...d, agentCount: d.agentCount + 1 } : d
      ),
    })),

  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  toggleEnabled: (id) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled, status: !a.enabled ? 'idle' : a.status } : a
      ),
    })),

  duplicateAgent: (id) =>
    set((state) => {
      const original = state.agents.find((a) => a.id === id)
      if (!original) return state
      const newAgent: Agent = {
        ...original,
        id: `agent-${Date.now()}`,
        name: `${original.name} (복사)`,
        knowledgeDocs: [...original.knowledgeDocs],
        status: 'idle',
        statusMessage: null,
        lastActivityAt: '방금 전',
        recentMissionIds: [],
      }
      return {
        agents: [...state.agents, newAgent],
        departments: state.departments.map((d) =>
          d.id === original.departmentId ? { ...d, agentCount: d.agentCount + 1 } : d
        ),
      }
    }),

  deleteAgent: (id) =>
    set((state) => {
      const agent = state.agents.find((a) => a.id === id)
      if (!agent) return state
      return {
        agents: state.agents.filter((a) => a.id !== id),
        selectedAgentId: state.selectedAgentId === id ? null : state.selectedAgentId,
        departments: state.departments.map((d) =>
          d.id === agent.departmentId ? { ...d, agentCount: Math.max(0, d.agentCount - 1) } : d
        ),
      }
    }),
}))

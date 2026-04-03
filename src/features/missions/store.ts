import { create } from 'zustand'
import type { Mission, MissionStatus, MissionPriority, ApprovalMode } from '@/types/mission'
import { mockMissions } from '@/mocks/missions'

interface MissionStore {
  missions: Mission[]
  selectedMissionId: string | null

  selectMission: (id: string | null) => void
  moveMission: (missionId: string, newStatus: MissionStatus) => void
  approveMission: (missionId: string) => void
  rejectMission: (missionId: string, feedback: string) => void
  addMission: (input: {
    workspaceId: string
    title: string
    description: string
    departmentId: string
    priority: MissionPriority
    dueDate: string | null
    approvalMode: ApprovalMode
  }) => void
}

export const useMissionStore = create<MissionStore>((set) => ({
  missions: mockMissions,
  selectedMissionId: null,

  selectMission: (id) => set({ selectedMissionId: id }),

  moveMission: (missionId, newStatus) =>
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId ? { ...m, status: newStatus } : m
      ),
    })),

  approveMission: (missionId) =>
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId
          ? {
              ...m,
              status: 'completed' as MissionStatus,
              completedAt: '방금 전',
              rejectionFeedback: null,
              steps: m.steps.map((s) => ({ ...s, status: 'completed' as const, progress: 100 })),
            }
          : m
      ),
    })),

  rejectMission: (missionId, feedback) =>
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId
          ? { ...m, status: 'review' as MissionStatus, rejectionFeedback: feedback || null }
          : m
      ),
    })),

  addMission: (input) =>
    set((state) => ({
      missions: [
        {
          id: `m-${Date.now()}`,
          ...input,
          assignedAgentIds: [],
          status: 'backlog' as MissionStatus,
          progress: null,
          progressLabel: null,
          createdAt: '방금 전',
          completedAt: null,
          artifactCount: 0,
          rejectionFeedback: null,
          steps: [],
        },
        ...state.missions,
      ],
    })),
}))

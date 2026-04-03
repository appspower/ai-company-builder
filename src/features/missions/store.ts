import { create } from 'zustand'
import type { Mission, MissionStatus } from '@/types/mission'
import { mockMissions } from '@/mocks/missions'

interface MissionStore {
  missions: Mission[]
  selectedMissionId: string | null

  selectMission: (id: string | null) => void
  moveMission: (missionId: string, newStatus: MissionStatus) => void
  approveMission: (missionId: string) => void
  rejectMission: (missionId: string) => void
  addMission: (input: {
    workspaceId: string
    title: string
    description: string
    departmentId: string
    requiresApproval: boolean
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
              steps: m.steps.map((s) => ({ ...s, status: 'completed' as const, progress: 100 })),
            }
          : m
      ),
    })),

  rejectMission: (missionId) =>
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === missionId
          ? { ...m, status: 'review' as MissionStatus }
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
          artifactCount: 0,
          steps: [],
        },
        ...state.missions,
      ],
    })),
}))

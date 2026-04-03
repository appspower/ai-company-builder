import { create } from 'zustand'
import type { Artifact, FileType, ArtifactStatus } from '@/types/artifact'
import { mockArtifacts } from '@/mocks/artifacts'

export type ArtifactSortBy = 'name' | 'date' | 'status' | 'version'

interface ArtifactStore {
  artifacts: Artifact[]
  selectedArtifactId: string | null
  viewMode: 'list' | 'grid'
  searchQuery: string
  filterFileType: FileType | 'all'
  filterStatus: ArtifactStatus | 'all'
  filterAgentId: string
  filterMissionId: string
  sortBy: ArtifactSortBy
  activeQuickFilters: Set<string>

  selectArtifact: (id: string | null) => void
  setViewMode: (mode: 'list' | 'grid') => void
  setSearchQuery: (query: string) => void
  setFilterFileType: (type: FileType | 'all') => void
  setFilterStatus: (status: ArtifactStatus | 'all') => void
  setFilterAgent: (id: string) => void
  setFilterMission: (id: string) => void
  setSortBy: (sort: ArtifactSortBy) => void
  toggleQuickFilter: (id: string) => void
  toggleStarred: (id: string) => void
}

export const useArtifactStore = create<ArtifactStore>((set) => ({
  artifacts: mockArtifacts,
  selectedArtifactId: null,
  viewMode: 'list',
  searchQuery: '',
  filterFileType: 'all',
  filterStatus: 'all',
  filterAgentId: 'all',
  filterMissionId: 'all',
  sortBy: 'date',
  activeQuickFilters: new Set(),

  selectArtifact: (id) => set({ selectedArtifactId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterFileType: (type) => set({ filterFileType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterAgent: (id) => set({ filterAgentId: id }),
  setFilterMission: (id) => set({ filterMissionId: id }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleQuickFilter: (id) =>
    set((state) => {
      const next = new Set(state.activeQuickFilters)
      if (next.has(id)) next.delete(id); else next.add(id)
      return { activeQuickFilters: next }
    }),
  toggleStarred: (id) =>
    set((state) => ({
      artifacts: state.artifacts.map((a) =>
        a.id === id ? { ...a, starred: !a.starred } : a
      ),
    })),
}))

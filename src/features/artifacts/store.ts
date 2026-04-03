import { create } from 'zustand'
import type { FileType, ArtifactStatus } from '@/types/artifact'

interface ArtifactStore {
  selectedArtifactId: string | null
  viewMode: 'list' | 'grid'
  searchQuery: string
  filterFileType: FileType | 'all'
  filterStatus: ArtifactStatus | 'all'
  filterAgentId: string

  selectArtifact: (id: string | null) => void
  setViewMode: (mode: 'list' | 'grid') => void
  setSearchQuery: (query: string) => void
  setFilterFileType: (type: FileType | 'all') => void
  setFilterStatus: (status: ArtifactStatus | 'all') => void
  setFilterAgent: (id: string) => void
}

export const useArtifactStore = create<ArtifactStore>((set) => ({
  selectedArtifactId: null,
  viewMode: 'list',
  searchQuery: '',
  filterFileType: 'all',
  filterStatus: 'all',
  filterAgentId: 'all',

  selectArtifact: (id) => set({ selectedArtifactId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterFileType: (type) => set({ filterFileType: type }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterAgent: (id) => set({ filterAgentId: id }),
}))

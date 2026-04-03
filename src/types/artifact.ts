export type FileType = 'document' | 'image' | 'video' | 'spreadsheet' | 'data'
export type ArtifactStatus = 'approval_pending' | 'review' | 'completed' | 'published'

export interface Artifact {
  id: string
  workspaceId: string
  missionId: string
  agentId: string
  fileName: string
  fileType: FileType
  version: number
  status: ArtifactStatus
  createdAt: string
  metadata: {
    llmModel: string
    tokensUsed?: number
    dimensions?: string
    duration?: string
    wordCount?: number
  }
}

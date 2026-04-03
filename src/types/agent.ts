export type LlmModel = 'claude-opus' | 'claude-sonnet' | 'claude-haiku' | 'gemini-flash-image'
export type AgentStatus = 'active' | 'idle' | 'warning' | 'error'

export interface Department {
  id: string
  workspaceId: string
  name: string
  agentCount: number
}

export type KnowledgeDocStatus = 'ready' | 'processing' | 'error'

export interface KnowledgeDoc {
  id: string
  fileName: string
  fileType: string
  fileSize: string
  status: KnowledgeDocStatus
  uploadedAt: string
}

export interface Agent {
  id: string
  workspaceId: string
  departmentId: string
  name: string
  role: string
  instructions: string
  llmModel: LlmModel
  knowledgeDocs: KnowledgeDoc[]
  status: AgentStatus
  statusMessage: string | null
  lastActivityAt: string
  recentMissionIds: string[]
}

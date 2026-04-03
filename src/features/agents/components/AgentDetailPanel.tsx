import { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Pencil, X, Check, FileText, Upload, Trash2 } from 'lucide-react'
import type { Agent, Department, LlmModel, KnowledgeDoc } from '@/types/agent'
import { AGENT_STATUS_COLORS, AGENT_STATUS_LABELS, LLM_MODEL_LABELS } from '@/lib/constants'
import { AGENT_INSTRUCTIONS_TEMPLATE } from '@/lib/templates'
import { mockMissions } from '@/mocks/missions'

const MODEL_OPTIONS: LlmModel[] = ['claude-opus', 'claude-sonnet', 'claude-haiku', 'gemini-flash-image']

const FILE_ICONS: Record<string, string> = {
  pdf: '📕', xlsx: '📊', csv: '📋', md: '📝', doc: '📄', docx: '📄', txt: '📄',
}

const DOC_STATUS_STYLES: Record<string, { label: string; color: string }> = {
  ready: { label: 'Ready', color: 'bg-green-500' },
  processing: { label: 'Processing', color: 'bg-amber-500' },
  error: { label: 'Error', color: 'bg-red-500' },
}

interface AgentDetailPanelProps {
  agent: Agent | null
  department: Department | null
  departments: Department[]
  open: boolean
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Agent>) => void
}

export function AgentDetailPanel({ agent, department, departments, open, onClose, onUpdate }: AgentDetailPanelProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState<'info' | 'instructions' | 'knowledge'>('info')

  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editInstructions, setEditInstructions] = useState('')
  const [editLlmModel, setEditLlmModel] = useState<LlmModel>('claude-sonnet')
  const [editDeptId, setEditDeptId] = useState('')

  useEffect(() => {
    if (agent) {
      setEditName(agent.name)
      setEditRole(agent.role)
      setEditInstructions(agent.instructions)
      setEditLlmModel(agent.llmModel)
      setEditDeptId(agent.departmentId)
    }
    setIsEditing(false)
    setActiveSection('info')
  }, [agent])

  if (!agent) return null

  const statusColors = AGENT_STATUS_COLORS[agent.status]
  const recentMissions = agent.recentMissionIds
    .map((mId) => mockMissions.find((m) => m.id === mId))
    .filter(Boolean)

  const handleSave = () => {
    onUpdate(agent.id, {
      name: editName.trim(),
      role: editRole.trim(),
      instructions: editInstructions.trim(),
      llmModel: editLlmModel,
      departmentId: editDeptId,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(agent.name)
    setEditRole(agent.role)
    setEditInstructions(agent.instructions)
    setEditLlmModel(agent.llmModel)
    setEditDeptId(agent.departmentId)
    setIsEditing(false)
  }

  const handleGoToMissions = () => {
    onClose()
    navigate({ to: `/${workspaceId}/missions` })
  }

  const sectionTabs = [
    { id: 'info' as const, label: '기본 정보' },
    { id: 'instructions' as const, label: '업무 지침' },
    { id: 'knowledge' as const, label: `참고 자료 (${agent.knowledgeDocs.length})` },
  ]

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto p-0">
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-4">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${statusColors.dot}`} />
                <SheetTitle className="text-lg">{agent.name}</SheetTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {LLM_MODEL_LABELS[agent.llmModel]}
                </Badge>
              </div>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 px-2">
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  편집
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 px-2">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" onClick={handleSave} className="h-8 px-2">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    저장
                  </Button>
                </div>
              )}
            </div>
          </SheetHeader>
          <p className="text-sm text-muted-foreground mt-1">{agent.role}</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b px-6">
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                activeSection === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="px-6 py-5">
          {/* ===== 기본 정보 탭 ===== */}
          {activeSection === 'info' && (
            <div className="space-y-5">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">이름</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-9" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">역할</label>
                    <Input value={editRole} onChange={(e) => setEditRole(e.target.value)} className="h-9" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">소속 부서</label>
                    <Select value={editDeptId} onValueChange={(v) => setEditDeptId(v ?? editDeptId)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">AI 엔진</label>
                    <Select value={editLlmModel} onValueChange={(v) => setEditLlmModel((v ?? editLlmModel) as LlmModel)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {MODEL_OPTIONS.map((model) => (
                          <SelectItem key={model} value={model}>{LLM_MODEL_LABELS[model]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">소속 부서</label>
                      <p className="text-sm mt-0.5 font-medium">{department?.name ?? '미지정'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">AI 엔진</label>
                      <p className="text-sm mt-0.5">
                        <Badge variant="secondary" className="font-mono">{LLM_MODEL_LABELS[agent.llmModel]}</Badge>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">상태</label>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
                        <span className="text-sm">{AGENT_STATUS_LABELS[agent.status]}</span>
                        {agent.statusMessage && (
                          <span className="text-xs text-muted-foreground">— {agent.statusMessage}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">마지막 활동</label>
                      <p className="text-sm mt-0.5">{agent.lastActivityAt}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">최근 미션</h4>
                    {recentMissions.length > 0 ? (
                      <div className="space-y-1.5">
                        {recentMissions.map((mission) => mission && (
                          <button
                            key={mission.id}
                            onClick={handleGoToMissions}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate">{mission.title}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">최근 수행한 미션이 없습니다.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== 업무 지침 탭 ===== */}
          {activeSection === 'instructions' && (
            <div>
              {isEditing ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-muted-foreground">업무 지침 (마크다운)</label>
                    {!editInstructions.trim() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setEditInstructions(AGENT_INSTRUCTIONS_TEMPLATE)}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        템플릿 삽입
                      </Button>
                    )}
                  </div>
                  <textarea
                    value={editInstructions}
                    onChange={(e) => setEditInstructions(e.target.value)}
                    rows={18}
                    className="w-full rounded-lg border bg-background px-4 py-3 text-sm font-mono leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                    placeholder="이 직원의 업무 프로세스, 규칙, 출력 형식을 정의하세요..."
                  />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {agent.instructions ? (
                    <div className="rounded-lg border bg-muted/30 p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                      {agent.instructions}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">업무 지침이 아직 없습니다.</p>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        업무 지침 작성하기
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===== 참고 자료 탭 ===== */}
          {activeSection === 'knowledge' && (
            <div>
              {agent.knowledgeDocs.length > 0 ? (
                <div className="space-y-2">
                  {agent.knowledgeDocs.map((doc) => (
                    <KnowledgeDocRow key={doc.id} doc={doc} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">참고 자료가 없습니다.</p>
                  <p className="text-xs text-muted-foreground">업무 매뉴얼, 브랜드 가이드, 데이터 파일 등을 추가하세요.</p>
                </div>
              )}

              {/* 업로드 영역 */}
              <div className="mt-4 rounded-lg border-2 border-dashed p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, CSV, MD, TXT 지원</p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function KnowledgeDocRow({ doc }: { doc: KnowledgeDoc }) {
  const icon = FILE_ICONS[doc.fileType] ?? '📄'
  const statusStyle = DOC_STATUS_STYLES[doc.status]

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors group">
      <span className="text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{doc.fileName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{doc.fileSize}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{doc.uploadedAt}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.color}`} />
          <span className="text-[10px] text-muted-foreground">{statusStyle.label}</span>
        </div>
        <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all">
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </button>
      </div>
    </div>
  )
}

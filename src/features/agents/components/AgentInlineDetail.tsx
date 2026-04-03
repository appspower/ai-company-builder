import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Pencil, X, FileText, Upload, Trash2, Loader2, MessageSquare, Power } from 'lucide-react'
import type { Agent, Department, KnowledgeDoc } from '@/types/agent'
import { toast } from 'sonner'
import { AGENT_STATUS_COLORS, AGENT_STATUS_LABELS, LLM_MODEL_LABELS } from '@/lib/constants'
import { mockMissions } from '@/mocks/missions'
import type { Mission } from '@/types/mission'

const FILE_ICONS: Record<string, string> = {
  pdf: '📕', xlsx: '📊', csv: '📋', md: '📝', doc: '📄', docx: '📄', txt: '📄',
}

const DOC_STATUS_STYLES: Record<string, { label: string; color: string }> = {
  ready: { label: 'Ready', color: 'bg-green-500' },
  processing: { label: 'Processing', color: 'bg-amber-500' },
  error: { label: 'Error', color: 'bg-red-500' },
}

interface AgentInlineDetailProps {
  agent: Agent
  department: Department | null
  onClose: () => void
  onEditClick: () => void
  onToggleEnabled: () => void
}

export function AgentInlineDetail({ agent, department, onClose, onEditClick, onToggleEnabled }: AgentInlineDetailProps) {
  const navigate = useNavigate()
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }
  const [activeSection, setActiveSection] = useState<'info' | 'instructions' | 'skills' | 'knowledge'>('info')

  const statusColors = AGENT_STATUS_COLORS[agent.status]

  // 진행 중인 미션
  const activeMissions = mockMissions.filter(
    (m) => m.assignedAgentIds.includes(agent.id) && (m.status === 'in_progress' || m.status === 'review')
  )

  // 최근 완료 미션
  const recentMissions = agent.recentMissionIds
    .map((mId) => mockMissions.find((m) => m.id === mId))
    .filter(Boolean) as Mission[]

  const handleGoToMissions = () => {
    navigate({ to: `/${workspaceId}/missions` })
  }

  const sectionTabs = [
    { id: 'info' as const, label: '기본 정보' },
    { id: 'instructions' as const, label: '업무 지침' },
    { id: 'skills' as const, label: `도구 (${agent.skills.length})` },
    { id: 'knowledge' as const, label: `자료 (${agent.knowledgeDocs.length})` },
  ]

  return (
    <div className="w-[400px] shrink-0 border-l bg-card overflow-y-auto h-full">
      {/* 헤더 */}
      <div className="px-5 pt-5 pb-3 sticky top-0 bg-card z-10 border-b">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusColors.dot}`} />
            <h2 className="text-base font-semibold truncate">{agent.name}</h2>
            <Badge variant="outline" className="text-[10px] font-mono shrink-0">
              {LLM_MODEL_LABELS[agent.llmModel]}
            </Badge>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm" onClick={onEditClick} className="h-7 px-2 text-xs">
              <Pencil className="w-3 h-3 mr-1" />
              편집
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{agent.role}</p>

        {/* 액션 바: 활성 토글 + 테스트 대화 */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={onToggleEnabled}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              agent.enabled
                ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Power className="w-3 h-3" />
            {agent.enabled ? '활성' : '비활성'}
          </button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => toast.info('테스트 대화는 Phase 2에서 연동됩니다.')}
          >
            <MessageSquare className="w-3 h-3" />
            테스트 대화
          </Button>
        </div>

        {/* 탭 */}
        <div className="flex mt-3 -mb-[1px]">
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeSection === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="px-5 py-4">
        {/* ===== 기본 정보 ===== */}
        {activeSection === 'info' && (
          <div className="space-y-4">
            {/* 현재 진행 작업 */}
            {activeMissions.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">현재 진행 작업</h4>
                <div className="space-y-2">
                  {activeMissions.map((mission) => {
                    const step = mission.steps.find(
                      (s) => s.agentId === agent.id && s.status === 'in_progress'
                    )
                    return (
                      <button
                        key={mission.id}
                        onClick={handleGoToMissions}
                        className="w-full text-left p-3 rounded-lg border border-blue-500/20 bg-blue-500/[0.03] hover:bg-blue-500/[0.06] transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
                          <span className="text-sm font-medium truncate">{mission.title}</span>
                        </div>
                        {step && (
                          <div className="ml-5.5">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>{step.name}</span>
                              {step.progress !== null && <span className="text-blue-500">{step.progress}%</span>}
                            </div>
                            {step.progress !== null && (
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full transition-all"
                                  style={{ width: `${step.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 기본 메타 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">소속 부서</label>
                <p className="text-sm mt-0.5 font-medium">{department?.name ?? '미지정'}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">AI 엔진</label>
                <p className="text-sm mt-0.5">
                  <Badge variant="secondary" className="font-mono text-[10px]">{LLM_MODEL_LABELS[agent.llmModel]}</Badge>
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">상태</label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${statusColors.dot}`} />
                  <span className="text-sm">{AGENT_STATUS_LABELS[agent.status]}</span>
                </div>
                {agent.statusMessage && (
                  <span className="text-xs text-amber-500">{agent.statusMessage}</span>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground">마지막 활동</label>
                <p className="text-sm mt-0.5">{agent.lastActivityAt}</p>
              </div>
            </div>

            {/* 최근 미션 */}
            {recentMissions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">최근 미션</h4>
                  <div className="space-y-1">
                    {recentMissions.map((mission) => (
                      <button
                        key={mission.id}
                        onClick={handleGoToMissions}
                        className="flex items-center gap-2 w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                      >
                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="truncate">{mission.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ===== 업무 지침 ===== */}
        {activeSection === 'instructions' && (
          <div>
            {agent.instructions ? (
              <div className="rounded-lg border bg-muted/20 p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                {agent.instructions}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">업무 지침이 아직 없습니다.</p>
                <Button variant="outline" size="sm" onClick={onEditClick}>
                  업무 지침 작성하기
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ===== 도구/스킬 ===== */}
        {activeSection === 'skills' && (
          <div>
            {agent.skills.length > 0 ? (
              <div className="space-y-2">
                {agent.skills.map((skill) => (
                  <div key={skill.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <span className="text-lg shrink-0 mt-0.5">{skill.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{skill.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">할당된 도구가 없습니다.</p>
                <p className="text-xs text-muted-foreground mt-1">Phase 2에서 도구를 추가할 수 있습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== 참고 자료 ===== */}
        {activeSection === 'knowledge' && (
          <div>
            {agent.knowledgeDocs.length > 0 ? (
              <div className="space-y-2">
                {agent.knowledgeDocs.map((doc) => (
                  <KnowledgeDocRow key={doc.id} doc={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">참고 자료가 없습니다.</p>
                <p className="text-xs text-muted-foreground">업무 매뉴얼, 가이드 등을 추가하세요.</p>
              </div>
            )}
            <div className="mt-3 rounded-lg border-2 border-dashed p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">파일 업로드</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function KnowledgeDocRow({ doc }: { doc: KnowledgeDoc }) {
  const icon = FILE_ICONS[doc.fileType] ?? '📄'
  const statusStyle = DOC_STATUS_STYLES[doc.status]

  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors group">
      <span className="text-base shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{doc.fileName}</p>
        <p className="text-[11px] text-muted-foreground">{doc.fileSize} · {doc.uploadedAt}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.color}`} />
        <button className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all">
          <Trash2 className="w-3 h-3 text-destructive" />
        </button>
      </div>
    </div>
  )
}

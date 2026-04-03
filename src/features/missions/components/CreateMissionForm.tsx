import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Department } from '@/types/agent'
import type { MissionPriority, ApprovalMode } from '@/types/mission'
import { MISSION_PRIORITY_LABELS, MISSION_PRIORITY_COLORS, APPROVAL_MODE_LABELS, APPROVAL_MODE_COLORS } from '@/lib/constants'

interface CreateMissionFormProps {
  open: boolean
  onClose: () => void
  departments: Department[]
  onCreate: (input: {
    title: string
    description: string
    departmentId: string
    priority: MissionPriority
    dueDate: string | null
    approvalMode: ApprovalMode
  }) => void
}

const PRIORITY_OPTIONS: MissionPriority[] = ['urgent', 'high', 'medium', 'low']
const APPROVAL_OPTIONS: { mode: ApprovalMode; desc: string }[] = [
  { mode: 'auto', desc: '에이전트가 끝까지 자동 진행' },
  { mode: 'final_only', desc: '마지막 단계에서만 CEO 승인' },
  { mode: 'step_by_step', desc: '각 단계마다 CEO 승인 필요' },
]

export function CreateMissionForm({ open, onClose, departments, onCreate }: CreateMissionFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [priority, setPriority] = useState<MissionPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('final_only')

  const handleCreate = () => {
    if (!title.trim() || !departmentId) return
    onCreate({
      title: title.trim(),
      description: description.trim(),
      departmentId,
      priority,
      dueDate: dueDate || null,
      approvalMode,
    })
    setTitle(''); setDescription(''); setDepartmentId(''); setPriority('medium'); setDueDate(''); setApprovalMode('final_only')
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[440px] sm:max-w-[440px] overflow-y-auto">
        <SheetHeader><SheetTitle>새 미션 생성</SheetTitle></SheetHeader>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">미션 제목</label>
            <Input placeholder="예: 봄맞이 다이어트 숏폼 제작" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreate()} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">설명 <span className="text-muted-foreground font-normal">(선택)</span></label>
            <textarea placeholder="미션 내용을 상세히 적어주세요" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">담당 부서</label>
              <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? '')}><SelectTrigger><SelectValue placeholder="부서 선택" /></SelectTrigger>
                <SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">우선순위</label>
              <Select value={priority} onValueChange={(v) => setPriority((v ?? 'medium') as MissionPriority)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PRIORITY_OPTIONS.map((p) => (<SelectItem key={p} value={p}><span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${MISSION_PRIORITY_COLORS[p].dot}`} />{MISSION_PRIORITY_LABELS[p]}</span></SelectItem>))}</SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">마감일 <span className="text-muted-foreground font-normal">(선택)</span></label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          {/* 결재 방식 3단계 */}
          <div>
            <label className="text-sm font-medium mb-2 block">결재 방식</label>
            <div className="space-y-2">
              {APPROVAL_OPTIONS.map((opt) => {
                const colors = APPROVAL_MODE_COLORS[opt.mode]
                return (
                  <button
                    key={opt.mode}
                    onClick={() => setApprovalMode(opt.mode)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-colors ${
                      approvalMode === opt.mode
                        ? `${colors.bg} border-current ${colors.text} font-medium`
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot}`} />
                    <div>
                      <p className="font-medium">{APPROVAL_MODE_LABELS[opt.mode]}</p>
                      <p className={`text-xs mt-0.5 ${approvalMode === opt.mode ? 'opacity-80' : 'text-muted-foreground'}`}>{opt.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !departmentId}>미션 생성</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

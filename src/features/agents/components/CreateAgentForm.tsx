import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LlmModel, Department } from '@/types/agent'
import { LLM_MODEL_LABELS } from '@/lib/constants'
import { AGENT_INSTRUCTIONS_TEMPLATE } from '@/lib/templates'

interface CreateAgentFormProps {
  open: boolean
  onClose: () => void
  departments: Department[]
  defaultDepartmentId: string | null
  onCreate: (input: {
    departmentId: string
    name: string
    role: string
    instructions: string
    llmModel: LlmModel
  }) => void
}

const MODEL_OPTIONS: LlmModel[] = ['claude-opus', 'claude-sonnet', 'claude-haiku', 'gemini-flash-image']

export function CreateAgentForm({ open, onClose, departments, defaultDepartmentId, onCreate }: CreateAgentFormProps) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [instructions, setInstructions] = useState(AGENT_INSTRUCTIONS_TEMPLATE)
  const [llmModel, setLlmModel] = useState<LlmModel>('claude-sonnet')
  const [departmentId, setDepartmentId] = useState(defaultDepartmentId ?? '')

  const handleCreate = () => {
    if (!name.trim() || !role.trim() || !departmentId) return
    onCreate({
      departmentId,
      name: name.trim(),
      role: role.trim(),
      instructions: instructions.trim(),
      llmModel,
    })
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setName('')
    setRole('')
    setInstructions(AGENT_INSTRUCTIONS_TEMPLATE)
    setLlmModel('claude-sonnet')
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[440px] sm:max-w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>새 직원 추가</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* 소속 부서 */}
          <div>
            <label className="text-sm font-medium mb-2 block">소속 부서</label>
            <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="부서를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 이름 */}
          <div>
            <label className="text-sm font-medium mb-2 block">이름</label>
            <Input
              placeholder="예: 트렌드 헌터"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 역할 */}
          <div>
            <label className="text-sm font-medium mb-2 block">역할</label>
            <Input
              placeholder="이 직원이 하는 일을 한 줄로"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* 업무 지침 */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              업무 지침 <span className="text-muted-foreground font-normal">(마크다운)</span>
            </label>
            <textarea
              placeholder="성격, 업무 프로세스, 규칙, 출력 형식을 정의하세요"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={8}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
            />
          </div>

          {/* AI 엔진 */}
          <div>
            <label className="text-sm font-medium mb-2 block">AI 엔진</label>
            <Select value={llmModel} onValueChange={(v) => setLlmModel(v as LlmModel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((model) => (
                  <SelectItem key={model} value={model}>
                    {LLM_MODEL_LABELS[model]}
                    <span className="text-muted-foreground ml-2 text-xs">
                      {model === 'claude-opus' && '— 복잡한 추론/기획'}
                      {model === 'claude-sonnet' && '— 일반 업무'}
                      {model === 'claude-haiku' && '— 단순/빠른 처리'}
                      {model === 'gemini-flash-image' && '— 이미지 생성'}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleCreate} disabled={!name.trim() || !role.trim() || !departmentId}>
            추가하기
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

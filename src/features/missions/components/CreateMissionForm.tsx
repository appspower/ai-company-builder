import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Department } from '@/types/agent'

interface CreateMissionFormProps {
  open: boolean
  onClose: () => void
  departments: Department[]
  onCreate: (input: {
    title: string
    description: string
    departmentId: string
    requiresApproval: boolean
  }) => void
}

export function CreateMissionForm({ open, onClose, departments, onCreate }: CreateMissionFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [requiresApproval, setRequiresApproval] = useState(true)

  const handleCreate = () => {
    if (!title.trim() || !departmentId) return
    onCreate({
      title: title.trim(),
      description: description.trim(),
      departmentId,
      requiresApproval,
    })
    setTitle('')
    setDescription('')
    setDepartmentId('')
    setRequiresApproval(true)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-[440px] sm:max-w-[440px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>새 미션 생성</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">미션 제목</label>
            <Input
              placeholder="예: 봄맞이 다이어트 숏폼 제작"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              설명 <span className="text-muted-foreground font-normal">(선택)</span>
            </label>
            <textarea
              placeholder="미션 내용을 상세히 적어주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">담당 부서</label>
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

          <div>
            <label className="text-sm font-medium mb-2 block">결재 설정</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRequiresApproval(true)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                  requiresApproval
                    ? 'bg-primary/10 border-primary text-primary font-medium'
                    : 'border-border hover:bg-muted'
                }`}
              >
                완료 전 결재 필요
              </button>
              <button
                onClick={() => setRequiresApproval(false)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm border transition-colors ${
                  !requiresApproval
                    ? 'bg-primary/10 border-primary text-primary font-medium'
                    : 'border-border hover:bg-muted'
                }`}
              >
                자동 실행
              </button>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !departmentId}>
            미션 생성
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

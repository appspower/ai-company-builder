import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const EMOJI_OPTIONS = ['🏢', '🌍', '🚀', '🎬', '💜', '🛒', '📱', '💡', '🎯', '🔬', '📊', '🎨']

interface CreateWorkspaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (workspace: { name: string; description: string; icon: string }) => void
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateWorkspaceDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('🏢')

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate({ name: name.trim(), description: description.trim(), icon })
    setName('')
    setDescription('')
    setIcon('🏢')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 회사 만들기</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* 아이콘 선택 */}
          <div>
            <label className="text-sm font-medium mb-2 block">아이콘</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === emoji
                      ? 'bg-primary/10 ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 회사 이름 */}
          <div>
            <label htmlFor="ws-name" className="text-sm font-medium mb-2 block">
              회사 이름
            </label>
            <Input
              id="ws-name"
              placeholder="예: AI 마케팅 팀"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          {/* 설명 */}
          <div>
            <label htmlFor="ws-desc" className="text-sm font-medium mb-2 block">
              설명 <span className="text-muted-foreground font-normal">(선택)</span>
            </label>
            <Input
              id="ws-desc"
              placeholder="이 회사가 하는 일을 간단히 적어주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            만들기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Workspace } from '@/types/workspace'
import { toast } from 'sonner'

const EMOJI_OPTIONS = ['🏢', '🌍', '🚀', '🎬', '💜', '🛒', '📱', '💡', '🎯', '🔬', '📊', '🎨']

interface CompanyInfoFormProps {
  workspace: Workspace
}

export function CompanyInfoForm({ workspace }: CompanyInfoFormProps) {
  const [name, setName] = useState(workspace.name)
  const [description, setDescription] = useState(workspace.description)
  const [icon, setIcon] = useState(workspace.icon)

  const handleSave = () => {
    toast.success('회사 정보가 저장되었습니다.')
  }

  return (
    <div className="space-y-5">
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
      <div>
        <label className="text-sm font-medium mb-2 block">회사 이름</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">설명</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button onClick={handleSave}>저장</Button>
    </div>
  )
}

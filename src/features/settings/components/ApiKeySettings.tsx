import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface ApiKeyEntry {
  id: string
  provider: string
  label: string
  placeholder: string
  value: string
}

const DEFAULT_KEYS: ApiKeyEntry[] = [
  { id: 'claude', provider: 'Anthropic', label: 'Claude API Key', placeholder: 'sk-ant-...', value: '' },
  { id: 'openai', provider: 'OpenAI', label: 'OpenAI API Key', placeholder: 'sk-...', value: '' },
  { id: 'gemini', provider: 'Google', label: 'Gemini API Key', placeholder: 'AIza...', value: '' },
]

export function ApiKeySettings() {
  const [keys, setKeys] = useState(DEFAULT_KEYS)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())

  const toggleVisible = (id: string) => {
    setVisibleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const updateKey = (id: string, value: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, value } : k)))
  }

  const handleSave = () => {
    toast.success('API 키가 저장되었습니다.')
  }

  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <div key={key.id} className="p-4 rounded-lg border space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{key.label}</span>
              <Badge variant="outline" className="text-[10px]">{key.provider}</Badge>
            </div>
            {key.value ? (
              <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600">연결됨</Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px]">미설정</Badge>
            )}
          </div>
          <div className="relative">
            <Input
              type={visibleIds.has(key.id) ? 'text' : 'password'}
              placeholder={key.placeholder}
              value={key.value}
              onChange={(e) => updateKey(key.id, e.target.value)}
              className="pr-10"
            />
            <button
              onClick={() => toggleVisible(key.id)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {visibleIds.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
      <Button onClick={handleSave}>저장</Button>
    </div>
  )
}

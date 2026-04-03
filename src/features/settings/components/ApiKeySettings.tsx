import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { LLM_MODEL_LABELS } from '@/lib/constants'
import type { LlmModel } from '@/types/agent'

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

const MODEL_OPTIONS: LlmModel[] = ['claude-opus', 'claude-sonnet', 'claude-haiku', 'gemini-flash-image']

export function ApiKeySettings() {
  const [keys, setKeys] = useState(DEFAULT_KEYS)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const [defaultModel, setDefaultModel] = useState<LlmModel>('claude-sonnet')

  const toggleVisible = (id: string) => {
    setVisibleIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }

  const updateKey = (id: string, value: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, value } : k)))
  }

  const handleSave = () => toast.success('AI 엔진 설정이 저장되었습니다.')

  return (
    <div className="space-y-8">
      {/* 기본 모델 선택 */}
      <section>
        <h3 className="text-sm font-semibold mb-1">기본 AI 모델</h3>
        <p className="text-xs text-muted-foreground mb-3">새 에이전트 생성 시 기본으로 선택되는 모델입니다.</p>
        <Select value={defaultModel} onValueChange={(v) => setDefaultModel((v ?? 'claude-sonnet') as LlmModel)}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODEL_OPTIONS.map((model) => (
              <SelectItem key={model} value={model}>
                <span className="flex items-center gap-2">
                  {LLM_MODEL_LABELS[model]}
                  <span className="text-muted-foreground text-xs">
                    {model === 'claude-opus' && '— 복잡한 추론/기획'}
                    {model === 'claude-sonnet' && '— 일반 업무 (추천)'}
                    {model === 'claude-haiku' && '— 단순/빠른 처리'}
                    {model === 'gemini-flash-image' && '— 이미지 생성'}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <Separator />

      {/* API 키 관리 */}
      <section>
        <h3 className="text-sm font-semibold mb-1">API 키 관리</h3>
        <p className="text-xs text-muted-foreground mb-4">각 AI 모델 제공사의 API 키를 입력하세요.</p>
        <div className="space-y-3">
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
        </div>
      </section>

      <Button onClick={handleSave}>저장</Button>
    </div>
  )
}

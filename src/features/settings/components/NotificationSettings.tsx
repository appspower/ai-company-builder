import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface NotificationOption {
  id: string
  label: string
  description: string
  enabled: boolean
}

const DEFAULT_OPTIONS: NotificationOption[] = [
  { id: 'approval', label: '결재 요청', description: '에이전트가 CEO 승인을 요청할 때', enabled: true },
  { id: 'complete', label: '미션 완료', description: '미션이 완료되었을 때', enabled: true },
  { id: 'error', label: '에이전트 에러', description: '에이전트에 오류가 발생했을 때', enabled: true },
  { id: 'artifact', label: '산출물 생성', description: '새로운 산출물이 만들어졌을 때', enabled: false },
]

export function NotificationSettings() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS)

  const toggle = (id: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o)))
  }

  const handleSave = () => {
    toast.success('알림 설정이 저장되었습니다.')
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <div key={opt.id} className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <p className="text-sm font-medium">{opt.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
          </div>
          <button
            onClick={() => toggle(opt.id)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              opt.enabled ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                opt.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      ))}
      <Button onClick={handleSave}>저장</Button>
    </div>
  )
}

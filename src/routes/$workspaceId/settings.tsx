import { useState } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { Building2, Key, Bell, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompanyInfoForm } from '@/features/settings/components/CompanyInfoForm'
import { ApiKeySettings } from '@/features/settings/components/ApiKeySettings'
import { NotificationSettings } from '@/features/settings/components/NotificationSettings'
import { useWorkspaceStore } from '@/features/workspace-lobby/store'
import { toast } from 'sonner'

export const Route = createFileRoute('/$workspaceId/settings')({
  component: SettingsPage,
})

type SettingsTab = 'company' | 'apikeys' | 'notifications' | 'data'

const TABS: { id: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { id: 'company', label: '회사 정보', icon: Building2 },
  { id: 'apikeys', label: 'AI 엔진 설정', icon: Key },
  { id: 'notifications', label: '알림 설정', icon: Bell },
  { id: 'data', label: '데이터 관리', icon: Trash2 },
]

function SettingsPage() {
  const { workspaceId } = useParams({ from: '/$workspaceId/settings' })
  const [activeTab, setActiveTab] = useState<SettingsTab>('company')
  const { workspaces } = useWorkspaceStore()
  const workspace = workspaces.find((ws) => ws.id === workspaceId)

  if (!workspace) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">회사를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">설정</h1>

      <div className="flex gap-8">
        {/* 탭 네비게이션 */}
        <nav className="w-48 shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 max-w-xl">
          {activeTab === 'company' && <CompanyInfoForm workspace={workspace} />}
          {activeTab === 'apikeys' && <ApiKeySettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                <h3 className="text-sm font-medium text-destructive mb-1">위험 영역</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  아래 작업은 되돌릴 수 없습니다. 신중하게 진행해 주세요.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">데이터 초기화</p>
                      <p className="text-xs text-muted-foreground">모든 미션과 산출물을 삭제합니다.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.error('Phase 2에서 구현 예정입니다.')}
                    >
                      초기화
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">회사 삭제</p>
                      <p className="text-xs text-muted-foreground">이 회사와 모든 데이터를 영구 삭제합니다.</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => toast.error('Phase 2에서 구현 예정입니다.')}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

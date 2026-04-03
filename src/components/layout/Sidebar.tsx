import { Link, useParams, useNavigate } from '@tanstack/react-router'
import {
  Home,
  Users,
  Rocket,
  Package,
  Activity,
  Settings,
  ChevronDown,
  ArrowLeft,
  Moon,
  Sun,
} from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspaceStore } from '@/features/workspace-lobby/store'
import { mockExecutionLogs } from '@/mocks/activity'

export function Sidebar() {
  const [isDark, setIsDark] = useState(false)
  const { workspaceId } = useParams({ strict: false }) as { workspaceId?: string }
  const navigate = useNavigate()
  const { workspaces } = useWorkspaceStore()

  const currentWorkspace = workspaces.find((ws) => ws.id === workspaceId)
  const runningCount = mockExecutionLogs.filter(
    (l) => l.workspaceId === workspaceId && l.status === 'running'
  ).length

  const mainMenuItems = [
    { icon: Home, label: '홈', to: `/${workspaceId}` },
    { icon: Users, label: '조직 & 에이전트', to: `/${workspaceId}/agents` },
    { icon: Rocket, label: '미션 센터', to: `/${workspaceId}/missions`, badge: currentWorkspace?.pendingApprovalCount },
    { icon: Activity, label: '활동 로그', to: `/${workspaceId}/activity`, badge: runningCount > 0 ? runningCount : undefined, badgeColor: 'bg-blue-500' },
    { icon: Package, label: '산출물 보관함', to: `/${workspaceId}/artifacts` },
  ]

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <aside
      className="flex flex-col w-60 min-h-screen text-sm shrink-0"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        color: 'var(--sidebar-fg)',
      }}
    >
      {/* Workspace Switcher */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<button className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity" />}
          >
            <span className="text-xl">{currentWorkspace?.icon ?? '🏢'}</span>
            <span className="font-medium text-sm flex-1 text-left truncate">
              {currentWorkspace?.name ?? '회사 선택'}
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => navigate({ to: '/$workspaceId', params: { workspaceId: ws.id } })}
                className="cursor-pointer"
              >
                <span className="mr-2">{ws.icon}</span>
                <span className={ws.id === workspaceId ? 'font-medium' : ''}>{ws.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2">
        {mainMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-colors hover:bg-white/10"
              activeOptions={{ exact: item.to === `/${workspaceId}` }}
              activeProps={{ className: 'bg-white/15' }}
            >
              <Icon className="w-4 h-4 opacity-70" />
              <span className="flex-1">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium text-white ${
                    (item as { badgeColor?: string }).badgeColor ?? 'bg-[var(--sidebar-accent)]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer — Settings + Theme + Back */}
      <div className="p-2 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link
          to="/$workspaceId/settings"
          params={{ workspaceId: workspaceId ?? '' }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-colors hover:bg-white/10"
          activeProps={{ className: 'bg-white/15' }}
        >
          <Settings className="w-4 h-4 opacity-70" />
          <span>설정</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-white/10 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 opacity-70" /> : <Moon className="w-4 h-4 opacity-70" />}
          <span>{isDark ? '라이트 모드' : '다크 모드'}</span>
        </button>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 opacity-70" />
          <span>로비로 돌아가기</span>
        </Link>
      </div>
    </aside>
  )
}

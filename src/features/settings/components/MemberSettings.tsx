import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Crown, Shield, User, Plus, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface Member {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  avatar: string
  joinedAt: string
}

const MOCK_MEMBERS: Member[] = [
  { id: 'm-1', name: '대표', email: 'ceo@company.com', role: 'owner', avatar: '👤', joinedAt: '2026-03-01' },
]

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Crown; color: string }> = {
  owner: { label: '오너', icon: Crown, color: 'text-amber-500' },
  admin: { label: '관리자', icon: Shield, color: 'text-blue-500' },
  member: { label: '멤버', icon: User, color: 'text-muted-foreground' },
}

export function MemberSettings() {
  return (
    <div className="space-y-6">
      {/* 멤버 목록 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold">멤버 ({MOCK_MEMBERS.length}명)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">이 회사에 접근할 수 있는 사용자입니다.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.info('멤버 초대는 Phase 2에서 지원됩니다.')}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            멤버 초대
          </Button>
        </div>

        <div className="space-y-2">
          {MOCK_MEMBERS.map((member) => {
            const roleConfig = ROLE_CONFIG[member.role]
            const RoleIcon = roleConfig.icon
            return (
              <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{member.name}</span>
                      <Badge variant="secondary" className={`text-[10px] ${roleConfig.color}`}>
                        <RoleIcon className="w-3 h-3 mr-0.5" />
                        {roleConfig.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{member.joinedAt}</span>
              </div>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* 역할 설명 */}
      <section>
        <h3 className="text-sm font-semibold mb-3">역할 안내</h3>
        <div className="space-y-2">
          {Object.entries(ROLE_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            const descriptions: Record<string, string> = {
              owner: '모든 설정 변경, 멤버 관리, 회사 삭제 권한',
              admin: '에이전트/미션 관리, 결재 처리 권한',
              member: '미션 조회, 산출물 확인 권한 (읽기 중심)',
            }
            return (
              <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                <div>
                  <p className="text-sm font-medium">{config.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{descriptions[key]}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import type { Workspace } from '@/types/workspace'
import { toast } from 'sonner'

const EMOJI_OPTIONS = ['🏢', '🌍', '🚀', '🎬', '💜', '🛒', '📱', '💡', '🎯', '🔬', '📊', '🎨']

interface CompanyInfoFormProps {
  workspace: Workspace
}

export function CompanyInfoForm({ workspace }: CompanyInfoFormProps) {
  // 기본 정보
  const [name, setName] = useState(workspace.name)
  const [description, setDescription] = useState(workspace.description)
  const [icon, setIcon] = useState(workspace.icon)

  // 사업자 정보
  const [businessType, setBusinessType] = useState<string>('individual')
  const [businessNumber, setBusinessNumber] = useState('')
  const [representativeName, setRepresentativeName] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [businessItem, setBusinessItem] = useState('')
  const [address, setAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const handleSave = () => {
    toast.success('회사 정보가 저장되었습니다.')
  }

  return (
    <div className="space-y-8">
      {/* 기본 정보 */}
      <section>
        <h3 className="text-sm font-semibold mb-4">기본 정보</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">아이콘</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    icon === emoji ? 'bg-primary/10 ring-2 ring-primary' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">회사 이름</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">한 줄 설명</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* 사업자 정보 */}
      <section>
        <h3 className="text-sm font-semibold mb-1">사업자 정보</h3>
        <p className="text-xs text-muted-foreground mb-4">세금계산서 발행 및 사업자 확인에 사용됩니다.</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">사업자 구분</label>
              <Select value={businessType} onValueChange={(v) => setBusinessType(v ?? 'individual')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">개인사업자</SelectItem>
                  <SelectItem value="corporation">법인사업자</SelectItem>
                  <SelectItem value="freelancer">프리랜서 (미등록)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">사업자등록번호</label>
              <Input
                placeholder="000-00-00000"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">대표자명</label>
              <Input
                placeholder="홍길동"
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {businessType === 'corporation' ? '법인명' : '상호명'}
              </label>
              <Input value={name} disabled className="bg-muted/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">업태</label>
              <Input
                placeholder="서비스업"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">업종</label>
              <Input
                placeholder="소프트웨어 개발"
                value={businessItem}
                onChange={(e) => setBusinessItem(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">사업장 주소</label>
            <Input
              placeholder="서울특별시 강남구 ..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* 담당자 정보 */}
      <section>
        <h3 className="text-sm font-semibold mb-1">담당자 정보</h3>
        <p className="text-xs text-muted-foreground mb-4">플랫폼 관련 연락을 받을 담당자입니다.</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">담당자명</label>
            <Input
              placeholder="이름"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">이메일</label>
            <Input
              type="email"
              placeholder="email@company.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">연락처</label>
            <Input
              placeholder="010-0000-0000"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>
      </section>

      <Button onClick={handleSave} className="mt-2">저장</Button>
    </div>
  )
}

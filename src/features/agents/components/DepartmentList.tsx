import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import type { Department } from '@/types/agent'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DepartmentListProps {
  departments: Department[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: (name: string) => void
}

export function DepartmentList({ departments, selectedId, onSelect, onAdd }: DepartmentListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const handleAdd = () => {
    if (!newName.trim()) return
    onAdd(newName.trim())
    setNewName('')
    setIsAdding(false)
  }

  return (
    <div className="w-56 shrink-0 border-r h-full">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold">부서</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="p-1 rounded hover:bg-muted transition-colors"
          title="부서 추가"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-1">
        {/* 전체 보기 */}
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
            selectedId === null ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="flex-1 text-left">전체</span>
          <span className="text-xs text-muted-foreground">
            {departments.reduce((sum, d) => sum + d.agentCount, 0)}
          </span>
        </button>

        {/* 부서 목록 */}
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelect(dept.id)}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedId === dept.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
            }`}
          >
            <span className="flex-1 text-left truncate">{dept.name}</span>
            <span className="text-xs text-muted-foreground">{dept.agentCount}</span>
          </button>
        ))}

        {/* 부서 추가 인라인 폼 */}
        {isAdding && (
          <div className="px-2 py-1.5 space-y-2">
            <Input
              autoFocus
              placeholder="부서명 입력"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
                if (e.key === 'Escape') { setIsAdding(false); setNewName('') }
              }}
              className="h-8 text-sm"
            />
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setNewName('') }} className="h-7 text-xs flex-1">
                취소
              </Button>
              <Button size="sm" onClick={handleAdd} disabled={!newName.trim()} className="h-7 text-xs flex-1">
                추가
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

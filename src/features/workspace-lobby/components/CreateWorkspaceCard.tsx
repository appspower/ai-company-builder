interface CreateWorkspaceCardProps {
  onClick: () => void
}

export function CreateWorkspaceCard({ onClick }: CreateWorkspaceCardProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-dashed bg-card/50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-card transition-all duration-200 min-h-[180px]"
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <span className="text-2xl text-muted-foreground">+</span>
      </div>
      <p className="text-sm font-medium text-muted-foreground">새 회사 만들기</p>
    </button>
  )
}

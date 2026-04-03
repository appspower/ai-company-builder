import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'

export function PageShell() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-background overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

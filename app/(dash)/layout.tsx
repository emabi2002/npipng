import { PropsWithChildren, Suspense } from 'react'
import DashboardHeader from './dash/components/DashboardHeader'
import DashboardSidebar from './dash/components/DashboardSidebar'
import HorizontalSubNav from '../../components/nav/HorizontalSubNav'

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <HorizontalSubNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

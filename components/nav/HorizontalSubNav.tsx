'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function HorizontalSubNav() {
  const pathname = usePathname()

  // Extract current module from pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  const currentModule = pathSegments[1] // e.g., 'academic', 'finance', etc.

  // Don't show subnav on dashboard
  if (!currentModule || currentModule === 'dash') return null

  // Define navigation items for each module
  const getNavItems = () => {
    switch (currentModule) {
      case 'academic':
        return [
          { title: 'Academic Management System', href: '/dash/academic' },
          { title: 'Staff Portals', href: '/dash/academic/staff-portals' },
          { title: 'Student Portals', href: '/dash/academic/student-portals' }
        ]
      case 'finance':
        return [
          { title: 'Overview', href: '/dash/finance' },
          { title: 'Billing', href: '/dash/finance/billing' },
          { title: 'Invoices', href: '/dash/finance/invoices' },
          { title: 'Payments', href: '/dash/finance/payments' },
          { title: 'Reports', href: '/dash/finance/reports' }
        ]
      case 'hr':
        return [
          { title: 'HR Overview', href: '/dash/hr/overview' },
          { title: 'Academic Staff', href: '/dash/hr/academic-staff' },
          { title: 'Non-Academic Staff', href: '/dash/hr/non-academic-staff' },
          { title: 'Laborers & Support', href: '/dash/hr/laborers' },
          { title: 'Payroll', href: '/dash/hr/payroll' },
          { title: 'Leave Management', href: '/dash/hr/leave' },
          { title: 'Performance', href: '/dash/hr/performance' },
          { title: 'Training', href: '/dash/hr/training' }
        ]
      case 'welfare':
        return [
          { title: 'Overview', href: '/dash/welfare' },
          { title: 'Health Services', href: '/dash/welfare/health' },
          { title: 'Counselling', href: '/dash/welfare/counselling' },
          { title: 'Housing', href: '/dash/welfare/housing' },
          { title: 'Discipline', href: '/dash/welfare/discipline' }
        ]
      case 'library':
        return [
          { title: 'Overview', href: '/dash/library' },
          { title: 'Catalog', href: '/dash/library/catalog' },
          { title: 'Loans', href: '/dash/library/loans' },
          { title: 'Members', href: '/dash/library/members' }
        ]
      case 'industry':
        return [
          { title: 'Overview', href: '/dash/industry' },
          { title: 'Partners', href: '/dash/industry/partners' },
          { title: 'Placements', href: '/dash/industry/placements' }
        ]
      case 'setup':
        return [
          { title: 'Overview', href: '/dash/setup' },
          { title: 'Organization', href: '/dash/setup/org' },
          { title: 'Users', href: '/dash/setup/users' },
          { title: 'Terms', href: '/dash/setup/terms' },
          { title: 'Modules', href: '/dash/setup/modules' }
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  // Second level navigation for academic management
  const getSecondLevelNav = () => {
    if (currentModule === 'academic' && (pathname === '/dash/academic' || pathname.includes('/dash/academic/'))) {
      return [
        { title: 'Academic Calendar', href: '/dash/academic/calendar' },
        { title: 'Departments', href: '/dash/academic/departments' },
        { title: 'Programs', href: '/dash/academic/programs' },
        { title: 'Courses', href: '/dash/academic/courses' },
        { title: 'Curriculum', href: '/dash/academic/curriculum' },
        { title: 'Class Scheduling', href: '/dash/academic/scheduling' },
        { title: 'Examination', href: '/dash/academic/examination' },
        { title: 'Grading', href: '/dash/academic/grading' }
      ]
    }
    return []
  }

  const secondLevelItems = getSecondLevelNav()

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Primary Navigation */}
      <div className="px-6 py-2">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                `}
              >
                {item.title}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Secondary Navigation (for Academic Management) */}
      {secondLevelItems.length > 0 && (
        <div className="px-6 py-2 border-t border-gray-100 bg-gray-50">
          <div className="flex space-x-1 overflow-x-auto">
            {secondLevelItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-3 py-1 text-xs font-medium rounded border whitespace-nowrap transition-colors
                    ${isActive
                      ? 'bg-white text-blue-700 border-blue-300'
                      : 'text-gray-600 hover:bg-white hover:text-blue-700 border-gray-300'
                    }
                  `}
                >
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

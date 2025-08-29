'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../../../lib/auth/auth-context'
import {
  Home,
  GraduationCap,
  DollarSign,
  Users,
  Heart,
  BookOpen,
  Building,
  Settings,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Menu,
  UserCheck,
  Calendar,
  Clock,
  Award,
  FileText,
  Receipt,
  CheckCircle,
  Briefcase
} from 'lucide-react'

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/dash',
    icon: Home
  },
  {
    title: 'Academics',
    href: '/dash/academic',
    icon: GraduationCap
  },
  {
    title: 'Finance',
    href: '/dash/finance',
    icon: DollarSign
  },
  {
    title: 'HR & Payroll',
    href: '/dash/hr',
    icon: Users
  },
  {
    title: 'Welfare',
    href: '/dash/welfare',
    icon: Heart
  },
  {
    title: 'Library',
    href: '/dash/library',
    icon: BookOpen
  },
  {
    title: 'Industry',
    href: '/dash/industry',
    icon: Building
  },
  {
    title: 'System Setup',
    href: '/dash/setup',
    icon: Settings,
    roles: ['admin']
  }
]

export default function DashboardSidebar() {
  const { user, hasRole } = useAuth()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const hasAccess = (item: MenuItem) => {
    if (!item.roles) return true
    return item.roles.some(role => hasRole(role))
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderMenuItem = (item: MenuItem) => {
    if (!hasAccess(item)) return null

    const active = isActive(item.href)

    return (
      <Link
        key={item.title}
        href={item.href}
        className={`
          block px-6 py-3 text-sm font-medium transition-colors border-l-4
          ${active
            ? 'bg-blue-500 text-white border-blue-700'
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-transparent hover:border-blue-300'
          }
        `}
      >
        {item.title}
      </Link>
    )
  }

  return (
    <div className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 text-center border-b border-gray-200">
        {!sidebarCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-blue-600 mb-1">NPIPNG ERP</h1>
          </div>
        )}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Menu Label */}
      {!sidebarCollapsed && (
        <div className="px-6 py-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">MENU</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* User Info */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.user_metadata?.role || 'Member'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

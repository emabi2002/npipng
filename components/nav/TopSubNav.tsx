'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import {
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  Settings,
  GraduationCap,
  Building,
  Heart,
  FileText,
  Calendar,
  Target,
  Award,
  UserPlus,
  CreditCard,
  Receipt,
  PiggyBank,
  UserCheck,
  Briefcase,
  Clock,
  Home,
  Search,
  Archive,
  TrendingUp
} from 'lucide-react'

interface SubMenuItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: string
  roles?: string[]
}

const moduleSubMenus: Record<string, SubMenuItem[]> = {
  academic: [
    {
      title: 'Student Portals',
      href: '/dash/academic/student-portals',
      icon: Users,
      description: 'Student profiles and information',
      badge: '2,847'
    },
    {
      title: 'Student Grades',
      href: '/dash/academic/student-grades',
      icon: BarChart3,
      description: 'Academic performance and grading'
    },
    {
      title: 'Faculty Assessments',
      href: '/dash/academic/faculty-assessments',
      icon: Award,
      description: 'Create and manage assessments'
    },
    {
      title: 'Academic Management',
      href: '/dash/academic/academic-management',
      icon: Settings,
      description: 'Courses, programs, and curriculum'
    },
    {
      title: 'Course Registration',
      href: '/dash/academic/course-registration',
      icon: BookOpen,
      description: 'Student course enrollment'
    },
    {
      title: 'Timetables',
      href: '/dash/academic/timetables',
      icon: Calendar,
      description: 'Class schedules and timing'
    }
  ],
  finance: [
    {
      title: 'Overview',
      href: '/dash/finance/overview',
      icon: TrendingUp,
      description: 'Financial dashboard and metrics'
    },
    {
      title: 'Billing & Invoices',
      href: '/dash/finance/billing',
      icon: Receipt,
      description: 'Student billing and payments',
      badge: 'K 245,300'
    },
    {
      title: 'Payments',
      href: '/dash/finance/payments',
      icon: CreditCard,
      description: 'Payment processing and tracking'
    },
    {
      title: 'Fee Management',
      href: '/dash/finance/fees',
      icon: DollarSign,
      description: 'Fee structures and collection'
    },
    {
      title: 'Scholarships',
      href: '/dash/finance/scholarships',
      icon: PiggyBank,
      description: 'Scholarship programs and awards'
    },
    {
      title: 'Financial Reports',
      href: '/dash/finance/reports',
      icon: FileText,
      description: 'Revenue and expense reports'
    }
  ],
  hr: [
    {
      title: 'HR Dashboard',
      href: '/dash/hr/overview',
      icon: TrendingUp,
      description: 'HR metrics and analytics dashboard'
    },
    {
      title: 'Academic Staff',
      href: '/dash/hr/academic-staff',
      icon: GraduationCap,
      description: 'Professors, lecturers, and researchers',
      badge: '89'
    },
    {
      title: 'Non-Academic Staff',
      href: '/dash/hr/non-academic-staff',
      icon: Users,
      description: 'Admin, IT, and support staff',
      badge: '67'
    },
    {
      title: 'Laborers & Support',
      href: '/dash/hr/laborers',
      icon: UserCheck,
      description: 'Cleaners, security, maintenance staff',
      badge: '31'
    },
    {
      title: 'Payroll Dashboard',
      href: '/dash/hr/payroll',
      icon: DollarSign,
      description: 'PNG payroll processing & workflow'
    },
    {
      title: 'Recruitment',
      href: '/dash/hr/recruitment',
      icon: UserPlus,
      description: 'Hiring and onboarding processes'
    },
    {
      title: 'Performance Management',
      href: '/dash/hr/performance',
      icon: Award,
      description: 'Staff appraisals and evaluations'
    },
    {
      title: 'Leave Management',
      href: '/dash/hr/leave',
      icon: Clock,
      description: 'Leave requests and PNG entitlements'
    },
    {
      title: 'Training & Development',
      href: '/dash/hr/training',
      icon: BookOpen,
      description: 'Staff development and skills tracking'
    },
    {
      title: 'Contracts & Benefits',
      href: '/dash/hr/contracts',
      icon: FileText,
      description: 'Employment agreements and benefits'
    },
    {
      title: 'Time & Attendance',
      href: '/dash/hr/attendance',
      icon: Clock,
      description: 'Time tracking and attendance monitoring'
    },
    {
      title: 'Reports & Analytics',
      href: '/dash/hr/reports',
      icon: BarChart3,
      description: 'HR reporting and workforce analytics'
    }
  ],
  library: [
    {
      title: 'Catalog',
      href: '/dash/library/catalog',
      icon: BookOpen,
      description: 'Library resource management',
      badge: '12,450'
    },
    {
      title: 'Loans & Returns',
      href: '/dash/library/loans',
      icon: Archive,
      description: 'Book circulation and tracking'
    },
    {
      title: 'Members',
      href: '/dash/library/members',
      icon: Users,
      description: 'Library membership management'
    },
    {
      title: 'Digital Resources',
      href: '/dash/library/digital',
      icon: Settings,
      description: 'E-books and online materials'
    },
    {
      title: 'Reports',
      href: '/dash/library/reports',
      icon: BarChart3,
      description: 'Usage statistics and analytics'
    }
  ],
  welfare: [
    {
      title: 'Health Services',
      href: '/dash/welfare/health',
      icon: Heart,
      description: 'Student health and medical records'
    },
    {
      title: 'Counselling',
      href: '/dash/welfare/counselling',
      icon: Users,
      description: 'Student counseling services'
    },
    {
      title: 'Housing',
      href: '/dash/welfare/housing',
      icon: Building,
      description: 'Hostel and accommodation management'
    },
    {
      title: 'Discipline',
      href: '/dash/welfare/discipline',
      icon: FileText,
      description: 'Disciplinary cases and records'
    },
    {
      title: 'Student Activities',
      href: '/dash/welfare/activities',
      icon: Target,
      description: 'Clubs and extracurricular activities'
    }
  ],
  industry: [
    {
      title: 'Industry Partners',
      href: '/dash/industry/partners',
      icon: Building,
      description: 'Partner companies and organizations',
      badge: '50+'
    },
    {
      title: 'Placements',
      href: '/dash/industry/placements',
      icon: Briefcase,
      description: 'Student internships and job placements'
    },
    {
      title: 'Projects',
      href: '/dash/industry/projects',
      icon: Target,
      description: 'Industry collaboration projects'
    },
    {
      title: 'Reports',
      href: '/dash/industry/reports',
      icon: BarChart3,
      description: 'Placement statistics and analytics'
    }
  ],
  setup: [
    {
      title: 'Organization',
      href: '/dash/setup/org',
      icon: Building,
      description: 'Institution settings and configuration'
    },
    {
      title: 'Users & Roles',
      href: '/dash/setup/users',
      icon: Users,
      description: 'User management and permissions'
    },
    {
      title: 'Academic Terms',
      href: '/dash/setup/terms',
      icon: Calendar,
      description: 'Semester and term configuration'
    },
    {
      title: 'Modules',
      href: '/dash/setup/modules',
      icon: Settings,
      description: 'System modules and features'
    },
    {
      title: 'Integrations',
      href: '/dash/setup/integrations',
      icon: Target,
      description: 'Third-party service connections'
    }
  ]
}

export default function TopSubNav() {
  const pathname = usePathname()

  // Extract current module from pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  const currentModule = pathSegments[1] // e.g., 'academic', 'finance', etc.

  // Don't show subnav on dashboard
  if (!currentModule || currentModule === 'dash') return null

  const subMenuItems = moduleSubMenus[currentModule]
  if (!subMenuItems) return null

  const getModuleTitle = (module: string) => {
    const titles: Record<string, string> = {
      academic: 'Academic Management',
      finance: 'Finance & Billing',
      hr: 'HR & Payroll',
      library: 'Library Management',
      welfare: 'Student Welfare',
      industry: 'Industry Relations',
      setup: 'System Setup'
    }
    return titles[module] || module.charAt(0).toUpperCase() + module.slice(1)
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        {/* Module Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {getModuleTitle(currentModule)}
          </h2>
          <p className="text-sm text-gray-600">
            Choose a function below to manage your {getModuleTitle(currentModule).toLowerCase()}
          </p>
        </div>

        {/* Sub Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subMenuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                  ${isActive
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-blue-300'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    flex-shrink-0 p-2 rounded-md transition-colors
                    ${isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }
                  `}>
                    <item.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`
                        text-sm font-medium truncate
                        ${isActive ? 'text-blue-900' : 'text-gray-900 group-hover:text-blue-900'}
                      `}>
                        {item.title}
                      </h3>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          {item.badge}
                        </Badge>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

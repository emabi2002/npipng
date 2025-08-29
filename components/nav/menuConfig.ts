export type NavModule = { key: string; label: string; href: string };
export type SubItem   = { key: string; label: string; href: string };
export type TabItem   = { key: string; label: string; href: string };

export const MAJOR_MODULES: NavModule[] = [
  { key: "dashboard", label: "Dashboard", href: "/dash" },
  { key: "academic",  label: "Academics", href: "/dash/academic" },
  { key: "finance",   label: "Finance",   href: "/dash/finance" },
  { key: "hr",        label: "HR & Payroll", href: "/dash/hr" },
  { key: "welfare",   label: "Welfare",   href: "/dash/welfare" },
  { key: "library",   label: "Library",   href: "/dash/library" },
  { key: "industry",  label: "Industry",  href: "/dash/industry" },
  { key: "setup",     label: "System Setup", href: "/dash/setup" },
];

// Keep old name working for anything already importing it
export const NAV_MODULES = MAJOR_MODULES;

/** Top sub-menu (changes when you click a major module in the SideNav) */
export const SUBNAV: Record<string, SubItem[]> = {
  academic: [
    { key: "academic-management", label: "Academic Management System", href: "/dash/academic/academic-management" },
    { key: "staff-portals",       label: "Staff Portals",              href: "/dash/academic/staff-portals" },
    { key: "student-portals",     label: "Student Portals",            href: "/dash/academic/student-portals" },
  ],
  finance: [
    { key: "overview",  label: "Overview",  href: "/dash/finance/overview" },
    { key: "billing",   label: "Billing",   href: "/dash/finance/billing" },
    { key: "reports",   label: "Reports",   href: "/dash/finance/reports" },
  ],
  hr: [
    { key: "overview", label: "Overview", href: "/dash/hr/overview" },
    { key: "staff",    label: "Staff",    href: "/dash/hr/staff" },
    { key: "leave",    label: "Leave",    href: "/dash/hr/leave" },
    { key: "payroll",  label: "Payroll",  href: "/dash/hr/payroll" },
  ],
  welfare: [
    { key: "health",      label: "Health",       href: "/dash/welfare/health" },
    { key: "counselling", label: "Counselling",  href: "/dash/welfare/counselling" },
    { key: "discipline",  label: "Discipline",   href: "/dash/welfare/discipline" },
    { key: "housing",     label: "Housing",      href: "/dash/welfare/housing" },
  ],
  library: [
    { key: "catalog", label: "Catalog", href: "/dash/library/catalog" },
    { key: "loans",   label: "Loans",   href: "/dash/library/loans" },
  ],
  industry: [
    { key: "placements", label: "Placements", href: "/dash/industry/placements" },
    { key: "partners",   label: "Employers",  href: "/dash/industry/partners" },
  ],
  setup: [
    { key: "org",    label: "Organisation", href: "/dash/setup/org" },
    { key: "terms",  label: "Academic Terms", href: "/dash/setup/terms" },
    { key: "users",  label: "Users & Roles", href: "/dash/setup/users" },
    { key: "modules",label: "Modules",      href: "/dash/setup/modules" },
  ],
};

/** Red tab bar per sub-menu (changes when you click the top sub-menu) */
export const TABS: Record<string, Record<string, TabItem[]>> = {
  finance: {
    billing: [
      { key: "invoices",     label: "Invoices",     href: "/dash/finance/billing/invoices" },
      { key: "payments",     label: "Payments",     href: "/dash/finance/billing/payments" },
      { key: "scholarships", label: "Scholarships", href: "/dash/finance/billing/scholarships" },
    ],
    reports: [
      { key: "ar",        label: "A/R Aging",   href: "/dash/finance/reports/ar" },
      { key: "collections", label: "Collections", href: "/dash/finance/reports/collections" },
    ],
  },
  academic: {
    "academic-management": [
      { key: "courses",           label: "Courses",           href: "/dash/academic/academic-management/courses" },
      { key: "curriculum",        label: "Curriculum",        href: "/dash/academic/academic-management/curriculum" },
      { key: "departments",       label: "Departments",       href: "/dash/academic/academic-management/departments" },
      { key: "programs",          label: "Programs",          href: "/dash/academic/academic-management/programs" },
      { key: "academic-calendar", label: "Academic Calendar", href: "/dash/academic/academic-management/academic-calendar" },
      { key: "class-scheduling",  label: "Class Scheduling",  href: "/dash/academic/academic-management/class-scheduling" },
      { key: "examination",       label: "Examination",       href: "/dash/academic/academic-management/examination" },
      { key: "grading",           label: "Grading",           href: "/dash/academic/academic-management/grading" },
    ],
    "student-portals": [
      { key: "student-profile",     label: "Student Profile",        href: "/dash/academic/student-portals/student-profile" },
      { key: "admission-enrolment", label: "Admission/Enrolment",    href: "/dash/academic/student-portals/admission-enrolment" },
      { key: "registration",        label: "Registration",           href: "/dash/academic/student-portals/registration" },
      { key: "timetable",           label: "Timetable",              href: "/dash/academic/student-portals/timetable" },
      { key: "grades-transcripts",  label: "Grades and Transcripts", href: "/dash/academic/student-portals/grades-transcripts" },
      { key: "fees",                label: "Fees",                   href: "/dash/academic/student-portals/fees" },
      { key: "welfare-links",       label: "Welfare Links",          href: "/dash/academic/student-portals/welfare-links" },
      { key: "hostel",              label: "Hostel",                 href: "/dash/academic/student-portals/hostel" },
      { key: "library-links",       label: "Library Links",          href: "/dash/academic/student-portals/library-links" },
      { key: "notices",             label: "Notices",                href: "/dash/academic/student-portals/notices" },
    ],
    "staff-portals": [
      { key: "teaching-schedules", label: "Teaching Schedules", href: "/dash/academic/staff-portals/teaching-schedules" },
      { key: "materials",          label: "Materials",         href: "/dash/academic/staff-portals/materials" },
      { key: "attendance",         label: "Attendance",        href: "/dash/academic/staff-portals/attendance" },
      { key: "assessment-entry",   label: "Assessment Entry",  href: "/dash/academic/staff-portals/assessment-entry" },
      { key: "advisees",           label: "Advisees",          href: "/dash/academic/staff-portals/advisees" },
      { key: "hr-self-services",   label: "HR Self Services",  href: "/dash/academic/staff-portals/hr-self-services" },
    ],
  },
  hr: {
    staff: [
      { key: "people",   label: "People",   href: "/dash/hr/staff/people" },
      { key: "contracts",label: "Contracts",href: "/dash/hr/staff/contracts" },
    ],
    leave: [
      { key: "requests", label: "Requests", href: "/dash/hr/leave/requests" },
      { key: "balances", label: "Balances", href: "/dash/hr/leave/balances" },
    ],
    payroll: [
      { key: "runs",     label: "Runs",     href: "/dash/hr/payroll/runs" },
      { key: "payslips", label: "Payslips", href: "/dash/hr/payroll/payslips" },
    ],
  },
  welfare: {
    health: [{ key: "clinic", label: "Clinic Visits", href: "/dash/welfare/health/clinic" }],
  },
  library: {
    catalog: [{ key: "search", label: "Search", href: "/dash/library/catalog/search" }],
  },
  industry: {
    placements: [{ key: "active", label: "Active", href: "/dash/industry/placements/active" }],
  },
  setup: {
    users: [{ key: "manage", label: "Manage Users", href: "/dash/setup/users/manage" }],
  },
};

// Helper that adds the subnav items onto the modules (used by useMyModules)
export function withSubnav() {
  return MAJOR_MODULES.map((m) => ({
    ...m,
    items: SUBNAV[m.key] ?? [],
  }));
}

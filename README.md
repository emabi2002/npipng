# 🎓 NPIPNG Academic Grading System

A comprehensive academic management platform with **Internal (40%) + External (60%)** assessment structure, built with Next.js, Supabase, and TypeScript.

## 🌟 Features

### 📚 Academic Assessment Management
- **Assessment Types**: Quiz, Test, Assignment, Project, Lab, Participation, Final Exam
- **Weighted Grading**: Internal assessments (40%) + External assessments (60%)
- **Real-time Calculations**: Automated GPA, CGPA, and grade letter assignments
- **Grade Scale**: A+ to F with 4.0 quality point scale

### 👩‍🏫 Faculty Portal
- Course overview with enrollment statistics
- Assessment configuration and creation
- Student grading interface with bulk operations
- Real-time grade analytics and performance reporting
- Assessment management across multiple courses

### 🎓 Student Portal
- Overall GPA tracking and degree progress indicators
- Course-wise grade breakdown (internal + external)
- Assessment details with submission status
- Academic performance trends and analytics
- Official transcript generation

### 📊 Analytics Dashboard
- Executive KPIs and comprehensive reporting
- Grade distribution charts and trends
- Performance analytics across all modules
- Real-time data visualization with interactive charts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase account and project
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd npipng
bun install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.local.example .env.local

# Update with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database
```bash
# View setup instructions
bun run setup-guide

# Then manually execute the schema in Supabase Dashboard
# 1. Go to: https://your-project.supabase.co/project/_/sql/new
# 2. Copy content from /supabase/academic-schema.sql
# 3. Paste and execute in SQL Editor
```

### 4. Start Development
```bash
bun run dev
```

## 📖 System Architecture

### Database Schema
- **Academic Programs & Courses**: Program management and course catalog
- **Assessment Configurations**: Configurable assessment types and weights
- **Student Grades**: Individual assessment grades and submissions
- **Course Grades**: Final course grades with automated calculations
- **Academic Records**: Semester-wise GPA and transcript data

### Key Components
```
📁 app/(dash)/dash/academic/
├── faculty-assessments/     # Faculty assessment management
├── student-grades/          # Student grade portal
└── analytics/              # Academic analytics dashboard

📁 lib/api/
├── academic.ts             # Academic system API utilities
└── analytics.ts            # Analytics and reporting APIs

📁 supabase/
└── academic-schema.sql     # Complete database schema
```

## 🎯 Assessment Workflow

### 1. Faculty Creates Assessment Configuration
```typescript
// Internal Assessment (40% weight)
{
  assessment_type: 'quiz',
  category: 'internal',
  weight_percentage: 10,
  max_marks: 100
}

// External Assessment (60% weight)
{
  assessment_type: 'final_exam',
  category: 'external',
  weight_percentage: 60,
  max_marks: 100
}
```

### 2. Grade Calculation Engine
```sql
-- Automated calculation: 40% internal + 60% external
final_percentage = (internal_percentage * 0.40) + (external_percentage * 0.60)
```

### 3. Real-time Updates
- PostgreSQL triggers automatically update course grades
- GPA calculations update instantly when grades are entered
- Grade letters assigned based on percentage thresholds

## 📊 Grade Scale

| Letter | Percentage | Quality Points | Description |
|--------|------------|----------------|-------------|
| A+ | 97-100% | 4.00 | Outstanding |
| A | 93-96% | 4.00 | Excellent |
| A- | 90-92% | 3.70 | Very Good |
| B+ | 87-89% | 3.30 | Good |
| B | 83-86% | 3.00 | Above Average |
| B- | 80-82% | 2.70 | Average |
| C+ | 77-79% | 2.30 | Below Average |
| C | 73-76% | 2.00 | Satisfactory |
| C- | 70-72% | 1.70 | Minimum Pass |
| D+ | 67-69% | 1.30 | Poor |
| D | 63-66% | 1.00 | Very Poor |
| D- | 60-62% | 0.70 | Marginal |
| F | 0-59% | 0.00 | Fail |

## 🔒 Security & Access Control

### Row Level Security (RLS)
- Students can only view their own grades and enrollments
- Faculty can manage assessments for their assigned courses
- Admins have full access to all academic data

### Role-based Access
```typescript
// User roles
type UserRole = 'admin' | 'faculty' | 'student' | 'staff'

// Permission checks
hasRole('faculty') // Can create assessments
hasRole('student') // Can view own grades
hasRole('admin')   // Full system access
```

## 🎓 Usage Examples

### Creating Assessment Configuration (Faculty)
```typescript
const config = await createAssessmentConfig({
  course_id: 'course-id',
  assessment_type: 'quiz',
  category: 'internal',
  name: 'Weekly Quiz 1',
  max_marks: 50,
  weight_percentage: 5,
  due_date: '2024-02-15'
})
```

### Viewing Student Progress
```typescript
const progress = await getStudentAcademicProgress(studentId)
// Returns: enrollments, grades, GPA, current courses, credits
```

### Grade Analytics
```typescript
const analytics = await getModuleAnalytics()
// Returns: enrollment trends, grade distributions, performance metrics
```

## 📱 User Interfaces

### Faculty Assessment Management
- **URL**: `/dash/academic/faculty-assessments`
- **Features**: Course selection, assessment creation, student grading, analytics

### Student Grade Portal
- **URL**: `/dash/academic/student-grades`
- **Features**: GPA tracking, course grades, progress indicators, transcript

### Analytics Dashboard
- **URL**: `/dash/analytics`
- **Features**: Executive KPIs, performance charts, system statistics

## 🛠️ API Reference

### Assessment Management
```typescript
// Get faculty courses
const courses = await getFacultyAssignments(facultyId, semester)

// Create assessment
const assessment = await createAssessment({
  config_id: 'config-id',
  title: 'Midterm Exam',
  total_marks: 100
})

// Grade student
const grade = await gradeAssessment(gradeId, {
  marks_obtained: 85,
  comments: 'Good work!',
  graded_by: facultyId
})
```

### Grade Calculations
```typescript
// Calculate GPA
const gpa = await calculateGPA(studentId, semesterYear)
// Returns: { gpa: 3.45, totalCredits: 18, qualityPoints: 62.1 }

// Get academic progress
const progress = await getStudentAcademicProgress(studentId)
```

## 🔧 Configuration

### Assessment Types
```typescript
type AssessmentType =
  | 'quiz'          // Short assessments
  | 'test'          // Mid-term examinations
  | 'assignment'    // Homework and coursework
  | 'project'       // Individual or group projects
  | 'lab'           // Laboratory work
  | 'participation' // Class participation and attendance
  | 'final_exam'    // Final examination
```

### Grade Categories
```typescript
type AssessmentCategory =
  | 'internal'  // 40% weight - continuous assessment
  | 'external'  // 60% weight - final examination
```

## 📈 Performance & Optimization

### Database Optimization
- Indexed foreign keys and frequently queried columns
- Computed columns for real-time grade calculations
- Efficient query patterns with proper joins

### Real-time Updates
- PostgreSQL triggers for automatic grade calculations
- Supabase real-time subscriptions for live updates
- Optimized queries to minimize database load

## 🧪 Testing

### Sample Data
The system includes sample data for testing:
- Academic programs (Computer Science, Business Administration, Engineering)
- Course catalog with proper credit allocations
- Grade scale configurations
- Assessment type templates

### Development Testing
```bash
# Start development server
bun run dev

# Access test interfaces
# Faculty: /dash/academic/faculty-assessments
# Student: /dash/academic/student-grades
# Analytics: /dash/analytics
```

## 🚀 Deployment

### Production Setup
1. **Database**: Execute schema in production Supabase
2. **Environment**: Configure production environment variables
3. **Build**: `bun run build` for optimized production build
4. **Deploy**: Deploy to your preferred hosting platform

### Environment Variables
```bash
# Production environment
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

## 📚 Documentation

### File Structure
```
📁 npipng/
├── app/(dash)/dash/academic/    # Academic interfaces
├── lib/api/academic.ts          # Academic API utilities
├── lib/api/analytics.ts         # Analytics APIs
├── components/analytics/        # Chart components
├── supabase/academic-schema.sql # Database schema
└── scripts/setup-instructions.js # Setup guide
```

### Key Features Documentation
- **Assessment Management**: Create and manage course assessments
- **Grade Calculations**: Automated 40%/60% weighted calculations
- **Student Progress**: Comprehensive academic tracking
- **Faculty Tools**: Professional grading interfaces
- **Analytics**: Real-time performance insights

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Use proper error handling and validation
3. Maintain consistent UI/UX patterns
4. Write comprehensive tests for new features
5. Document API changes and new components

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error boundaries
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
1. **Database Connection**: Ensure Supabase credentials are correct
2. **Schema Errors**: Execute academic-schema.sql in Supabase Dashboard
3. **Permission Issues**: Check user roles and RLS policies
4. **Grade Calculations**: Verify assessment configurations and weights

### Getting Help
- Review the setup guide: `bun run setup-guide`
- Check the academic schema documentation
- Verify Supabase Dashboard configuration
- Test with sample data and demo accounts

---

**🎓 Ready to transform academic management with automated grading and comprehensive analytics!**

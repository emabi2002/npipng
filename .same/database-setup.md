# NPIPNG ERP - Database Setup Guide

## 🚀 Supabase Database Integration

This document provides complete instructions for setting up the Supabase database for the NPIPNG College Management System.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Node.js/Bun**: Ensure you have Bun installed for package management
3. **Environment Variables**: Access to configure environment variables

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Set project name: `npipng-erp`
5. Set database password (save this securely)
6. Choose region closest to your users
7. Click "Create new project"

## Step 2: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Database Configuration
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

   # Application Configuration
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

   **Where to find your Supabase credentials:**
   - Go to your project dashboard
   - Click "Settings" in the sidebar
   - Go to "API" section
   - Copy the URL and keys from there

## Step 3: Set up Database Schema

1. Open your Supabase project dashboard
2. Go to "SQL Editor" in the sidebar
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

**The schema includes:**
- ✅ User management with role-based access
- ✅ Student management and academic records
- ✅ Employee and HR management
- ✅ Library management system
- ✅ Finance and billing system
- ✅ Course and enrollment management
- ✅ System settings and notifications

## Step 4: Set up Row Level Security (RLS)

The schema automatically enables RLS policies for:
- Users can only access their own data
- Role-based permissions for administrative functions
- Secure data isolation between different user types

## Step 5: Initialize Sample Data (Optional)

For development and testing, you can initialize sample data:

1. In your project, run:
   ```bash
   bun dev
   ```

2. In your browser console (F12), run:
   ```javascript
   import { initializeSampleData } from './lib/database/sample-data'
   await initializeSampleData()
   ```

**Sample data includes:**
- 5 departments (Computer Science, Business, Engineering, Arts & Sciences, Education)
- 5 academic programs with different degree types
- Sample users for all roles (admin, faculty, student, staff, librarian)
- Course catalog with prerequisites
- Library books and categories
- Fee structures for current academic year

## Step 6: Configure Authentication

1. In Supabase dashboard, go to "Authentication"
2. Go to "Settings" tab
3. Configure email templates (optional)
4. Set up OAuth providers if needed (optional)

## Step 7: Test the System

1. Start the development server:
   ```bash
   bun dev
   ```

2. Navigate to `http://localhost:3000/auth/login`

3. Test with sample accounts:
   - **Admin**: admin@npipng.edu / admin123
   - **Faculty**: john.smith@npipng.edu / faculty123
   - **Staff**: mary.johnson@npipng.edu / staff123
   - **Librarian**: david.wilson@npipng.edu / library123
   - **Student**: alice.brown@student.npipng.edu / student123

## Database Schema Overview

### Core Tables

| Table | Purpose | Records |
|-------|---------|---------|
| `users` | User authentication and basic info | All system users |
| `students` | Student-specific data | Academic records |
| `employees` | Staff/faculty data | HR records |
| `courses` | Course catalog | Academic offerings |
| `enrollments` | Student course registrations | Academic tracking |
| `books` | Library catalog | Book inventory |
| `book_loans` | Library borrowing | Circulation tracking |
| `invoices` | Student billing | Financial records |
| `payments` | Payment tracking | Financial transactions |

### Relationships

```
users (1) -> (1) students
users (1) -> (1) employees
users (1) -> (1) library_members

students (1) -> (M) enrollments
courses (1) -> (M) enrollments
books (1) -> (M) book_loans
students (1) -> (M) invoices
```

## API Integration

The system includes comprehensive API utilities:

- **Students API** (`lib/api/students.ts`)
- **Library API** (`lib/api/library.ts`)
- **Finance API** (`lib/api/finance.ts`)
- **HR API** (`lib/api/hr.ts`)

Each API module provides:
- ✅ CRUD operations
- ✅ Advanced filtering and search
- ✅ Pagination support
- ✅ Related data fetching
- ✅ Statistics and reporting

## Security Features

1. **Row Level Security (RLS)**: Automatic data isolation
2. **Role-based Access Control**: Different permissions per user role
3. **Authentication**: Secure login with Supabase Auth
4. **Data Validation**: Type-safe operations with TypeScript
5. **Audit Logging**: Track all data changes

## Monitoring and Maintenance

1. **Database Metrics**: Monitor in Supabase dashboard
2. **Query Performance**: Use Supabase insights
3. **Backup Strategy**: Automatic backups included in Supabase
4. **Scaling**: Supabase handles scaling automatically

## Troubleshooting

### Common Issues:

1. **Environment Variables**: Ensure all variables are set correctly
2. **RLS Policies**: Check if you can access data with correct permissions
3. **Connection Issues**: Verify Supabase URL and keys
4. **Schema Errors**: Run schema.sql in correct order

### Getting Help:

- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Review error logs in browser console
- Check Supabase project logs in dashboard

## Production Deployment

For production deployment:

1. Set up production Supabase project
2. Configure production environment variables
3. Enable database backups
4. Set up monitoring and alerts
5. Configure custom domains (if needed)

---

**🎉 Your NPIPNG ERP database is now ready!**

The system now features a complete, production-ready database with all major ERP modules integrated.

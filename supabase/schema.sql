-- NPIPNG College Management System Database Schema
-- This schema supports a complete ERP system for educational institutions

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'faculty', 'student', 'staff', 'librarian');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'graduated', 'dropped', 'suspended');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE loan_status AS ENUM ('active', 'returned', 'overdue', 'lost');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- =============================================
-- USERS & AUTHENTICATION MODULE
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    address TEXT,
    role user_role DEFAULT 'student',
    status user_status DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- User profiles for additional information
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ACADEMIC MANAGEMENT MODULE
-- =============================================

-- Academic departments
CREATE TABLE public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    head_of_department_id UUID REFERENCES public.users(id),
    building VARCHAR(100),
    budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic programs/majors
CREATE TABLE public.programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    degree_type VARCHAR(50), -- Bachelor, Master, PhD, etc.
    duration_years INTEGER DEFAULT 4,
    total_credits INTEGER DEFAULT 120,
    description TEXT,
    requirements TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    program_id UUID REFERENCES public.programs(id),
    year_level INTEGER DEFAULT 1,
    section VARCHAR(10),
    gpa DECIMAL(3,2),
    total_credits INTEGER DEFAULT 0,
    enrollment_status enrollment_status DEFAULT 'enrolled',
    admission_date DATE DEFAULT CURRENT_DATE,
    expected_graduation DATE,
    advisor_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id),
    credits INTEGER DEFAULT 3,
    prerequisites TEXT[],
    level VARCHAR(20), -- Undergraduate, Graduate, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Semesters/Terms
CREATE TABLE public.semesters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    is_current BOOLEAN DEFAULT false,
    academic_year VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course sections/offerings
CREATE TABLE public.course_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id),
    semester_id UUID REFERENCES public.semesters(id),
    section_code VARCHAR(10) NOT NULL,
    instructor_id UUID REFERENCES public.users(id),
    capacity INTEGER DEFAULT 30,
    enrolled_count INTEGER DEFAULT 0,
    schedule JSONB, -- {days: ['Monday', 'Wednesday'], time: '09:00-10:30', room: 'A101'}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student enrollments
CREATE TABLE public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id),
    course_section_id UUID REFERENCES public.course_sections(id),
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'enrolled', -- enrolled, dropped, completed
    final_grade VARCHAR(5), -- A+, A, B+, etc.
    grade_points DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_section_id)
);

-- =============================================
-- HR & EMPLOYEE MANAGEMENT MODULE
-- =============================================

-- Employees
CREATE TABLE public.employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    position VARCHAR(255),
    hire_date DATE DEFAULT CURRENT_DATE,
    salary DECIMAL(12,2),
    employment_type VARCHAR(50), -- Full-time, Part-time, Contract
    manager_id UUID REFERENCES public.employees(id),
    office_location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leave records
CREATE TABLE public.leave_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES public.employees(id),
    leave_type VARCHAR(50), -- Sick, Vacation, Personal, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INTEGER,
    reason TEXT,
    status leave_status DEFAULT 'pending',
    approved_by UUID REFERENCES public.employees(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance evaluations
CREATE TABLE public.performance_evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES public.employees(id),
    evaluator_id UUID REFERENCES public.employees(id),
    evaluation_period VARCHAR(50), -- Q1 2024, Annual 2024, etc.
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    goals_achievement JSONB,
    strengths TEXT,
    areas_for_improvement TEXT,
    comments TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- draft, submitted, approved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LIBRARY MANAGEMENT MODULE
-- =============================================

-- Book categories
CREATE TABLE public.book_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES public.book_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authors
CREATE TABLE public.authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    biography TEXT,
    birth_date DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books
CREATE TABLE public.books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    publisher VARCHAR(255),
    publication_year INTEGER,
    pages INTEGER,
    language VARCHAR(50) DEFAULT 'English',
    category_id UUID REFERENCES public.book_categories(id),
    description TEXT,
    location VARCHAR(100), -- Shelf location
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book authors (many-to-many relationship)
CREATE TABLE public.book_authors (
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.authors(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- Library members
CREATE TABLE public.library_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    member_id VARCHAR(20) UNIQUE NOT NULL,
    membership_type VARCHAR(50) DEFAULT 'standard', -- standard, premium, faculty
    max_books INTEGER DEFAULT 3,
    membership_expiry DATE,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book loans
CREATE TABLE public.book_loans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID REFERENCES public.books(id),
    member_id UUID REFERENCES public.library_members(id),
    loan_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status loan_status DEFAULT 'active',
    fine_amount DECIMAL(8,2) DEFAULT 0,
    renewal_count INTEGER DEFAULT 0,
    librarian_id UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- FINANCE MANAGEMENT MODULE
-- =============================================

-- Fee structures
CREATE TABLE public.fee_structures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    program_id UUID REFERENCES public.programs(id),
    semester_id UUID REFERENCES public.semesters(id),
    tuition_fee DECIMAL(12,2) DEFAULT 0,
    lab_fee DECIMAL(12,2) DEFAULT 0,
    library_fee DECIMAL(12,2) DEFAULT 0,
    miscellaneous_fee DECIMAL(12,2) DEFAULT 0,
    total_fee DECIMAL(12,2) GENERATED ALWAYS AS (tuition_fee + lab_fee + library_fee + miscellaneous_fee) STORED,
    due_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student invoices
CREATE TABLE public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID REFERENCES public.students(id),
    fee_structure_id UUID REFERENCES public.fee_structures(id),
    amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) GENERATED ALWAYS AS (amount - discount_amount) STORED,
    due_date DATE NOT NULL,
    status payment_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50), -- Cash, Card, Bank Transfer, etc.
    payment_date DATE DEFAULT CURRENT_DATE,
    transaction_id VARCHAR(100),
    processed_by UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships and financial aid
CREATE TABLE public.scholarships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(12,2),
    percentage DECIMAL(5,2), -- For percentage-based scholarships
    eligibility_criteria TEXT,
    application_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student scholarships
CREATE TABLE public.student_scholarships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id),
    scholarship_id UUID REFERENCES public.scholarships(id),
    amount_awarded DECIMAL(12,2),
    semester_id UUID REFERENCES public.semesters(id),
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, completed
    awarded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYSTEM MANAGEMENT MODULE
-- =============================================

-- System notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, warning, error, success
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    is_read BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System announcements
CREATE TABLE public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.users(id),
    target_audience TEXT[], -- ['students', 'faculty', 'staff', 'all']
    is_published BOOLEAN DEFAULT false,
    publish_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category VARCHAR(50),
    is_editable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users and authentication indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);

-- Academic indexes
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_students_program ON public.students(program_id);
CREATE INDEX idx_courses_code ON public.courses(code);
CREATE INDEX idx_courses_department ON public.courses(department_id);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_section ON public.enrollments(course_section_id);

-- HR indexes
CREATE INDEX idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX idx_employees_department ON public.employees(department_id);
CREATE INDEX idx_leave_records_employee ON public.leave_records(employee_id);

-- Library indexes
CREATE INDEX idx_books_isbn ON public.books(isbn);
CREATE INDEX idx_books_title ON public.books USING gin(to_tsvector('english', title));
CREATE INDEX idx_book_loans_member ON public.book_loans(member_id);
CREATE INDEX idx_book_loans_book ON public.book_loans(book_id);
CREATE INDEX idx_book_loans_status ON public.book_loans(status);

-- Finance indexes
CREATE INDEX idx_invoices_student ON public.invoices(student_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_payments_invoice ON public.payments(invoice_id);

-- System indexes
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON public.audit_logs(table_name);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Students can read their own academic data
CREATE POLICY "Students can read own data" ON public.students
    FOR SELECT USING (user_id = auth.uid());

-- Employees can read their own HR data
CREATE POLICY "Employees can read own data" ON public.employees
    FOR SELECT USING (user_id = auth.uid());

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update book availability
CREATE OR REPLACE FUNCTION update_book_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE public.books
        SET available_copies = available_copies - 1
        WHERE id = NEW.book_id AND available_copies > 0;
    END IF;

    IF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status = 'returned' THEN
        UPDATE public.books
        SET available_copies = available_copies + 1
        WHERE id = NEW.book_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger for book availability
CREATE TRIGGER update_book_availability_trigger
    AFTER INSERT OR UPDATE ON public.book_loans
    FOR EACH ROW EXECUTE FUNCTION update_book_availability();

-- Function to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number = 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('invoice_sequence')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for invoice numbers
CREATE SEQUENCE invoice_sequence START 1;

-- Trigger for invoice number generation
CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- =============================================
-- INITIAL DATA SEEDING
-- =============================================

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, category) VALUES
('institution_name', 'NPIPNG College', 'Name of the educational institution', 'general'),
('academic_year', '2024-2025', 'Current academic year', 'academic'),
('default_loan_period_days', '14', 'Default book loan period in days', 'library'),
('max_renewal_count', '2', 'Maximum number of renewals allowed', 'library'),
('fine_per_day', '0.50', 'Fine amount per day for overdue books', 'library'),
('late_payment_fee', '25.00', 'Late payment fee for overdue invoices', 'finance');

-- Insert default book categories
INSERT INTO public.book_categories (name, code, description) VALUES
('Computer Science', 'CS', 'Books related to computer science and programming'),
('Mathematics', 'MATH', 'Mathematics and statistics books'),
('Engineering', 'ENG', 'Engineering and technical books'),
('Business', 'BUS', 'Business and management books'),
('Literature', 'LIT', 'Literature and language books'),
('Science', 'SCI', 'General science books'),
('History', 'HIST', 'History and social studies books');

-- Insert default departments
INSERT INTO public.departments (name, code, description) VALUES
('Computer Science', 'CS', 'Department of Computer Science and Information Technology'),
('Engineering', 'ENG', 'Department of Engineering'),
('Business Administration', 'BA', 'Department of Business Administration'),
('Mathematics', 'MATH', 'Department of Mathematics and Statistics'),
('Library Services', 'LIB', 'Library and Information Services');

-- Insert default programs
INSERT INTO public.programs (name, code, department_id, degree_type, duration_years, total_credits)
SELECT
    'Bachelor of Computer Science', 'BCS', d.id, 'Bachelor', 4, 120
FROM public.departments d WHERE d.code = 'CS'
UNION ALL
SELECT
    'Bachelor of Engineering', 'BE', d.id, 'Bachelor', 4, 128
FROM public.departments d WHERE d.code = 'ENG'
UNION ALL
SELECT
    'Bachelor of Business Administration', 'BBA', d.id, 'Bachelor', 4, 120
FROM public.departments d WHERE d.code = 'BA';

-- Schema creation complete
-- Remember to run this in your Supabase SQL editor or migration system

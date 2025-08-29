-- NPIPNG College Management System
-- Complete Database Schema for All ERP Modules

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. USERS & AUTHENTICATION SYSTEM
-- =============================================

-- Roles enumeration
CREATE TYPE user_role AS ENUM ('admin', 'faculty', 'staff', 'student', 'librarian', 'finance', 'hr');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'graduated');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    status user_status NOT NULL DEFAULT 'active',
    employee_id VARCHAR(50) UNIQUE,
    student_id VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User permissions
CREATE TABLE user_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    module VARCHAR(50) NOT NULL,
    permission VARCHAR(50) NOT NULL,
    granted_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. ACADEMIC MANAGEMENT SYSTEM
-- =============================================

-- Departments
CREATE TABLE departments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    head_of_department UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Academic programs
CREATE TABLE programs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    degree_type VARCHAR(50) NOT NULL, -- Bachelor, Master, PhD, Diploma
    duration_years INTEGER NOT NULL,
    department_id UUID REFERENCES departments(id),
    total_credits INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    program_id UUID REFERENCES programs(id),
    admission_semester VARCHAR(20),
    admission_year INTEGER,
    current_semester INTEGER,
    batch VARCHAR(10),
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    total_credits INTEGER DEFAULT 0,
    parent_name VARCHAR(255),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    graduation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    contact_hours INTEGER,
    lab_hours INTEGER DEFAULT 0,
    course_type VARCHAR(20) DEFAULT 'core', -- core, elective, major
    level INTEGER, -- 100, 200, 300, 400
    department_id UUID REFERENCES departments(id),
    prerequisites TEXT[], -- Array of course codes
    max_students INTEGER DEFAULT 40,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course offerings (specific semester instances)
CREATE TABLE course_offerings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES courses(id),
    instructor_id UUID REFERENCES public.users(id),
    semester VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    room VARCHAR(50),
    schedule JSONB, -- Day/time schedule
    max_enrollment INTEGER DEFAULT 40,
    current_enrollment INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student enrollments
CREATE TABLE enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    course_offering_id UUID REFERENCES course_offerings(id),
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'enrolled', -- enrolled, dropped, completed
    grade VARCHAR(5),
    gpa_points DECIMAL(3,2),
    attendance_percentage DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_offering_id)
);

-- Grades and assessments
CREATE TABLE grades (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    enrollment_id UUID REFERENCES enrollments(id),
    assessment_type VARCHAR(50), -- assignment, quiz, midterm, final, project
    assessment_name VARCHAR(255),
    max_score DECIMAL(6,2),
    scored DECIMAL(6,2),
    percentage DECIMAL(5,2),
    date_assessed DATE,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. HR & EMPLOYEE MANAGEMENT
-- =============================================

-- Employee positions
CREATE TABLE positions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES departments(id),
    salary_range_min DECIMAL(10,2),
    salary_range_max DECIMAL(10,2),
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees
CREATE TABLE employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    position_id UUID REFERENCES positions(id),
    department_id UUID REFERENCES departments(id),
    hire_date DATE NOT NULL,
    employment_type VARCHAR(20) DEFAULT 'full-time', -- full-time, part-time, contract
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, terminated
    salary DECIMAL(10,2),
    office_location VARCHAR(100),
    reports_to UUID REFERENCES employees(id),
    qualifications TEXT,
    specialization TEXT,
    years_experience INTEGER DEFAULT 0,
    contract_end_date DATE,
    termination_date DATE,
    termination_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee leave records
CREATE TABLE leave_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL, -- annual, sick, emergency, maternity
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    approved_by UUID REFERENCES employees(id),
    approval_date DATE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee performance reviews
CREATE TABLE performance_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id),
    review_period VARCHAR(20), -- 2024-Q1, 2024-Annual
    reviewer_id UUID REFERENCES employees(id),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    teaching_rating INTEGER CHECK (teaching_rating >= 1 AND teaching_rating <= 5),
    research_rating INTEGER CHECK (research_rating >= 1 AND research_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    goals_achieved TEXT,
    areas_for_improvement TEXT,
    comments TEXT,
    review_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. LIBRARY MANAGEMENT SYSTEM
-- =============================================

-- Books catalog
CREATE TABLE books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(500),
    publisher VARCHAR(255),
    publication_year INTEGER,
    edition VARCHAR(50),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    call_number VARCHAR(50),
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    location VARCHAR(100),
    description TEXT,
    cover_image_url TEXT,
    price DECIMAL(8,2),
    is_digital BOOLEAN DEFAULT false,
    digital_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Library members (extends students, employees)
CREATE TABLE library_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    member_id VARCHAR(50) UNIQUE NOT NULL,
    member_type VARCHAR(20) NOT NULL, -- student, faculty, staff, visitor
    max_books_allowed INTEGER DEFAULT 5,
    loan_period_days INTEGER DEFAULT 14,
    fine_rate_per_day DECIMAL(4,2) DEFAULT 0.50,
    membership_start DATE DEFAULT CURRENT_DATE,
    membership_end DATE,
    is_active BOOLEAN DEFAULT true,
    total_books_borrowed INTEGER DEFAULT 0,
    total_fines_paid DECIMAL(8,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book loans
CREATE TABLE book_loans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID REFERENCES books(id),
    member_id UUID REFERENCES library_members(id),
    loan_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    renewal_count INTEGER DEFAULT 0,
    max_renewals INTEGER DEFAULT 3,
    fine_amount DECIMAL(8,2) DEFAULT 0.00,
    fine_paid DECIMAL(8,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active', -- active, returned, overdue, lost
    notes TEXT,
    issued_by UUID REFERENCES public.users(id),
    returned_to UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book reservations
CREATE TABLE book_reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    book_id UUID REFERENCES books(id),
    member_id UUID REFERENCES library_members(id),
    reservation_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, fulfilled, expired, cancelled
    priority INTEGER DEFAULT 1,
    notified BOOLEAN DEFAULT false,
    fulfilled_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Library fines
CREATE TABLE library_fines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    member_id UUID REFERENCES library_members(id),
    loan_id UUID REFERENCES book_loans(id),
    fine_type VARCHAR(50), -- overdue, lost_book, damage
    amount DECIMAL(8,2) NOT NULL,
    paid_amount DECIMAL(8,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, partial, paid, waived
    description TEXT,
    created_date DATE DEFAULT CURRENT_DATE,
    paid_date DATE,
    waived_by UUID REFERENCES public.users(id),
    waived_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. FINANCE MANAGEMENT SYSTEM
-- =============================================

-- Fee structures
CREATE TABLE fee_structures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    program_id UUID REFERENCES programs(id),
    semester INTEGER,
    fee_type VARCHAR(100), -- tuition, lab, library, registration, etc.
    amount DECIMAL(10,2) NOT NULL,
    is_mandatory BOOLEAN DEFAULT true,
    description TEXT,
    academic_year VARCHAR(20),
    due_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student invoices
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID REFERENCES students(id),
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    balance_amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, partial, paid, overdue
    generated_by UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE invoice_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    fee_structure_id UUID REFERENCES fee_structures(id),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment records
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    invoice_id UUID REFERENCES invoices(id),
    student_id UUID REFERENCES students(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- cash, bank_transfer, online, card
    payment_date DATE DEFAULT CURRENT_DATE,
    bank_name VARCHAR(255),
    transaction_id VARCHAR(255),
    voucher_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed, refunded
    processed_by UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships and financial aid
CREATE TABLE scholarships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2),
    percentage DECIMAL(5,2),
    criteria TEXT,
    available_count INTEGER,
    academic_year VARCHAR(20),
    application_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarship applications
CREATE TABLE scholarship_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scholarship_id UUID REFERENCES scholarships(id),
    student_id UUID REFERENCES students(id),
    application_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    amount_awarded DECIMAL(10,2),
    approved_by UUID REFERENCES public.users(id),
    approval_date DATE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. SYSTEM MANAGEMENT
-- =============================================

-- Notifications
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_id UUID REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- info, warning, error, success
    category VARCHAR(50), -- payment, grade, library, general
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- System settings
CREATE TABLE system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_employee_id ON public.users(employee_id);
CREATE INDEX idx_users_student_id ON public.users(student_id);

-- Students indexes
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_program_id ON students(program_id);
CREATE INDEX idx_students_active ON students(is_active);

-- Employees indexes
CREATE INDEX idx_employees_employee_id ON employees(employee_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);

-- Courses indexes
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_course_offerings_semester ON course_offerings(semester, year);

-- Library indexes
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_book_loans_status ON book_loans(status);
CREATE INDEX idx_book_loans_due_date ON book_loans(due_date);

-- Finance indexes
CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Notifications indexes
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (to be expanded)
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can view own records" ON students FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Employees can view own records" ON employees FOR SELECT USING (user_id = auth.uid());

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

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate student CGPA
CREATE OR REPLACE FUNCTION calculate_student_cgpa(student_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    total_points DECIMAL(10,2) := 0;
    total_credits INTEGER := 0;
    cgpa DECIMAL(3,2) := 0;
BEGIN
    SELECT
        COALESCE(SUM(c.credits * e.gpa_points), 0),
        COALESCE(SUM(c.credits), 0)
    INTO total_points, total_credits
    FROM enrollments e
    JOIN course_offerings co ON e.course_offering_id = co.id
    JOIN courses c ON co.course_id = c.id
    WHERE e.student_id = student_uuid
    AND e.status = 'completed'
    AND e.gpa_points IS NOT NULL;

    IF total_credits > 0 THEN
        cgpa := total_points / total_credits;
    END IF;

    RETURN ROUND(cgpa, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to check book availability
CREATE OR REPLACE FUNCTION check_book_availability(book_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    available_count INTEGER := 0;
BEGIN
    SELECT available_copies INTO available_count
    FROM books
    WHERE id = book_uuid;

    RETURN COALESCE(available_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Insert default system settings
INSERT INTO system_settings (key, value, description, data_type, is_public) VALUES
('institution_name', 'National Polytechnic Institute PNG', 'Institution name', 'string', true),
('academic_year', '2024/2025', 'Current academic year', 'string', true),
('current_semester', 'Spring 2025', 'Current semester', 'string', true),
('library_fine_rate', '0.50', 'Fine rate per day for overdue books', 'number', false),
('max_book_renewals', '3', 'Maximum number of book renewals allowed', 'number', false),
('student_loan_period', '14', 'Default loan period for students in days', 'number', false),
('faculty_loan_period', '30', 'Default loan period for faculty in days', 'number', false);

-- Success message
SELECT 'NPIPNG Database Schema Created Successfully! 🎉' AS message;

-- NPIPNG ERP System Database Schema
-- Created for Supabase PostgreSQL Database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'super-secret-jwt-token';

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    head VARCHAR(255),
    head_contact VARCHAR(50),
    head_email VARCHAR(255),
    location VARCHAR(255),
    established_year INTEGER,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    total_staff INTEGER DEFAULT 0,
    total_programs INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    budget DECIMAL(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(100), -- undergraduate, graduate, certificate, diploma
    level VARCHAR(100), -- bachelor, master, phd, certificate
    department VARCHAR(255),
    department_code VARCHAR(20),
    description TEXT,
    duration INTEGER, -- in years or semesters
    credits INTEGER,
    coordinator VARCHAR(255),
    coordinator_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_review', 'suspended')),
    established_year INTEGER,
    total_students INTEGER DEFAULT 0,
    capacity INTEGER,
    tuition_fee DECIMAL(10,2),
    entry_requirements TEXT,
    career_outcomes TEXT,
    accreditation_body VARCHAR(255),
    last_review DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (department_code) REFERENCES departments(code) ON UPDATE CASCADE
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(255) NOT NULL,
    description TEXT,
    credit_hours INTEGER NOT NULL DEFAULT 3,
    contact_hours INTEGER,
    department VARCHAR(255),
    level VARCHAR(20), -- 100, 200, 300, 400 (undergraduate), 500+ (graduate)
    semester VARCHAR(20), -- fall, spring, summer
    prerequisites TEXT, -- JSON array of prerequisite course codes
    instructor VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'full')),
    enrolled_students INTEGER DEFAULT 0,
    max_capacity INTEGER DEFAULT 30,
    fees DECIMAL(10,2),
    academic_year VARCHAR(20), -- e.g., "2024-2025"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curriculum Table (for program course requirements)
CREATE TABLE IF NOT EXISTS curriculum (
    id BIGSERIAL PRIMARY KEY,
    program_code VARCHAR(20) NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    requirement_type VARCHAR(50) DEFAULT 'required' CHECK (requirement_type IN ('required', 'elective', 'optional')),
    year_level INTEGER, -- which year of the program
    semester VARCHAR(20), -- fall, spring, summer
    credits INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (program_code) REFERENCES programs(code) ON UPDATE CASCADE,
    FOREIGN KEY (course_code) REFERENCES courses(course_code) ON UPDATE CASCADE,
    UNIQUE(program_code, course_code)
);

-- Schedule Table (for class scheduling)
CREATE TABLE IF NOT EXISTS schedule (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL,
    section VARCHAR(10),
    instructor VARCHAR(255),
    day_of_week VARCHAR(20), -- monday, tuesday, etc.
    start_time TIME,
    end_time TIME,
    room VARCHAR(100),
    building VARCHAR(100),
    semester VARCHAR(20),
    academic_year VARCHAR(20),
    max_enrollment INTEGER DEFAULT 30,
    current_enrollment INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed', 'in_progress')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (course_code) REFERENCES courses(course_code) ON UPDATE CASCADE
);

-- Examination Table (for exam scheduling and management)
CREATE TABLE IF NOT EXISTS examination (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL,
    exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('midterm', 'final', 'quiz', 'practical', 'oral')),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    duration INTEGER, -- in minutes
    room VARCHAR(100),
    building VARCHAR(100),
    instructor VARCHAR(255),
    total_marks INTEGER DEFAULT 100,
    passing_marks INTEGER DEFAULT 50,
    instructions TEXT,
    semester VARCHAR(20),
    academic_year VARCHAR(20),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed', 'grading')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (course_code) REFERENCES courses(course_code) ON UPDATE CASCADE
);

-- Grading Table (for grade management and grading schemes)
CREATE TABLE IF NOT EXISTS grading (
    id BIGSERIAL PRIMARY KEY,
    scheme_name VARCHAR(100) NOT NULL,
    grade VARCHAR(5) NOT NULL, -- A+, A, B+, B, etc.
    min_percentage DECIMAL(5,2),
    max_percentage DECIMAL(5,2),
    gpa_points DECIMAL(3,2),
    description VARCHAR(255),
    is_passing BOOLEAN DEFAULT true,
    program_level VARCHAR(50), -- undergraduate, graduate
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(scheme_name, grade)
);

-- Calendar Table (for academic calendar and events)
CREATE TABLE IF NOT EXISTS calendar (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) CHECK (event_type IN ('semester_start', 'semester_end', 'exam_period', 'holiday', 'registration', 'graduation', 'orientation', 'other')),
    start_date DATE NOT NULL,
    end_date DATE,
    all_day BOOLEAN DEFAULT false,
    location VARCHAR(255),
    organizer VARCHAR(255),
    academic_year VARCHAR(20),
    semester VARCHAR(20),
    department VARCHAR(255),
    program VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    recurring BOOLEAN DEFAULT false,
    recurring_pattern VARCHAR(50), -- weekly, monthly, yearly
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed', 'postponed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_status ON departments(status);

CREATE INDEX IF NOT EXISTS idx_programs_code ON programs(code);
CREATE INDEX IF NOT EXISTS idx_programs_department_code ON programs(department_code);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_academic_year ON courses(academic_year);

CREATE INDEX IF NOT EXISTS idx_curriculum_program ON curriculum(program_code);
CREATE INDEX IF NOT EXISTS idx_curriculum_course ON curriculum(course_code);

CREATE INDEX IF NOT EXISTS idx_schedule_course ON schedule(course_code);
CREATE INDEX IF NOT EXISTS idx_schedule_day_time ON schedule(day_of_week, start_time);
CREATE INDEX IF NOT EXISTS idx_schedule_academic_year ON schedule(academic_year, semester);

CREATE INDEX IF NOT EXISTS idx_examination_course ON examination(course_code);
CREATE INDEX IF NOT EXISTS idx_examination_date ON examination(exam_date);
CREATE INDEX IF NOT EXISTS idx_examination_academic_year ON examination(academic_year, semester);

CREATE INDEX IF NOT EXISTS idx_grading_scheme ON grading(scheme_name);

CREATE INDEX IF NOT EXISTS idx_calendar_date ON calendar(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_calendar_type ON calendar(event_type);
CREATE INDEX IF NOT EXISTS idx_calendar_academic_year ON calendar(academic_year);

-- Create triggers for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_curriculum_updated_at BEFORE UPDATE ON curriculum FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedule_updated_at BEFORE UPDATE ON schedule FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_examination_updated_at BEFORE UPDATE ON examination FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grading_updated_at BEFORE UPDATE ON grading FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_updated_at BEFORE UPDATE ON calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default grading schemes
INSERT INTO grading (scheme_name, grade, min_percentage, max_percentage, gpa_points, description, is_passing, program_level) VALUES
-- Undergraduate Grading Scheme
('Standard Undergraduate', 'A+', 95.00, 100.00, 4.00, 'Excellent', true, 'undergraduate'),
('Standard Undergraduate', 'A', 90.00, 94.99, 4.00, 'Excellent', true, 'undergraduate'),
('Standard Undergraduate', 'A-', 85.00, 89.99, 3.70, 'Very Good', true, 'undergraduate'),
('Standard Undergraduate', 'B+', 80.00, 84.99, 3.30, 'Good', true, 'undergraduate'),
('Standard Undergraduate', 'B', 75.00, 79.99, 3.00, 'Good', true, 'undergraduate'),
('Standard Undergraduate', 'B-', 70.00, 74.99, 2.70, 'Satisfactory', true, 'undergraduate'),
('Standard Undergraduate', 'C+', 65.00, 69.99, 2.30, 'Satisfactory', true, 'undergraduate'),
('Standard Undergraduate', 'C', 60.00, 64.99, 2.00, 'Satisfactory', true, 'undergraduate'),
('Standard Undergraduate', 'C-', 55.00, 59.99, 1.70, 'Marginal Pass', true, 'undergraduate'),
('Standard Undergraduate', 'D', 50.00, 54.99, 1.00, 'Marginal Pass', true, 'undergraduate'),
('Standard Undergraduate', 'F', 0.00, 49.99, 0.00, 'Fail', false, 'undergraduate'),

-- Graduate Grading Scheme
('Standard Graduate', 'A+', 95.00, 100.00, 4.00, 'Excellent', true, 'graduate'),
('Standard Graduate', 'A', 90.00, 94.99, 4.00, 'Excellent', true, 'graduate'),
('Standard Graduate', 'A-', 85.00, 89.99, 3.70, 'Very Good', true, 'graduate'),
('Standard Graduate', 'B+', 80.00, 84.99, 3.30, 'Good', true, 'graduate'),
('Standard Graduate', 'B', 75.00, 79.99, 3.00, 'Good', true, 'graduate'),
('Standard Graduate', 'B-', 70.00, 74.99, 2.70, 'Satisfactory', true, 'graduate'),
('Standard Graduate', 'C', 65.00, 69.99, 2.00, 'Marginal Pass', true, 'graduate'),
('Standard Graduate', 'F', 0.00, 64.99, 0.00, 'Fail', false, 'graduate')
ON CONFLICT (scheme_name, grade) DO NOTHING;

-- Create Row Level Security policies (optional, for multi-tenant applications)
-- ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE curriculum ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE examination ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE grading ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE calendar ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions (adjust as needed for your auth setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON TABLE departments IS 'Academic departments within the institution';
COMMENT ON TABLE programs IS 'Academic programs offered by departments';
COMMENT ON TABLE courses IS 'Individual courses offered within programs';
COMMENT ON TABLE curriculum IS 'Course requirements for each program';
COMMENT ON TABLE schedule IS 'Class scheduling information';
COMMENT ON TABLE examination IS 'Examination scheduling and management';
COMMENT ON TABLE grading IS 'Grading schemes and grade definitions';
COMMENT ON TABLE calendar IS 'Academic calendar and institutional events';

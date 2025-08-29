
🎓 NPIPNG Academic Grading System - Setup Instructions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 STEP 1: Open Supabase SQL Editor
   🌐 Go to: https://mphukdmfachfactydnht.supabase.co/project/_/sql/new

📋 STEP 2: Execute Academic Schema
   1. Open file: /public/setup-academic-schema.sql
   2. Copy ALL content (Ctrl+A, Ctrl+C)
   3. Paste in Supabase SQL Editor (Ctrl+V)
   4. Click "Run" button (or Ctrl+Enter)
   5. Wait for completion (30-60 seconds)

📋 STEP 3: Execute Sample Data (Optional for Testing)
   1. Open file: /public/setup-sample-data.sql
   2. Copy ALL content and paste in SQL Editor
   3. Click "Run" to add test data
   4. Verify sample students and courses are created

📋 STEP 4: Verify Setup Success
   ✅ Should see tables created:
      • academic_programs
      • courses
      • course_enrollments
      • assessment_configs
      • assessments
      • student_grades
      • course_grades
      • academic_records
      • grade_scales

📋 STEP 5: Test Your Academic System
   🚀 Start development server: bun run dev

   👩‍🏫 Faculty Portal:
      http://localhost:3000/dash/academic/faculty-assessments

   🎓 Student Portal:
      http://localhost:3000/dash/academic/student-grades

   📊 Analytics Dashboard:
      http://localhost:3000/dash/analytics

🎯 Expected Features Working:
   ✅ 40%/60% Internal/External assessment weighting
   ✅ 7 assessment types per course
   ✅ Real-time GPA calculations (4.0 scale)
   ✅ Automated grade letter assignments (A+ to F)
   ✅ Faculty grading tools and analytics
   ✅ Student progress tracking and transcripts
   ✅ Executive dashboard with performance charts

🔧 Troubleshooting:
   • If tables aren't created: Check for SQL syntax errors
   • If permissions error: Ensure you're project owner/admin
   • If data missing: Re-run the sample data script
   • For help: Check Supabase logs in Dashboard

🎉 Success Indicators:
   • No SQL errors in Supabase editor
   • Tables visible in Supabase Table Editor
   • Grade scale data populated (A+ to F)
   • Sample programs and courses created
   • Faculty and student portals load without errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 Ready to transform academic management with automated grading!

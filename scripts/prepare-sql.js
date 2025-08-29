#!/usr/bin/env node

/**
 * SQL Preparation Script for Supabase Setup
 * Prepares SQL files and provides copy-paste instructions
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🎓 NPIPNG Academic Grading System - SQL Preparation\n')

function prepareSQLFile(inputPath, outputPath, description) {
  if (!existsSync(inputPath)) {
    console.log(`❌ File not found: ${inputPath}`)
    return false
  }

  try {
    const content = readFileSync(inputPath, 'utf8')

    // Clean up the SQL content
    const cleanedContent = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')

    // Add header comment
    const header = `-- =================================
-- NPIPNG Academic Grading System Setup
-- ${description}
-- Execute this in Supabase SQL Editor
-- =================================

`

    const finalContent = header + cleanedContent

    // Write to output file
    writeFileSync(outputPath, finalContent, 'utf8')

    const lines = finalContent.split('\n').length
    const sizeKB = Math.round(finalContent.length / 1024)

    console.log(`✅ Prepared: ${description}`)
    console.log(`   📄 Input: ${path.basename(inputPath)}`)
    console.log(`   📄 Output: ${path.basename(outputPath)}`)
    console.log(`   📏 Size: ${sizeKB}KB (${lines} lines)`)

    return true
  } catch (error) {
    console.log(`❌ Error preparing ${description}:`, error.message)
    return false
  }
}

function generateSetupInstructions() {
  const instructions = `
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
`

  writeFileSync(path.join(__dirname, '..', 'SETUP_INSTRUCTIONS.md'), instructions, 'utf8')
  console.log(`✅ Generated: Setup Instructions`)
  console.log(`   📄 File: SETUP_INSTRUCTIONS.md`)
}

// Main function
function prepareSQLFiles() {
  console.log('📁 Preparing SQL files for Supabase setup...\n')

  const publicDir = path.join(__dirname, '..', 'public')

  // Prepare main academic schema
  const academicSchemaPath = path.join(__dirname, '..', 'supabase', 'academic-schema.sql')
  const outputSchemaPath = path.join(publicDir, 'setup-academic-schema.sql')

  const schemaSuccess = prepareSQLFile(
    academicSchemaPath,
    outputSchemaPath,
    'Academic Grading Schema'
  )

  // Prepare sample data
  const sampleDataPath = path.join(__dirname, '..', 'supabase', 'sample-data.sql')
  const outputSamplePath = path.join(publicDir, 'setup-sample-data.sql')

  let sampleSuccess = false
  if (existsSync(sampleDataPath)) {
    sampleSuccess = prepareSQLFile(
      sampleDataPath,
      outputSamplePath,
      'Sample Testing Data'
    )
  } else {
    console.log('⚠️  Sample data file not found (optional)')
  }

  // Generate setup instructions
  generateSetupInstructions()

  console.log('\n🎯 Setup Files Ready!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (schemaSuccess) {
    console.log('\n📄 Ready to Copy-Paste:')
    console.log('   🗄️  Academic Schema: /public/setup-academic-schema.sql')
    if (sampleSuccess) {
      console.log('   🧪 Sample Data: /public/setup-sample-data.sql')
    }
    console.log('   📋 Instructions: /SETUP_INSTRUCTIONS.md')

    console.log('\n🚀 Quick Setup:')
    console.log('   1. Open: https://mphukdmfachfactydnht.supabase.co/project/_/sql/new')
    console.log('   2. Copy-paste: /public/setup-academic-schema.sql')
    console.log('   3. Click "Run" and wait for completion')
    console.log('   4. Start testing your academic grading system!')

  } else {
    console.log('\n❌ Setup files could not be prepared')
    console.log('Please check that the academic schema file exists')
  }
}

// Run preparation
prepareSQLFiles()

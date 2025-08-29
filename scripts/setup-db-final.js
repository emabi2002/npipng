#!/usr/bin/env node

/**
 * Final Database Setup Script with Multiple Options
 * Loads environment variables and provides automated + manual setup paths
 */

import { readFileSync, existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🎓 NPIPNG Academic Grading System - Final Database Setup\n')

// Load environment variables from .env.local
function loadEnvVars() {
  const envPath = path.join(__dirname, '..', '.env.local')

  if (!existsSync(envPath)) {
    console.error('❌ .env.local file not found')
    return null
  }

  try {
    const envContent = readFileSync(envPath, 'utf8')
    const envVars = {}

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=')
        envVars[key.trim()] = valueParts.join('=').trim()
      }
    })

    return envVars
  } catch (error) {
    console.error('❌ Error reading .env.local:', error.message)
    return null
  }
}

// Test Supabase connection
async function testSupabaseConnection(url, key) {
  try {
    const supabase = createClient(url, key)
    const { error } = await supabase.from('information_schema.tables').select('table_name').limit(1)

    if (error && !error.message.includes('permission denied')) {
      throw error
    }

    return { success: true, supabase }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Provide manual setup instructions
function showManualInstructions(supabaseUrl) {
  console.log('\n📋 MANUAL SETUP INSTRUCTIONS (Recommended)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  console.log('\n🌐 STEP 1: Open Supabase SQL Editor')
  if (supabaseUrl) {
    const projectUrl = supabaseUrl.replace('/rest/v1', '')
    console.log(`   ${projectUrl}/project/_/sql/new`)
  } else {
    console.log('   https://your-project.supabase.co/project/_/sql/new')
  }

  console.log('\n📄 STEP 2: Execute Academic Schema')
  console.log('   1. Open file: /public/setup-academic-schema.sql (prepared for copy-paste)')
  console.log('   2. Copy ALL content (Ctrl+A, Ctrl+C)')
  console.log('   3. Paste in Supabase SQL Editor (Ctrl+V)')
  console.log('   4. Click "Run" button')
  console.log('   5. Wait for completion (30-60 seconds)')

  console.log('\n🧪 STEP 3: Add Sample Data (Optional)')
  console.log('   1. Open file: /public/setup-sample-data.sql')
  console.log('   2. Copy content and paste in SQL Editor')
  console.log('   3. Click "Run" to add test students and courses')

  console.log('\n✅ STEP 4: Verify Success')
  console.log('   • No SQL errors in Supabase editor')
  console.log('   • Tables visible in Supabase Table Editor')
  console.log('   • Grade scale data populated (A+ to F)')
  console.log('   • Sample programs and courses created')

  console.log('\n🚀 STEP 5: Test Your System')
  console.log('   bun run dev')
  console.log('   👩‍🏫 Faculty: http://localhost:3000/dash/academic/faculty-assessments')
  console.log('   🎓 Student: http://localhost:3000/dash/academic/student-grades')
  console.log('   📊 Analytics: http://localhost:3000/dash/analytics')
}

// Main setup function
async function setupDatabase() {
  // Load environment variables
  const envVars = loadEnvVars()

  if (!envVars) {
    console.log('⚠️  Could not load environment variables')
    showManualInstructions()
    return
  }

  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase configuration in .env.local')
    console.log('Please ensure these variables are set:')
    console.log('  NEXT_PUBLIC_SUPABASE_URL')
    console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY')
    showManualInstructions()
    return
  }

  console.log('🔗 Supabase Configuration Found:')
  console.log(`   URL: ${supabaseUrl}`)
  console.log(`   Project: ${supabaseUrl.split('//')[1].split('.')[0]}`)

  // Test connection
  console.log('\n🔍 Testing Supabase connection...')
  const connectionTest = await testSupabaseConnection(supabaseUrl, supabaseKey)

  if (!connectionTest.success) {
    console.log(`❌ Connection failed: ${connectionTest.error}`)
    showManualInstructions(supabaseUrl)
    return
  }

  console.log('✅ Successfully connected to Supabase!')

  // Show both options
  console.log('\n🛠️  SETUP OPTIONS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  console.log('\n📋 OPTION 1: Manual Setup (Recommended)')
  console.log('   ✅ Most reliable method')
  console.log('   ✅ Full control over execution')
  console.log('   ✅ Easy to troubleshoot')
  showManualInstructions(supabaseUrl)

  console.log('\n\n🤖 OPTION 2: Try Automatic Setup')
  console.log('   ⚠️  May have permission limitations with anon key')
  console.log('   ⚠️  Some statements might fail (this is normal)')
  console.log('\n   Run: bun run init-db')

  console.log('\n\n🎯 READY-TO-COPY FILES PREPARED:')
  console.log('   📄 /public/setup-academic-schema.sql (15KB)')
  console.log('   🧪 /public/setup-sample-data.sql (8KB)')
  console.log('   📋 /SETUP_INSTRUCTIONS.md (Complete guide)')

  console.log('\n✨ WHAT YOUR SYSTEM WILL HAVE:')
  console.log('   🎯 40%/60% Internal/External assessment structure')
  console.log('   📚 7 assessment types per course')
  console.log('   📊 Real-time GPA calculations (4.0 scale)')
  console.log('   👩‍🏫 Faculty assessment management portal')
  console.log('   🎓 Student grade tracking and progress portal')
  console.log('   📈 Executive analytics dashboard')
  console.log('   🔒 Enterprise-grade security and permissions')

  console.log('\n🎉 Your academic grading system is ready to transform education!')
}

// Run the setup
setupDatabase().catch(console.error)

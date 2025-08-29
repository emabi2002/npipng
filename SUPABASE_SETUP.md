# NPIPNG ERP Supabase Integration

This document explains how to set up and use the Supabase integration for the NPIPNG ERP system.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm/bun installed
3. The NPIPNG ERP project set up locally

## Setup Instructions

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: "NPIPNG ERP"
   - Database Password: (generate a secure password)
   - Region: Choose closest to your location
5. Click "Create new project"

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. In your Supabase project dashboard, go to Settings > API
3. Copy the following values to your `.env.local` file:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)

### 3. Set Up Database Schema

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `lib/database-schema.sql`
3. Paste and run the SQL script in the Supabase SQL Editor
4. This will create all the necessary tables and relationships

### 4. Configure Row Level Security (Optional)

For production deployments, you may want to enable Row Level Security (RLS):

1. In the Supabase dashboard, go to Authentication > Settings
2. Enable "Enable Row Level Security" if you plan to add user authentication
3. Create appropriate policies for your tables based on your security requirements

## Usage

### Basic Database Operations

```typescript
import { supabaseDepartmentsDB } from "@/lib/supabase-db"

// Get all departments
const departments = await supabaseDepartmentsDB.getAll()

// Create a new department
const newDept = await supabaseDepartmentsDB.create({
  name: "Computer Science",
  code: "CS",
  description: "Department of Computer Science"
})

// Update a department
const updated = await supabaseDepartmentsDB.update(1, {
  description: "Updated description"
})

// Delete a department
const deleted = await supabaseDepartmentsDB.delete(1)
```

### Real-time Subscriptions

```typescript
// Subscribe to real-time updates
const channel = supabaseDepartmentsDB.subscribe((payload) => {
  console.log("Department updated:", payload)
  // Handle real-time updates in your UI
})

// Unsubscribe when component unmounts
supabaseDepartmentsDB.unsubscribe(channel)
```

### Offline Support

The system automatically falls back to localStorage when offline:

```typescript
// Check connection status
const status = supabaseDepartmentsDB.getStatus()
console.log("Online:", status.isOnline)
console.log("Has local data:", status.hasLocalData)

// Force sync with server
await supabaseDepartmentsDB.forceSync()
```

## Architecture

### Database Service Features

1. **Hybrid Storage**: Uses Supabase when online, localStorage when offline
2. **Real-time Updates**: Automatic synchronization across clients
3. **Conflict Resolution**: Simple last-write-wins strategy
4. **Type Safety**: Full TypeScript support
5. **Error Handling**: Graceful fallbacks and error recovery

### Available Database Instances

- `supabaseDepartmentsDB` - Department management
- `supabaseProgramsDB` - Academic programs
- `supabaseCoursesDB` - Course catalog
- `supabaseCurriculumDB` - Program curriculum requirements
- `supabaseScheduleDB` - Class scheduling
- `supabaseExaminationDB` - Exam management
- `supabaseGradingDB` - Grading schemes
- `supabaseCalendarDB` - Academic calendar

## Database Schema

### Core Tables

1. **departments** - Academic departments
2. **programs** - Academic programs offered
3. **courses** - Individual courses
4. **curriculum** - Program course requirements
5. **schedule** - Class scheduling
6. **examination** - Exam scheduling
7. **grading** - Grading schemes and definitions
8. **calendar** - Academic calendar events

### Key Features

- **Automatic timestamps** with `created_at` and `updated_at`
- **Foreign key relationships** for data integrity
- **Indexes** for optimal query performance
- **Triggers** for automatic timestamp updates
- **Default grading schemes** pre-populated

## Migration from localStorage

To migrate existing localStorage data to Supabase:

1. Export your current data:
   ```typescript
   import { exportAllData } from "@/lib/database-enhanced"
   const backup = exportAllData()
   ```

2. Save the backup to a file

3. Set up Supabase as described above

4. Import the data:
   ```typescript
   import { importAllData } from "@/lib/database-enhanced"
   const success = importAllData(backup)
   ```

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify your Supabase URL and API keys
   - Check your internet connection
   - Ensure your Supabase project is active

2. **Real-time Not Working**
   - Verify `ENABLE_REALTIME=true` in your environment
   - Check browser console for subscription errors
   - Ensure your Supabase project has real-time enabled

3. **Data Not Syncing**
   - Check the browser network tab for failed requests
   - Verify your database schema matches the expected structure
   - Check Supabase logs in the dashboard

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will show detailed logs for:
- Database operations
- Real-time subscriptions
- Sync operations
- Error handling

## Security Considerations

1. **API Keys**: Never expose service role keys to the client
2. **Row Level Security**: Enable RLS for production
3. **Data Validation**: Validate all inputs before database operations
4. **Access Control**: Implement proper user authentication and authorization

## Performance Optimization

1. **Indexing**: The schema includes optimized indexes for common queries
2. **Pagination**: Implement pagination for large datasets
3. **Caching**: Local caching is automatic with offline support
4. **Real-time**: Limit real-time subscriptions to necessary tables only

## Support

For issues related to:
- Supabase setup: Check [Supabase Documentation](https://supabase.com/docs)
- Database schema: Review the `database-schema.sql` file
- Integration issues: Check the console logs and network requests

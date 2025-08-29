'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '../supabase/client'

interface AuthUser extends User {
  full_name?: string
  role?: 'admin' | 'faculty' | 'student' | 'staff' | 'librarian'
  status?: 'active' | 'inactive' | 'suspended'
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  hasRole: (roles: string | string[]) => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error loading user profile:', error)
        setUser(authUser as AuthUser)
        return
      }

      setUser({
        ...authUser,
        full_name: profile.full_name,
        role: profile.role,
        status: profile.status
      })
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
      setUser(authUser as AuthUser)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      setUser(null)
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const hasRole = (roles: string | string[]): boolean => {
    if (!user?.role) return false

    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user?.role) return false

    // Define role-based permissions
    const permissions: Record<string, string[]> = {
      admin: [
        'manage_users', 'manage_students', 'manage_employees', 'manage_courses',
        'manage_library', 'manage_finance', 'manage_system', 'view_reports',
        'manage_announcements', 'manage_settings'
      ],
      faculty: [
        'view_students', 'manage_courses', 'view_library', 'view_reports',
        'view_announcements', 'update_grades'
      ],
      staff: [
        'view_students', 'manage_employees', 'view_library', 'manage_finance',
        'view_reports', 'view_announcements'
      ],
      librarian: [
        'view_students', 'manage_library', 'view_reports', 'view_announcements'
      ],
      student: [
        'view_own_data', 'view_courses', 'view_library', 'view_announcements',
        'view_own_finance'
      ]
    }

    return permissions[user.role]?.includes(permission) || false
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    hasRole,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) => {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, hasRole } = useAuth()

    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }

    if (!user) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    }

    return <Component {...props} />
  }
}

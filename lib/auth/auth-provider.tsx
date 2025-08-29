'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Types
export type UserRole = 'admin' | 'faculty' | 'staff' | 'student' | 'librarian' | 'finance' | 'hr';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'graduated';

export interface ExtendedUser extends User {
  full_name?: string;
  role?: UserRole;
  status?: UserStatus;
  employee_id?: string;
  student_id?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (module: string, permission: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission definitions
const DEFAULT_PERMISSIONS = {
  admin: {
    '*': ['create', 'read', 'update', 'delete', 'manage']
  },
  faculty: {
    academic: ['read', 'update'],
    students: ['read'],
    courses: ['read', 'update'],
    grades: ['create', 'read', 'update'],
    library: ['read']
  },
  staff: {
    academic: ['read'],
    students: ['read', 'update'],
    library: ['read'],
    finance: ['read']
  },
  student: {
    academic: ['read'],
    library: ['read'],
    finance: ['read'],
    profile: ['read', 'update']
  },
  librarian: {
    library: ['create', 'read', 'update', 'delete'],
    students: ['read'],
    staff: ['read']
  },
  finance: {
    finance: ['create', 'read', 'update', 'delete'],
    students: ['read'],
    invoices: ['create', 'read', 'update'],
    payments: ['create', 'read', 'update']
  },
  hr: {
    hr: ['create', 'read', 'update', 'delete'],
    employees: ['create', 'read', 'update'],
    payroll: ['create', 'read', 'update'],
    staff: ['read', 'update']
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string): Promise<ExtendedUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as ExtendedUser;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id);
      if (profile) {
        setUser({ ...session.user, ...profile });
      } else {
        setUser(session.user);
      }
      setSession(session);
    } else {
      setUser(null);
      setSession(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      await refreshUser();
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser({ ...session.user, ...profile });
          } else {
            setUser(session.user);
          }
          setSession(session);
          router.push('/dash');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          router.push('/login');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser({ ...data.user, ...profile });
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        return { error };
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            full_name: userData.full_name,
            role: userData.role || 'student',
            status: 'active',
            ...userData
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    router.push('/login');
  };

  // Role checking function
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user?.role) return false;

    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }

    return user.role === roles;
  };

  // Permission checking function
  const hasPermission = (module: string, permission: string): boolean => {
    if (!user?.role) return false;

    // Admin has all permissions
    if (user.role === 'admin') return true;

    const rolePermissions = DEFAULT_PERMISSIONS[user.role];
    if (!rolePermissions) return false;

    // Check wildcard permissions
    if (rolePermissions['*']?.includes(permission)) return true;

    // Check module-specific permissions
    if (rolePermissions[module]?.includes(permission)) return true;

    return false;
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    signUp,
    hasRole,
    hasPermission,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole | UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
          return;
        }

        if (requiredRoles && !hasRole(requiredRoles)) {
          router.push('/unauthorized');
          return;
        }
      }
    }, [user, loading, hasRole, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!user || (requiredRoles && !hasRole(requiredRoles))) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Permission component for conditional rendering
export function PermissionGate({
  module,
  permission,
  fallback = null,
  children
}: {
  module: string;
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(module, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Role component for conditional rendering
export function RoleGate({
  roles,
  fallback = null,
  children
}: {
  roles: UserRole | UserRole[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

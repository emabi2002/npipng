'use client'

import { useState } from 'react'
import { useAuth } from '../../../../lib/auth/auth-context'
import { NotificationCenter } from '../../../../components/notifications/NotificationCenter'
import { Button } from '../../../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu'
import {
  Search,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Menu,
  ChevronDown
} from 'lucide-react'

export default function DashboardHeader() {
  const { user, signOut } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSignOut = async () => {
    await signOut()
  }

  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name && !user?.email) return 'U'
    const name = user?.user_metadata?.full_name || user?.email || ''
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search across all modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-96 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notification Center */}
          <NotificationCenter />

          {/* Help Button */}
          <Button variant="ghost" size="sm" className="hover:bg-gray-100 text-gray-600 hover:text-gray-900">
            <HelpCircle className="w-5 h-5" />
          </Button>

          {/* Settings Button */}
          <Button variant="ghost" size="sm" className="hover:bg-gray-100 text-gray-600 hover:text-gray-900">
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3 hover:bg-gray-100 text-gray-900">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.email || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.user_metadata?.role || 'Member'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth/auth-context'
import { createClient } from '../../lib/supabase/client'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  DollarSign,
  BookOpen,
  Users,
  GraduationCap,
  Bot,
  Brain
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  category: 'academic' | 'finance' | 'library' | 'hr' | 'system' | 'ai'
  read: boolean
  created_at: string
  user_id: string
}

export function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Load notifications
  const loadNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      const notificationsData = data || []
      setNotifications(notificationsData)
      setUnreadCount(notificationsData.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
      // Create sample notifications for demonstration with AI-powered alerts
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: '🚨 Critical: System Backup Failed',
          message: 'Automatic backup failed at 2:00 AM. Manual backup required immediately to prevent data loss.',
          type: 'error',
          category: 'system',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          user_id: user?.id || ''
        },
        {
          id: '2',
          title: '🤖 AI Alert: At-Risk Students Detected',
          message: '5 students in CS101 showing 78% dropout probability. Immediate counseling recommended.',
          type: 'warning',
          category: 'academic',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          user_id: user?.id || ''
        },
        {
          id: '3',
          title: '💰 Fee Payment Deadline Approaching',
          message: '125 students have pending payments due December 30th. Send reminder notifications.',
          type: 'warning',
          category: 'finance',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          user_id: user?.id || ''
        },
        {
          id: '4',
          title: '🎓 New Student Applications',
          message: '45 new applications received for Spring 2025 admission. Review committee action required.',
          type: 'info',
          category: 'academic',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          user_id: user?.id || ''
        },
        {
          id: '5',
          title: '📚 Library Resource Update',
          message: 'IEEE Xplore and ACM Digital Library access now available for all students and faculty.',
          type: 'success',
          category: 'library',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          user_id: user?.id || ''
        },
        {
          id: '6',
          title: '🏆 Student Achievement',
          message: 'Programming team won National Coding Competition! Recognition ceremony scheduled.',
          type: 'success',
          category: 'academic',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
          user_id: user?.id || ''
        },
        {
          id: '7',
          title: '🤖 AI Insight: Curriculum Optimization',
          message: 'Mathematics courses show 23% higher engagement with practical examples. Consider curriculum update.',
          type: 'info',
          category: 'academic',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
          user_id: user?.id || ''
        },
        {
          id: '8',
          title: '👥 Faculty Development Workshop',
          message: 'Mandatory faculty workshop on December 10th. Please confirm attendance.',
          type: 'info',
          category: 'hr',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          user_id: user?.id || ''
        }
      ]
      setNotifications(sampleNotifications)
      setUnreadCount(sampleNotifications.filter(n => !n.read).length)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id)

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Update local state even if API call fails
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false)

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      // Update local state even if API call fails
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id)

      const notification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      // Update local state even if API call fails
      const notification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  }

  useEffect(() => {
    loadNotifications()

    // Subscribe to real-time notifications
    if (user) {
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification
            setNotifications(prev => [newNotification, ...prev])
            setUnreadCount(prev => prev + 1)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <GraduationCap className="w-4 h-4 text-blue-600" />
      case 'finance':
        return <DollarSign className="w-4 h-4 text-green-600" />
      case 'library':
        return <BookOpen className="w-4 h-4 text-purple-600" />
      case 'hr':
        return <Users className="w-4 h-4 text-orange-600" />
      case 'ai':
        return <Brain className="w-4 h-4 text-purple-600" />
      case 'system':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 text-gray-600 hover:text-gray-900">
          <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse text-blue-600' : ''}`} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0">
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
            )}
          </CardHeader>

          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getCategoryIcon(notification.category)}
                          {getNotificationIcon(notification.type)}
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-center text-blue-600 hover:text-blue-800"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Button>
            </div>
          )}
        </Card>
      </PopoverContent>
    </Popover>
  )
}

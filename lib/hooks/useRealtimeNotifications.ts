'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../supabase/client'
import { useAuth } from '../auth/auth-context'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  is_read: boolean
  expires_at?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export interface NotificationStats {
  total: number
  unread: number
  urgent: number
  byType: {
    info: number
    warning: number
    error: number
    success: number
  }
}

export function useRealtimeNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    urgent: 0,
    byType: { info: 0, warning: 0, error: 0, success: 0 }
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user?.id) return

    // Load initial notifications
    loadNotifications()

    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time notification event:', payload)
          handleRealtimeUpdate(payload)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id])

  const loadNotifications = async () => {
    if (!user?.id) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
      updateStats(data || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        setNotifications(prev => [newRecord, ...prev])
        updateStats(prev => [...prev, newRecord])
        // Show browser notification for urgent messages
        if (newRecord.priority === 'urgent') {
          showBrowserNotification(newRecord)
        }
        break

      case 'UPDATE':
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === newRecord.id ? newRecord : notification
          )
        )
        updateStats(notifications =>
          notifications.map(n => n.id === newRecord.id ? newRecord : n)
        )
        break

      case 'DELETE':
        setNotifications(prev =>
          prev.filter(notification => notification.id !== oldRecord.id)
        )
        updateStats(notifications =>
          notifications.filter(n => n.id !== oldRecord.id)
        )
        break
    }
  }

  const updateStats = (notificationList: Notification[]) => {
    const total = notificationList.length
    const unread = notificationList.filter(n => !n.is_read).length
    const urgent = notificationList.filter(n => n.priority === 'urgent').length

    const byType = notificationList.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1
      return acc
    }, { info: 0, warning: 0, error: 0, success: 0 })

    setStats({ total, unread, urgent, byType })
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id)

      if (error) throw error

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id)

      if (error) throw error

      // Local state will be updated by real-time subscription
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const createNotification = async (notification: {
    user_id: string
    title: string
    message: string
    type?: 'info' | 'warning' | 'error' | 'success'
    priority?: 'low' | 'normal' | 'high' | 'urgent'
    expires_at?: string
    metadata?: any
  }) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          type: notification.type || 'info',
          priority: notification.priority || 'normal'
        }])

      if (error) throw error
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  return {
    notifications,
    stats,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    requestNotificationPermission,
    refresh: loadNotifications
  }
}

// Notification helper functions for different modules
export const notificationHelpers = {
  // Finance notifications
  createOverdueInvoiceNotification: (studentName: string, amount: number, daysOverdue: number) => ({
    title: 'Overdue Invoice Alert',
    message: `${studentName} has an overdue invoice of $${amount.toFixed(2)} (${daysOverdue} days overdue)`,
    type: 'warning' as const,
    priority: daysOverdue > 30 ? 'urgent' as const : 'high' as const,
    metadata: { module: 'finance', type: 'overdue_invoice' }
  }),

  createPaymentReceivedNotification: (studentName: string, amount: number) => ({
    title: 'Payment Received',
    message: `Payment of $${amount.toFixed(2)} received from ${studentName}`,
    type: 'success' as const,
    priority: 'normal' as const,
    metadata: { module: 'finance', type: 'payment_received' }
  }),

  // Library notifications
  createOverdueBookNotification: (memberName: string, bookTitle: string, daysOverdue: number) => ({
    title: 'Overdue Book Alert',
    message: `${memberName} has an overdue book: "${bookTitle}" (${daysOverdue} days overdue)`,
    type: 'warning' as const,
    priority: daysOverdue > 7 ? 'urgent' as const : 'normal' as const,
    metadata: { module: 'library', type: 'overdue_book' }
  }),

  createBookReturnedNotification: (bookTitle: string, memberName: string) => ({
    title: 'Book Returned',
    message: `"${bookTitle}" has been returned by ${memberName}`,
    type: 'success' as const,
    priority: 'low' as const,
    metadata: { module: 'library', type: 'book_returned' }
  }),

  // HR notifications
  createLeaveRequestNotification: (employeeName: string, leaveType: string, days: number) => ({
    title: 'New Leave Request',
    message: `${employeeName} has requested ${days} days of ${leaveType}`,
    type: 'info' as const,
    priority: 'normal' as const,
    metadata: { module: 'hr', type: 'leave_request' }
  }),

  createLeaveApprovalNotification: (approved: boolean, leaveType: string, days: number) => ({
    title: approved ? 'Leave Request Approved' : 'Leave Request Rejected',
    message: `Your ${leaveType} request for ${days} days has been ${approved ? 'approved' : 'rejected'}`,
    type: approved ? 'success' as const : 'error' as const,
    priority: 'high' as const,
    metadata: { module: 'hr', type: 'leave_approval' }
  }),

  // Academic notifications
  createEnrollmentNotification: (studentName: string, courseName: string) => ({
    title: 'New Enrollment',
    message: `${studentName} has enrolled in ${courseName}`,
    type: 'info' as const,
    priority: 'normal' as const,
    metadata: { module: 'academic', type: 'enrollment' }
  }),

  createGradePostedNotification: (courseName: string, grade: string) => ({
    title: 'Grade Posted',
    message: `Your grade for ${courseName} has been posted: ${grade}`,
    type: 'success' as const,
    priority: 'high' as const,
    metadata: { module: 'academic', type: 'grade_posted' }
  }),

  // System notifications
  createSystemMaintenanceNotification: (scheduledTime: string) => ({
    title: 'Scheduled Maintenance',
    message: `System maintenance scheduled for ${scheduledTime}. Please save your work.`,
    type: 'warning' as const,
    priority: 'urgent' as const,
    expires_at: scheduledTime,
    metadata: { module: 'system', type: 'maintenance' }
  }),

  createWelcomeNotification: (userName: string) => ({
    title: 'Welcome to NPIPNG ERP',
    message: `Welcome ${userName}! Your account has been successfully set up.`,
    type: 'success' as const,
    priority: 'normal' as const,
    metadata: { module: 'system', type: 'welcome' }
  })
}

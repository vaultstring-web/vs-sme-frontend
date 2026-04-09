import { useEffect, useState, useCallback } from 'react'
import apiClient from '@/lib/apiClient'

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  relatedId?: string
  relatedType?: string
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface PaginatedNotifications {
  success: boolean
  data: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  unreadCount: number
}

/**
 * Hook to manage user notifications
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.get(`/notifications?page=${pageNum}&limit=${limit}`)
        const data: PaginatedNotifications = response.data
        
        setNotifications(data.data)
        setUnreadCount(data.unreadCount)
        setTotal(data.pagination.total)
        setPages(data.pagination.pages)
        setPage(pageNum)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    },
    [limit]
  )

  // Fetch unread notifications
  const fetchUnread = useCallback(async () => {
    try {
      const response = await apiClient.get('/notifications/unread')
      const data = response.data
      setNotifications(data.data)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err)
    }
  }, [])

  // Get unread count
  const getUnreadCount = useCallback(async () => {
    try {
      const response = await apiClient.get('/notifications/unread/count')
      const data = response.data
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }, [])

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`)

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }, [])

  // Mark multiple as read
  const markMultipleAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await apiClient.patch('/notifications/read-multiple', { ids: notificationIds })

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          notificationIds.includes(n.id)
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      )
      
      const readCount = notificationIds.filter(id =>
        notifications.find(n => n.id === id && !n.isRead)
      ).length
      setUnreadCount(prev => Math.max(0, prev - readCount))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }, [notifications])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)

      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      const wasUnread = notifications.find(n => n.id === notificationId)?.isRead === false
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }, [notifications])

  // Clear all
  const clearAll = useCallback(async () => {
    try {
      await apiClient.delete('/notifications')

      setNotifications([])
      setUnreadCount(0)
      setTotal(0)
    } catch (err) {
      console.error('Failed to clear notifications:', err)
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    void getUnreadCount()
  }, [getUnreadCount])

  // Set up polling for unread count (check every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      void getUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [getUnreadCount])

  return {
    notifications,
    unreadCount,
    total,
    pages,
    page,
    limit,
    loading,
    error,
    fetchNotifications,
    fetchUnread,
    getUnreadCount,
    markAsRead,
    markMultipleAsRead,
    deleteNotification,
    clearAll,
  }
}

import { useEffect, useState, useCallback } from 'react'

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
        const response = await fetch(`/api/notifications?page=${pageNum}&limit=${limit}`, {
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch notifications')
        }

        const data: PaginatedNotifications = await response.json()
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
      const response = await fetch('/api/notifications/unread', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch unread notifications')
      }

      const data = await response.json()
      setNotifications(data.data)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err)
    }
  }, [])

  // Get unread count
  const getUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/unread/count', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch unread count')
      }

      const data = await response.json()
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error('Failed to fetch unread count:', err)
    }
  }, [])

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to mark as read')
      }

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
      const response = await fetch('/api/notifications/read-multiple', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: notificationIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark as read')
      }

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
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }

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
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to clear notifications')
      }

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

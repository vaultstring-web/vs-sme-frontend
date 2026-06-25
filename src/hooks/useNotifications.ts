import { useEffect, useState, useCallback, useRef } from 'react'
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

// ── Singleton store ────────────────────────────────────────────────────────────
// Shared across all useNotifications() consumers so only ONE poller ever runs.

type Listener = (count: number) => void

let _unreadCount = 0
let _listeners: Listener[] = []
let _intervalId: ReturnType<typeof setInterval> | null = null
let _fetchInFlight = false

function notifyListeners() {
  _listeners.forEach(fn => fn(_unreadCount))
}

function subscribe(fn: Listener): () => void {
  _listeners.push(fn)
  // Immediately give the new subscriber the current value
  fn(_unreadCount)
  return () => {
    _listeners = _listeners.filter(l => l !== fn)
  }
}

async function fetchUnreadCount() {
  if (_fetchInFlight) return
  _fetchInFlight = true
  try {
    const response = await apiClient.get('/notifications/unread/count')
    _unreadCount = response.data?.unreadCount ?? 0
    notifyListeners()
  } catch (err) {
    console.error('Failed to fetch unread count:', err)
  } finally {
    _fetchInFlight = false
  }
}

function startPoller() {
  if (_intervalId !== null) return // already running
  void fetchUnreadCount() // immediate first fetch
  _intervalId = setInterval(() => void fetchUnreadCount(), 30_000)
}

function stopPoller() {
  if (_listeners.length > 0) return // still have consumers
  if (_intervalId !== null) {
    clearInterval(_intervalId)
    _intervalId = null
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(_unreadCount)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const notificationsRef = useRef(notifications)
  notificationsRef.current = notifications

  // Subscribe to singleton unread count + start/stop the shared poller
  useEffect(() => {
    startPoller()
    const unsub = subscribe(setUnreadCount)
    return () => {
      unsub()
      stopPoller()
    }
  }, [])

  // Fetch paginated notifications
  const fetchNotifications = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.get(`/notifications?page=${pageNum}&limit=${limit}`)
        const data: PaginatedNotifications = response.data
        setNotifications(data.data)
        _unreadCount = data.unreadCount
        notifyListeners()
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

  // Fetch unread notifications list
  const fetchUnread = useCallback(async () => {
    try {
      const response = await apiClient.get('/notifications/unread')
      const data = response.data
      setNotifications(data.data)
      _unreadCount = data.unreadCount
      notifyListeners()
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err)
    }
  }, [])

  // Manual trigger (still exported for compatibility)
  const getUnreadCount = useCallback(() => fetchUnreadCount(), [])

  // Mark single as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`)
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      )
      _unreadCount = Math.max(0, _unreadCount - 1)
      notifyListeners()
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }, [])

  // Mark multiple as read
  const markMultipleAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await apiClient.patch('/notifications/read-multiple', { ids: notificationIds })
      setNotifications(prev =>
        prev.map(n =>
          notificationIds.includes(n.id)
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      )
      const readCount = notificationIds.filter(id =>
        notificationsRef.current.find(n => n.id === id && !n.isRead)
      ).length
      _unreadCount = Math.max(0, _unreadCount - readCount)
      notifyListeners()
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await apiClient.delete(`/notifications/${notificationId}`)
      const wasUnread = notificationsRef.current.find(n => n.id === notificationId)?.isRead === false
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (wasUnread) {
        _unreadCount = Math.max(0, _unreadCount - 1)
        notifyListeners()
      }
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }, [])

  // Clear all
  const clearAll = useCallback(async () => {
    try {
      await apiClient.delete('/notifications')
      setNotifications([])
      setTotal(0)
      _unreadCount = 0
      notifyListeners()
    } catch (err) {
      console.error('Failed to clear notifications:', err)
    }
  }, [])

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
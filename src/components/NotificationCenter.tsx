import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications, type Notification } from '../hooks/useNotifications'
import { useAuth } from '@/hooks/useAuth'

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

/**
 * Notification center panel showing all notifications
 */
export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const { user } = useAuth()
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markMultipleAsRead,
    clearAll,
  } = useNotifications()

  useEffect(() => {
    if (open) {
      void fetchNotifications(1)
    }
  }, [open, fetchNotifications])

  const userRole = user?.role || 'APPLICANT'

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={onClose}
          role="presentation"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-40 w-full max-w-md h-full bg-card shadow-lg border-l border-border transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-foreground/60">
                {unreadCount} unread
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-9rem)] flex flex-col custom-scrollbar">
          {loading && notifications.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-foreground/40 italic">Loading...</div>
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-foreground/40">
              <svg
                className="w-12 h-12 mb-2 opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-sm">No notifications yet</p>
            </div>
          )}

          {notifications.length > 0 && (
            <div className="divide-y divide-border">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  userRole={userRole}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="sticky bottom-0 z-10 bg-card border-t border-border p-4 flex gap-2">
            <button
              onClick={() => {
                const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)
                if (unreadIds.length > 0) {
                  void markMultipleAsRead(unreadIds)
                }
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-foreground bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Individual notification item
 */
function NotificationItem({
  notification,
  userRole,
  onMarkRead,
  onDelete,
  onClose,
}: {
  notification: Notification
  userRole: string
  onMarkRead: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
}) {
  const router = useRouter()

  const handleNotificationClick = async () => {
    // 1. Mark as read
    if (!notification.isRead) {
      await onMarkRead(notification.id)
    }

    // 2. Navigate
    if (notification.relatedType && notification.relatedId) {
      const isAdmin = ['SUPER_ADMIN', 'LOAN_MANAGER', 'LOAN_OFFICER', 'ACCOUNTANT', 'AUDITOR'].includes(userRole)
      let path = ''

      if (notification.relatedType === 'application') {
        path = isAdmin 
          ? `/admin/applications/detail?id=${notification.relatedId}` 
          : `/dashboard/applications/${notification.relatedId}`
      } else if (notification.relatedType === 'loan') {
        path = isAdmin 
          ? `/admin/loans/${notification.relatedId}` 
          : `/dashboard/loans`
      }

      if (path) {
        router.push(path)
        onClose()
      }
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application.status':
        return '📋'
      case 'payment.recorded':
        return '💳'
      case 'loan.disbursed':
        return '💰'
      case 'loan.restructured':
        return '🔄'
      case 'application.data.edited':
        return '✏️'
      default:
        return '🔔'
    }
  }

  return (
    <div
      onClick={handleNotificationClick}
      className={`p-4 cursor-pointer hover:bg-foreground/5 transition-colors relative group ${
        !notification.isRead ? 'bg-primary-500/5' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 text-2xl">{getTypeIcon(notification.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm ${!notification.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/70'}`}>
                {notification.title}
              </p>
              <p className={`text-sm mt-1 break-words ${!notification.isRead ? 'text-foreground/80' : 'text-foreground/60'}`}>
                {notification.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  void onDelete(notification.id)
                }}
                className="p-1 text-foreground/30 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-foreground/40 font-medium">
              {formatTime(notification.createdAt)}
            </span>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

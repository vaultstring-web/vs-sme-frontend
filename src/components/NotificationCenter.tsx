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
        className={`fixed top-0 right-0 z-40 w-full max-w-md h-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} unread
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-9rem)] flex flex-col">
          {loading && notifications.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mb-2 opacity-50"
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
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
          <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2">
            <button
              onClick={() => {
                const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)
                if (unreadIds.length > 0) {
                  void markMultipleAsRead(unreadIds)
                }
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative group ${
        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 text-2xl">{getTypeIcon(notification.type)}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                {notification.title}
              </p>
              <p className={`text-sm mt-1 break-words ${!notification.isRead ? 'text-gray-700 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
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
                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {formatTime(notification.createdAt)}
            </p>
            {notification.relatedId && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">
                Action Required
              </span>
            )}
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="flex-shrink-0 w-2.5 h-2.5 bg-blue-600 dark:bg-blue-500 rounded-full mt-1.5 shadow-sm" />
        )}
      </div>
    </div>
  )
}

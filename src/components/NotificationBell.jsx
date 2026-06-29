import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyNotifications, fetchUnreadCount, markNotificationRead } from '../api';

const POLL_INTERVAL = 30_000; // 30 s

export default function NotificationBell() {
  const [unread, setUnread]           = useState(0);
  const [notifications, setNotifs]    = useState([]);
  const [open, setOpen]               = useState(false);
  const [loading, setLoading]         = useState(false);
  const dropdownRef                   = useRef(null);
  const navigate                      = useNavigate();

  // Poll unread count silently
  const refreshCount = useCallback(() => {
    fetchUnreadCount()
      .then(res => setUnread(res.data.unreadCount ?? 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshCount();
    const id = setInterval(refreshCount, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [refreshCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = async () => {
    setOpen(prev => !prev);
    if (!open) {
      setLoading(true);
      try {
        const res = await fetchMyNotifications();
        setNotifs(res.data || []);
      } catch {
        setNotifs([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {
      // silently fail
    }
  };

  const handleMarkAll = async () => {
    const unreadNotifs = notifications.filter(n => !n.isRead);
    await Promise.allSettled(unreadNotifs.map(n => markNotificationRead(n.id)));
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const handleSeeAll = () => {
    setOpen(false);
    navigate('/notifications');
  };

  const typeIcon = (type) => {
    if (type === 'ORDER_PLACED')  return '📦';
    if (type === 'PAYMENT_PAID')  return '💳';
    return '🔔';
  };

  return (
    <div className="notif-bell-wrapper" ref={dropdownRef}>
      <button
        className="notif-bell-btn"
        onClick={handleOpen}
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="notif-badge">{unread > 99 ? '99+' : unread}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span className="fw-semibold">Notifications</span>
            {unread > 0 && (
              <button className="notif-mark-all-btn" onClick={handleMarkAll}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notif-list">
            {loading && (
              <div className="notif-empty">Loading…</div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="notif-empty">No notifications yet.</div>
            )}

            {!loading && notifications.map(n => (
              <div
                key={n.id}
                className={`notif-item${n.isRead ? ' notif-item-read' : ''}`}
                onClick={() => !n.isRead && handleRead(n.id)}
              >
                <span className="notif-type-icon">{typeIcon(n.type)}</span>
                <div className="notif-content">
                  <p className="notif-message">{n.message}</p>
                  <p className="notif-date">
                    {new Date(n.createdDate).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && <span className="notif-dot" />}
              </div>
            ))}
          </div>

          <div className="notif-footer">
            <button className="notif-see-all-btn" onClick={handleSeeAll}>
              See all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

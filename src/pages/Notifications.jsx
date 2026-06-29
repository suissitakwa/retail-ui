import React, { useEffect, useState, useCallback } from 'react';
import { fetchMyNotifications, markNotificationRead } from '../api';

const typeIcon = (type) => {
  if (type === 'ORDER_PLACED') return '📦';
  if (type === 'PAYMENT_PAID') return '💳';
  return '🔔';
};

export default function Notifications() {
  const [notifications, setNotifs] = useState([]);
  const [loading, setLoading]      = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchMyNotifications();
      setNotifs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
    }
  };

  const handleMarkAll = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.allSettled(unread.map(n => markNotificationRead(n.id)));
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="notifications-page">
      <div className="notifications-page-header">
        <h2 className="page-title">Notifications</h2>
        {unreadCount > 0 && (
          <button className="notif-mark-all-btn" onClick={handleMarkAll}>
            Mark all as read
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-center">
          <div className="spinner" />
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="empty-state">No notifications yet.</div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="order-card" style={{ padding: 0 }}>
          {notifications.map(n => (
            <div
              key={n.id}
              className={`notif-row${n.isRead ? ' read' : ''}`}
              onClick={() => !n.isRead && handleRead(n.id)}
            >
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>
                {typeIcon(n.type)}
              </span>
              <div className="notif-row-body">
                <p className="notif-row-message">{n.message}</p>
                <p className="notif-row-date">
                  {new Date(n.createdDate).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                <span className="notif-dot" style={{ marginTop: 8 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

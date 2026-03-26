import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NotificationBell = ({ userId, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Polling every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/notification/${userId}`);
      if (res.status === 200 && Array.isArray(res.data)) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/v1/notification/mark-read/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:4000/api/v1/notification/mark-all-read/${userId}`);
      fetchNotifications();
      setShowDropdown(false);
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  };

  return (
    <div className="position-relative" style={{ display: 'inline-block', marginRight: '15px' }}>
      <button 
        className="btn btn-link text-dark p-0 position-relative" 
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ textDecoration: 'none' }}
      >
        <i className="fa fa-bell" style={{ fontSize: '1.2rem', color: '#1e293b' }}></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="dropdown-menu shadow-sm show" style={{ position: 'absolute', right: 0, top: '40px', width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 1050, borderRadius: '12px', padding: '0' }}>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light" style={{ borderRadius: '12px 12px 0 0' }}>
            <h6 className="mb-0 fw-bold">Notifications</h6>
            {unreadCount > 0 && (
              <button className="btn btn-sm btn-link text-primary p-0 text-decoration-none" style={{ fontSize: '0.8rem' }} onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="list-group list-group-flush">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif._id} className={`list-group-item list-group-item-action p-3 ${!notif.read ? 'bg-light' : ''}`} onClick={() => { if(!notif.read) markAsRead(notif._id) }} style={{ cursor: 'pointer', borderLeft: !notif.read ? '4px solid #3b82f6' : '4px solid transparent' }}>
                  <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(notif.date).toLocaleDateString()} {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </small>
                    {!notif.read && <span className="badge bg-primary" style={{ fontSize: '0.6rem' }}>New</span>}
                  </div>
                  <p className="mb-0 text-dark" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

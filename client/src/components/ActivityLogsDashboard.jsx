import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Title from './Title';
import Logout from './Logout';
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";

const ActivityLogsDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    fetchLogs();
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/activityLog');
      if (res.status === 200) {
        setLogs(res.data);
      }
    } catch (error) {
      console.error("Error fetching logs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
      const searchStr = `${log.action} ${log.description} ${log.userRole} ${log.userId}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
  });

  const getRoleBadgeColor = (role) => {
      const r = (role || '').toLowerCase();
      if(r.includes('admin')) return 'bg-danger';
      if(r.includes('officer')) return 'bg-primary';
      if(r.includes('court')) return 'bg-dark';
      if(r.includes('advocate')) return 'bg-info text-dark';
      return 'bg-secondary';
  };

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary" role="status"></div><p className="mt-2 text-muted fw-bold">Loading System Logs...</p></div>;

  return (
    <div className="landing-container pb-5" style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Area styled with Glassmorphism */}
      <div className="header-area glass-nav shadow-sm" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/admin_home" className="btn btn-sm text-dark me-2 d-flex align-items-center justify-content-center border-0 shadow-sm" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ffffff' }}>
                <i className="fa fa-arrow-left"></i>
            </Link>
            <img src={imgSmall} alt="" style={{ height: '30px' }} />
            <span className="brand-text d-none d-sm-inline-block" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}><Title /></span>
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ backgroundColor: '#1e293b', height: '2px', width: '25px', display: 'block', borderRadius: '2px' }}></span>
            <span style={{ backgroundColor: '#1e293b', height: '2px', width: '25px', display: 'block', borderRadius: '2px' }}></span>
            <span style={{ backgroundColor: '#1e293b', height: '2px', width: '25px', display: 'block', borderRadius: '2px' }}></span>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar with light styling */}
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap shadow" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel" style={{ backgroundColor: '#ffffff', width: '280px' }}>
        <button className="btn-close btn-close-dark text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close" style={{ margin: '1rem', position: 'absolute', right: 0, top: 0 }}></button>
        <div className="offcanvas-body p-0">
          <div className="sidenav-profile py-4 text-center bg-light border-bottom">
            <div className="user-profile mb-3"><img src={imgBg} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} /></div>
            <div className="user-info">
              <h6 className="user-name mb-0 fw-bold" style={{ color: '#1e293b' }}>Administrator</h6>
              <span className="small text-muted">System Management</span>
            </div>
          </div>
          <ul className="sidenav-nav py-3 ps-0" style={{ listStyle: 'none' }}>
            <li className="px-4 py-2 mb-1">
              <Link to="/admin_home" className="d-flex align-items-center text-decoration-none" style={{ color: '#475569', fontWeight: 500, transition: 'all 0.2s' }}>
                <i className="fa fa-home me-3 text-primary fs-5" style={{ width: '24px', textAlign: 'center' }}></i> Dashboard
              </Link>
            </li>
            <li className="px-4 py-2 border-top mt-3 pt-3">
              <div style={{ color: '#dc3545', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <i className="fa fa-sign-out me-3 fs-5" style={{ width: '24px', textAlign: 'center' }}></i> <Logout />
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-4" style={{ maxWidth: '1000px' }}>
          
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
            <div>
                <h2 className="fw-bold mb-1" style={{ color: '#1e293b', letterSpacing: '-0.5px' }}><i className="fa fa-history me-2 text-primary"></i>System Activity Logs</h2>
                <p className="text-muted mb-0">Monitor all actions taken across the platform.</p>
            </div>
            
            <div className="mt-3 mt-md-0 position-relative" style={{ width: '100%', maxWidth: '300px' }}>
                <input 
                    type="text" 
                    className="form-control bg-white shadow-sm" 
                    placeholder="Search logs..." 
                    style={{ borderRadius: '20px', paddingLeft: '40px', border: '1px solid #e2e8f0' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fa fa-search position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px' }}></i>
            </div>
        </div>

        <div className="card shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light" style={{ backgroundColor: '#f1f5f9' }}>
                            <tr>
                                <th className="py-3 px-4 text-uppercase text-secondary" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>Timestamp</th>
                                <th className="py-3 px-4 text-uppercase text-secondary" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>User Context</th>
                                <th className="py-3 px-4 text-uppercase text-secondary" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>Action Taken</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map(log => (
                                    <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                        <td className="py-3 px-4">
                                            <div className="fw-medium text-dark" style={{ fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleDateString()}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(log.timestamp).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="d-flex flex-column align-items-start">
                                                <span className={`badge ${getRoleBadgeColor(log.userRole)} mb-1 px-2 py-1`} style={{ borderRadius: '6px', fontSize: '10px' }}>{log.userRole}</span>
                                                <span className="text-secondary text-truncate" style={{ fontSize: '0.8rem', maxWidth: '200px' }} title={log.userId}>{log.userId}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="fw-bold" style={{ color: '#334155', fontSize: '0.9rem' }}>{log.action}</div>
                                            <div className="text-muted mt-1" style={{ fontSize: '0.8rem', lineHeight: 1.4, maxWidth: '400px', whiteSpace: 'normal' }}>
                                                {log.description}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-5">
                                        <div className="text-muted d-flex flex-column align-items-center">
                                            <i className="fa fa-folder-open-o mb-3" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                                            <h5 className="mb-1" style={{ color: '#64748b' }}>No logs found</h5>
                                            <p className="small mb-0">Try adjusting your search filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default ActivityLogsDashboard;

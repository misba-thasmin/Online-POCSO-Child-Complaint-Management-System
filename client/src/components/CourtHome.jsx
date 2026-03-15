import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import "./css/Landing.css"; // Reuse existing styles

const CourtHome = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['courtEmail']);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalCases: 0, pendingCases: 0, activeCases: 0, completedCases: 0, firCases: 0 });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Soft gradient background for the whole page
    document.body.style.background = 'linear-gradient(135deg, #F0F7FF 0%, #ffffff 100%)';
    
    if (!cookies.courtEmail) {
      navigate('/court_auth');
    } else {
      fetchDashboardData();
    }

    return () => {
      document.body.style.background = ''; // Clean up on unmount
    };
  }, [cookies, navigate]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axios.get('http://localhost:4000/api/v1/court/analytics');
      if(statsRes.data.success) setStats(statsRes.data.stats);

      const logsRes = await axios.get('http://localhost:4000/api/v1/court/logs');
      if(logsRes.data.success) setLogs(logsRes.data.logs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    removeCookie('courtEmail', { path: '/' });
    localStorage.removeItem('courtToken');
    navigate('/court_auth');
  };

  return (
    <div className="landing-container" style={{ background: 'transparent' }}>
      {/* Header Section */}
      <div className="header-area glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <Link to="/court_home" className="logo-wrapper text-decoration-none" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa fa-university fs-4" style={{ color: '#3b82f6' }}></i>
            <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Court Dashboard</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="d-none d-md-inline" style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
              Welcome, {cookies.courtEmail}
            </span>
            <button 
              onClick={handleLogout} 
              className="btn rounded-pill px-4 py-2"
              style={{ 
                fontWeight: '600', 
                transition: 'all 0.3s ease',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#b91c1c',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ef4444';
                e.target.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                e.target.style.color = '#b91c1c';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="page-content-wrapper" style={{ minHeight: 'calc(100vh - 80px)', padding: '3rem 0 6rem 0' }}>
        <div className="container">
          
          {/* Dashboard Title */}
          <div className="section-heading d-flex flex-column align-items-center justify-content-center mb-5">
            <h2 className="hero-title" style={{ fontSize: '3rem', marginBottom: '0.5rem', textAlign: 'center', color: '#0f172a' }}>
              Court <span>Dashboard</span>
            </h2>
            <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '2px' }}></div>
          </div>

          {/* Feature Cards (Main Navigation) */}
          <main className="portals-grid mb-5" style={{ padding: '0 1rem' }}>
            <Link to="/manage_firs" className="portal-card">
              <div className="portal-icon user-icon" style={{ color: '#3B82F6' }}>
                <i className="fa fa-file-text-o"></i>
              </div>
              <h2 className="portal-title">Manage FIRs</h2>
              <p className="portal-desc">View and register FIR records submitted by police officers.</p>
              <div className="portal-btn btn-primary-glass">OPEN FIR MANAGEMENT</div>
            </Link>

            <Link to="/manage_court_cases" className="portal-card">
              <div className="portal-icon officer-icon" style={{ color: '#F59E0B' }}>
                <i className="fa fa-gavel"></i>
              </div>
              <h2 className="portal-title">Court Cases</h2>
              <p className="portal-desc">File and manage court cases linked with FIR records.</p>
              <div className="portal-btn btn-warning-glass">VIEW CASES</div>
            </Link>

            <Link to="/manage_hearings" className="portal-card">
              <div className="portal-icon advocate-icon" style={{ color: '#22C55E' }}>
                <i className="fa fa-calendar-check-o"></i>
              </div>
              <h2 className="portal-title">Manage Hearings</h2>
              <p className="portal-desc">Schedule and manage upcoming court hearings.</p>
              <div className="portal-btn btn-success-glass">SCHEDULE HEARING</div>
            </Link>

            <Link to="/manage_judgments" className="portal-card">
              <div className="portal-icon admin-icon" style={{ color: '#8B5CF6' }}>
                <i className="fa fa-balance-scale"></i>
              </div>
              <h2 className="portal-title">Manage Judgments</h2>
              <p className="portal-desc">Record and manage final court verdicts and case closures.</p>
              <div className="portal-btn btn-primary-glass" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', borderColor: 'rgba(139, 92, 246, 0.2)' }}>ISSUE JUDGMENT</div>
            </Link>
          </main>

          {/* Case Overview Section */}
          <div className="mb-5 px-3">
            <h4 className="fw-bold mb-4" style={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa fa-pie-chart text-primary"></i> Case Overview
            </h4>
            
            <div className="row g-4 flex-wrap">
              {[
                { label: "Total FIRs", val: stats.firCases, icon: "fa-folder-open", color: "#3B82F6", bg: "#EFF6FF" },
                { label: "Total Court Cases", val: stats.totalCases, icon: "fa-briefcase", color: "#8B5CF6", bg: "#F5F3FF" },
                { label: "Active (Under Trial)", val: stats.activeCases, icon: "fa-refresh", color: "#F59E0B", bg: "#FFFBEB" },
                { label: "Pending Setup", val: stats.pendingCases, icon: "fa-hourglass-half", color: "#EF4444", bg: "#FEF2F2" },
                { label: "Resolved / Closed", val: stats.completedCases, icon: "fa-check-circle", color: "#22C55E", bg: "#F0FDF4" },
              ].map((card, i) => (
                <div className="col-12 col-sm-6 col-lg-2" style={{ flex: '1 1 0', minWidth: '180px' }} key={i}>
                  <div className="card text-center border-0 h-100" style={{ 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                    background: 'white'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                  }}
                  >
                    <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                      <div className="rounded-circle mb-3 d-flex align-items-center justify-content-center" 
                           style={{ backgroundColor: card.bg, color: card.color, width: '56px', height: '56px' }}>
                        <i className={`fa ${card.icon} fs-4`}></i>
                      </div>
                      <h3 className="fw-bold mb-1" style={{ color: card.color, fontSize: '2rem' }}>{card.val}</h3>
                      <span className="text-secondary small fw-medium text-uppercase tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>{card.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity & Status Section */}
          <div className="row g-4 px-3 mb-5">
            {/* Left Panel: Recent Activities */}
            <div className="col-12 col-lg-8">
              <div className="card border-0 h-100" style={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                background: 'white'
              }}>
                <div className="card-header bg-white border-bottom pt-4 pb-3 px-4" style={{ borderColor: 'rgba(0,0,0,0.05) !important' }}>
                  <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}><i className="fa fa-history text-primary me-2"></i> Recent Activities</h5>
                </div>
                <div className="card-body p-0" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  {logs.length > 0 ? (
                    <ul className="list-group list-group-flush border-0">
                      {logs.map((log) => (
                        <li key={log._id} className="list-group-item px-4 py-3 border-bottom d-flex align-items-start" style={{ borderColor: 'rgba(0,0,0,0.03) !important', transition: 'background-color 0.2s ease' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                          <div className="rounded-circle bg-light p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                            <i className="fa fa-bolt text-primary"></i>
                          </div>
                          <div>
                            <p className="mb-1 fw-bold" style={{ color: '#334155' }}>
                              {log.action} <span className="small text-muted fw-normal">by {log.userName}</span>
                            </p>
                            <p className="mb-2 small" style={{ color: '#64748b' }}>{log.details}</p>
                            <span className="badge bg-light text-secondary border" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                              {new Date(log.dateCreated).toLocaleString()}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-5 d-flex flex-column align-items-center">
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                        <i className="fa fa-clock-o text-muted fs-3"></i>
                      </div>
                      <p className="text-muted mb-0 fw-medium">No recent activities found.</p>
                      <p className="small text-muted mt-1">Activities will appear here once actions are performed.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Panel: Case Status */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 h-100" style={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                background: 'white'
              }}>
                <div className="card-header bg-white border-bottom pt-4 pb-3 px-4" style={{ borderColor: 'rgba(0,0,0,0.05) !important' }}>
                  <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}><i className="fa fa-bar-chart text-primary me-2"></i> Case Status</h5>
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-center">
                   
                   {/* Active Cases Progress */}
                   <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold" style={{ color: '#475569', fontSize: '0.9rem' }}>Active Cases</span>
                        <span className="small fw-bold px-2 py-1 rounded-pill" style={{ backgroundColor: '#FFFBEB', color: '#F59E0B' }}>
                          {stats.totalCases > 0 ? Math.round((stats.activeCases/stats.totalCases)*100) : 0}%
                        </span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: `${stats.totalCases > 0 ? (stats.activeCases/stats.totalCases)*100 : 0}%`, backgroundColor: '#F59E0B' }}></div>
                      </div>
                   </div>

                   {/* Pending Cases Progress */}
                   <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold" style={{ color: '#475569', fontSize: '0.9rem' }}>Pending Cases</span>
                        <span className="small fw-bold px-2 py-1 rounded-pill" style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}>
                          {stats.totalCases > 0 ? Math.round((stats.pendingCases/stats.totalCases)*100) : 0}%
                        </span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: `${stats.totalCases > 0 ? (stats.pendingCases/stats.totalCases)*100 : 0}%`, backgroundColor: '#EF4444' }}></div>
                      </div>
                   </div>
                   
                   {/* Completed Cases Progress */}
                   <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold" style={{ color: '#475569', fontSize: '0.9rem' }}>Closed Cases</span>
                        <span className="small fw-bold px-2 py-1 rounded-pill" style={{ backgroundColor: '#F0FDF4', color: '#22C55E' }}>
                          {stats.totalCases > 0 ? Math.round((stats.completedCases/stats.totalCases)*100) : 0}%
                        </span>
                      </div>
                      <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: `${stats.totalCases > 0 ? (stats.completedCases/stats.totalCases)*100 : 0}%`, backgroundColor: '#22C55E' }}></div>
                      </div>
                   </div>
                   
                   {/* Info Box */}
                   <div className="mt-4 p-3 rounded d-flex gap-3 align-items-start" style={{ backgroundColor: '#F8FAFC', border: '1px dashed #cbd5e1' }}>
                      <i className="fa fa-info-circle text-primary mt-1"></i>
                      <p className="small text-muted mb-0" style={{ lineHeight: '1.5' }}>
                        Analytics displayed here are updated in real-time as cases proceed through the court system.
                      </p>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtHome;

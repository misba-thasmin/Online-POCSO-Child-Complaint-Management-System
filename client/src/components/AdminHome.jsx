import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import "./css/Landing.css";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const AdminHome = () => {

  // Apply Light Theme Background explicitly
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  return (
    <div className="landing-container">

      {/* Header Area styled with Glassmorphism */}
      <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={imgSmall} alt="" style={{ height: '30px' }} />
            <span className="brand-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}><Title /></span>
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
            <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
            <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar with light styling */}
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel" style={{ backgroundColor: '#ffffff', width: '280px', borderRight: '1px solid #e2e8f0', boxShadow: '4px 0 15px rgba(0,0,0,0.05)' }}>
        <button className="btn-close btn-close-dark text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close" style={{ margin: '1.5rem 1rem 0 auto', display: 'block' }}></button>
        <div className="offcanvas-body" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>

          <div className="sidenav-profile" style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center', marginBottom: '1rem' }}>
            <div className="user-profile mb-3"><img src={imgBg} alt="Admin Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eff6ff', padding: '3px' }} /></div>
            <div className="user-info">
              <h6 className="user-name mb-1" style={{ color: '#0f172a', fontWeight: '700' }}>Admin Control Panel</h6>
              <p className="text-muted small mb-0">Complaint Management</p>
            </div>
          </div>

          <ul className="sidenav-nav ps-0" style={{ listStyle: 'none' }}>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/admin_home" className="d-flex align-items-center" style={{ color: '#3b82f6', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#eff6ff', fontWeight: '600', transition: 'all 0.2s ease' }}>
                <i className="fa fa-tachometer me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                Dashboard
              </Link>
            </li>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/post_location" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-map-marker me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                Add Location
              </Link>
            </li>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/post_officer" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-user-plus me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                Add Officer
              </Link>
            </li>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/view_officer_admin" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-id-badge me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                View Officer Profiles
              </Link>
            </li>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/view_complaint_report" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-file-text-o me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                All Reports
              </Link>
            </li>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/view_feedback" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-comments me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                View Feedbacks
              </Link>
            </li>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/view_user_admin" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-users me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                View User Profiles
              </Link>
            </li>

            <li style={{ marginBottom: '0.25rem' }}>
              <Link to="/view_advocate_admin" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-gavel me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                Approve Advocate Profiles
              </Link>
            </li>

            <li style={{ marginTop: '0.5rem', marginBottom: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
              <Link to="/admin_profile" className="d-flex align-items-center text-secondary nav-item-hover" style={{ textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '500', transition: 'all 0.2s ease' }}>
                <i className="fa fa-user-circle me-3" style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}></i>
                My Profile
              </Link>
            </li>

            <li style={{ marginTop: 'auto' }}>
              <div className="d-flex align-items-center text-danger nav-item-hover" style={{ padding: '0.75rem 1rem', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                <Logout className="w-100" />
              </div>
            </li>

          </ul>
        </div>
      </div>

      <div className="page-content-wrapper" style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0 6rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>

          <div className="section-heading d-flex align-items-center justify-content-center mb-5">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              Admin <span>Dashboard</span>
            </h2>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 justify-content-center">

            {/* Add Location */}
            <div className="col">
              <Link to="/post_location" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-map-marker text-danger" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">Add Location</h5>
                      <p className="card-text text-muted small mb-0">Register a new jurisdiction or incident area</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Add Officer */}
            <div className="col">
              <Link to="/post_officer" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-user-plus text-primary" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">Add Officer</h5>
                      <p className="card-text text-muted small mb-0">Register a new investigating officer</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* View Officer Profiles */}
            <div className="col">
              <Link to="/view_officer_admin" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-id-badge text-info" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">View Officer Profiles</h5>
                      <p className="card-text text-muted small mb-0">Manage existing officer accounts</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* All Reports */}
            <div className="col">
              <Link to="/view_complaint_report" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-file-text-o text-warning" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">All Reports</h5>
                      <p className="card-text text-muted small mb-0">View all system complaints and status reports</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* View Feedbacks */}
            <div className="col">
              <Link to="/view_feedback" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-comments text-secondary" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">View Feedbacks</h5>
                      <p className="card-text text-muted small mb-0">Read feedback submitted by users</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* View Users Profile */}
            <div className="col">
              <Link to="/view_user_admin" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-users text-success" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">View User Profiles</h5>
                      <p className="card-text text-muted small mb-0">Manage registered citizen accounts</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Approve Advocate Profiles */}
            <div className="col">
              <Link to="/view_advocate_admin" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-gavel text-success" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">Approve Advocate Profiles</h5>
                      <p className="card-text text-muted small mb-0">Review and verify advocate registrations</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* View Activity Logs */}
            <div className="col">
              <Link to="/admin_activity_logs" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-history text-primary" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">Activity Logs</h5>
                      <p className="card-text text-muted small mb-0">Monitor all system events and actions</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* My Profile */}
            <div className="col">
              <Link to="/admin_profile" style={{ textDecoration: 'none' }}>
                <div className="card h-100 shadow-sm border-0 portal-card" style={{ backgroundColor: '#ffffff', borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="icon-wrapper bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '60px', height: '60px', minWidth: '60px' }}>
                      <i className="fa fa-user-circle text-dark" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1">My Profile</h5>
                      <p className="card-text text-muted small mb-0">Manage admin account details</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="footer-nav-area glass-nav" id="footerNav" style={{ position: 'fixed', bottom: 0, width: '100%', padding: '0 1rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: 'none', height: '60px', borderRadius: '0', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.9)' }}>
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0 mb-0" style={{ listStyle: 'none', width: '100%' }}>
              <li className="active">
                <Link to="/admin_home" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
                  <i className="lni lni-home" style={{ fontSize: '20px', marginBottom: '2px' }}></i>Home
                </Link>
              </li>
              <li>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b' }}>
                  <Logout />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminHome;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./js/jquery.min.js";
import "./js/bootstrap.bundle.min.js";
import "./css/Landing.css"; // Import the landing styles

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout';
import Title from './Title';
import NotificationBell from './NotificationBell';

const UserHome = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Add light background for the entire page to match portal
    document.body.style.backgroundColor = '#f8fafc';

    // Fetch user info for sidebar
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/user/');
        const data = await response.json();
        const useremail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));

        const currentUser = data.find((user) => user.email === useremail);
        if (currentUser) {
          setUserData(currentUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    fetchUserData();

    return () => {
      document.body.style.backgroundColor = ''; // Reset on unmount
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

          <div className="d-flex align-items-center">
            {userData && <NotificationBell userId={userData._id} userType="User" />}
            <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
              <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
              <span style={{ backgroundColor: 'white', height: '2px', width: '25px', display: 'block' }}></span>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas Sidebar with light styling */}
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel" style={{ backgroundColor: '#ffffff' }}>
        <button className="btn-close btn-close-dark text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close" style={{ margin: '1rem' }}></button>

        <div className="offcanvas-body">
          <div className="sidenav-profile" style={{ padding: '1rem', textAlign: 'center' }}>
            <div className="user-profile mb-3" style={{ width: '80px', height: '80px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              {userData && userData.profilePic ? (
                <img src={`http://localhost:4000/${userData.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img src={imgBg} alt="Default" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div className="user-info">
              <h6 className="user-name mb-1" style={{ color: '#1e293b' }}>{userData ? userData.name : 'Citizen Account'}</h6>
            </div>
          </div>

          <ul className="sidenav-nav ps-0" style={{ listStyle: 'none', padding: '1rem' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Link to="/user_home" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="lni lni-home"></i>Home
              </Link>
            </li>
            <li style={{ padding: '10px 0' }}>
              <div style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Logout />
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content Area replacing old tables/cards */}
      <div className="page-content-wrapper" style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0 6rem 0' }}>
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-center mb-5">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              User <span>Dashboard</span>
            </h2>
          </div>

          <main className="portals-grid" style={{ padding: '0 1rem' }}>
            {/* Post Complaint */}
            <Link to="/post_complaint" className="portal-card" style={{ textDecoration: 'none' }}>
              <div className="portal-icon user-icon">
                <i className="fa fa-pencil"></i>
              </div>
              <h2 className="portal-title">Post Complaint</h2>
              <p className="portal-desc">Report a new incident securely and anonymously.</p>
              <div className="portal-btn btn-primary-glass">Create Report</div>
            </Link>

            {/* View My Complaint */}
            <Link to="/view_complaint_user" className="portal-card" style={{ textDecoration: 'none' }}>
              <div className="portal-icon officer-icon">
                <i className="fa fa-folder-open"></i>
              </div>
              <h2 className="portal-title">My Complaints</h2>
              <p className="portal-desc">Track the status and updates of your submitted complaints.</p>
              <div className="portal-btn btn-warning-glass">View Status</div>
            </Link>

            {/* Legal Assistance */}
            <Link to="/view_advocate" className="portal-card" style={{ textDecoration: 'none' }}>
              <div className="portal-icon advocate-icon">
                <i className="fa fa-balance-scale"></i>
              </div>
              <h2 className="portal-title">Legal Assistance</h2>
              <p className="portal-desc">Find and connect with verified advocates for legal guidance regarding your complaint.</p>
              <div className="portal-btn btn-success-glass">Get Assistance</div>
            </Link>

            {/* My Profile */}
            <Link to="/user_profile" className="portal-card" style={{ textDecoration: 'none' }}>
              <div className="portal-icon admin-icon">
                <i className="fa fa-user"></i>
              </div>
              <h2 className="portal-title">My Profile</h2>
              <p className="portal-desc">Manage your account details and personal information.</p>
              <div className="portal-btn btn-danger-glass">Manage Profile</div>
            </Link>
          </main>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="footer-nav-area glass-nav" id="footerNav" style={{ position: 'fixed', bottom: 0, width: '100%', padding: '0 1rem', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: 'none', height: '60px', borderRadius: '0', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.9)' }}>
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0 mb-0" style={{ listStyle: 'none', width: '100%' }}>
              <li className="active">
                <Link to="/user_home" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
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

export default UserHome;
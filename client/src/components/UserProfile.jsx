import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import "./css/Landing.css"; // Import the light theme styles

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import defaultAvatar from "./img/bg-img/user.png"; // Fallback image if needed, or we use icon
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const UserProfile = () => {
  const navigate = useNavigate();
  const [filteredData, setBinData] = useState([]);

  // Apply Light Theme Background
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  const EditProfile = (id) => {
    navigate("/edit_user_profile/" + id);
  }

  useEffect(() => {
    const fetchBinData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/user/');
        const data = await response.json();
        const useremail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));

        const filteredBin = data.filter((user) => user.email === useremail);
        if (response.status === 200) {
          setBinData(filteredBin);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    fetchBinData();
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
      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel" style={{ backgroundColor: '#ffffff' }}>
        <button className="btn-close btn-close-dark text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close" style={{ margin: '1rem' }}></button>
        <div className="offcanvas-body">
          <div className="sidenav-profile" style={{ padding: '1rem', textAlign: 'center' }}>
            <div className="user-profile mb-3"><img src={imgBg} alt="" style={{ width: '80px', borderRadius: '50%' }} /></div>
            <div className="user-info">
              <h6 className="user-name mb-1" style={{ color: '#1e293b' }}>Online POCSO Child Safety Complaint Management System</h6>
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

      <div className="page-content-wrapper" style={{ minHeight: 'calc(100vh - 140px)', padding: '2rem 0 6rem 0' }}>
        <div className="container" style={{ maxWidth: '700px' }}>

          <div className="section-heading d-flex align-items-center justify-content-center mb-5">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              My <span>Profile</span>
            </h2>
          </div>

          <div className="row justify-content-center">
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <div key={user._id} className="col-12">

                  <div className="card shadow-sm border-0" style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden' }}>

                    {/* Profile Banner */}
                    <div style={{ height: '120px', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', position: 'relative' }}>
                      {/* Floating Avatar */}
                      <div style={{ position: 'absolute', bottom: '-45px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ffffff', padding: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {user.profilePic ? (
                            <img src={`http://localhost:4000/${user.profilePic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <i className="fa fa-user" style={{ fontSize: '40px', color: '#64748b' }}></i>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Header Info */}
                    <div className="card-body pt-5 text-center mt-3 mb-2">
                      <h3 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '5px' }}>{user.name}</h3>
                      <span className="badge bg-light text-dark px-3 py-2 rounded-pill" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Citizen Account
                      </span>
                    </div>

                    <hr style={{ borderColor: '#f1f5f9', margin: '0 2rem' }} />

                    {/* Structured User Data */}
                    <div className="card-body p-4 p-md-5">

                      {/* Data Row - Email */}
                      <div className="d-flex align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #f8fafc' }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                          <i className="fa fa-envelope" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Email Address</small>
                          <span className="fw-bold" style={{ color: '#1e293b', fontSize: '1.05rem' }}>{user.email}</span>
                        </div>
                      </div>

                      {/* Data Row - Mobile */}
                      <div className="d-flex align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #f8fafc' }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', backgroundColor: '#ecfdf5', color: '#10b981' }}>
                          <i className="fa fa-phone" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Mobile Number</small>
                          <span className="fw-bold" style={{ color: '#1e293b', fontSize: '1.05rem' }}>{user.phone}</span>
                        </div>
                      </div>

                      {/* Data Row - City */}
                      <div className="d-flex align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #f8fafc' }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                          <i className="fa fa-building" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>City</small>
                          <span className="fw-bold" style={{ color: '#1e293b', fontSize: '1.05rem' }}>{user.city}</span>
                        </div>
                      </div>

                      {/* Data Row - Aadhaar */}
                      <div className="d-flex align-items-center mb-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', backgroundColor: '#f3e8ff', color: '#a855f7' }}>
                          <i className="fa fa-id-card" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Aadhaar Number</small>
                          <span className="fw-bold" style={{ color: '#1e293b', fontSize: '1.05rem' }}>{user.aadhaarNumber ? user.aadhaarNumber : 'Not provided'}</span>
                        </div>
                      </div>

                    </div>

                    {/* Action Footer */}
                    <div className="card-footer bg-transparent border-0 px-4 px-md-5 pb-5 pt-0 text-center">
                      <button className="portal-btn btn-primary-glass" onClick={() => EditProfile(user._id)} style={{ width: '100%', padding: '12px' }}>
                        <i className="fa fa-pencil me-2"></i> Edit Profile
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

          </div>
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

export default UserProfile;
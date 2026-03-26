import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import "./css/Landing.css"; // Import the light theme styles

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewAdvocate = () => {
  const [businessData, setBusinessData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  // Apply Light Theme Background
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/business/`);
        if (response.status === 200) {
          setBusinessData(response.data);
        } else {
          console.error('Error fetching business data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching business data:', error.message);
      }
    };
    fetchBusinessData();
  }, []);

  // Filter data based on search term, filters, and "Approved" status
  const filteredData = businessData.filter((business) => {
    const isMatch = Object.values(business).some((field) =>
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCity = cityFilter === '' || (business.city && business.city.toLowerCase() === cityFilter.toLowerCase());
    const matchesService = serviceFilter === '' || (business.service && business.service.toLowerCase().includes(serviceFilter.toLowerCase()));
    const isApproved = business.status && business.status.toLowerCase() === 'approved';
    return isMatch && matchesCity && matchesService && isApproved;
  });

  // Extract unique cities and services for filter dropdowns
  const uniqueCities = [...new Set(businessData.map(b => b.city).filter(Boolean))];
  const uniqueServices = [...new Set(businessData.map(b => b.service).filter(Boolean))];

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
        <div className="container" style={{ maxWidth: '1000px' }}>

          <div className="section-heading d-flex align-items-center justify-content-center mb-4">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              Legal <span>Assistance</span>
            </h2>
          </div>

          {/* Improved Search Bar and Filters */}
          <div className="row justify-content-center mb-5 g-3">
            <div className="col-12 col-md-12 col-lg-8">
              <div className="position-relative">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Search by name, service, locality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '30px', paddingLeft: '20px', paddingRight: '50px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                />
                <i className="fa fa-search position-absolute" style={{ right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
              </div>
            </div>
            
            <div className="col-12 col-md-6 col-lg-4">
               <select className="form-select form-select-lg" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} style={{ borderRadius: '30px', border: '1px solid #cbd5e1' }}>
                 <option value="">All Cities</option>
                 {uniqueCities.map((city, idx) => (
                   <option key={idx} value={city}>{city}</option>
                 ))}
               </select>
            </div>
            
            <div className="col-12 col-md-6 col-lg-4">
               <select className="form-select form-select-lg" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} style={{ borderRadius: '30px', border: '1px solid #cbd5e1' }}>
                 <option value="">All Services</option>
                 {uniqueServices.map((service, idx) => (
                   <option key={idx} value={service}>{service}</option>
                 ))}
               </select>
            </div>
          </div>

          {/* Advocates Grid */}
          {filteredData.length > 0 ? (
            <div className="row g-4 d-flex align-items-stretch">
              {filteredData.map((business) => (
                <div key={business._id} className="col-12 col-md-6 col-lg-6">
                  <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}>

                    {/* Top Accent Bar */}
                    <div style={{ height: '6px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}></div>

                    <div className="card-body p-4 position-relative">

                      {/* Avatar Profile Area */}
                      <div className="d-flex align-items-center justify-content-center mb-4">
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                          <i className="fa fa-balance-scale" style={{ fontSize: '30px', color: '#10b981' }}></i>
                        </div>
                      </div>

                      {/* Name Area (Centered) */}
                      <div className="text-center mb-4">
                        <h4 style={{ color: '#0f172a', fontWeight: '700', marginBottom: '4px' }}>{business.name}</h4>
                        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill" style={{ color: '#475569', fontSize: '0.85rem' }}>
                          <i className="fa fa-briefcase me-1" style={{ color: '#3b82f6' }}></i> {business.service}
                        </span>
                      </div>

                      <hr style={{ borderColor: '#f1f5f9', margin: '1.5rem 0' }} />

                      <div className="row g-3">
                        {/* Status/Availability Column */}
                        <div className="col-12">
                          <div className="d-flex align-items-start">
                            <div className="mt-1 me-3" style={{ color: '#8b5cf6', width: '20px', textAlign: 'center' }}><i className="fa fa-clock-o"></i></div>
                            <div>
                              <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Availability</small>
                              <span className="fw-bold" style={{ color: '#334155', fontSize: '0.95rem' }}>{business.available}</span>
                            </div>
                          </div>
                        </div>

                        {/* Location Column */}
                        <div className="col-12">
                          <div className="d-flex align-items-start">
                            <div className="mt-1 me-3" style={{ color: '#f59e0b', width: '20px', textAlign: 'center' }}><i className="fa fa-map-marker"></i></div>
                            <div>
                              <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Location</small>
                              <span className="d-block" style={{ color: '#334155', fontSize: '0.90rem' }}>{business.address}</span>
                              <span className="d-block fw-bold" style={{ color: '#0f172a', fontSize: '0.90rem' }}>{business.locality}, {business.city}</span>
                            </div>
                          </div>
                        </div>

                        {/* Contact Column */}
                        <div className="col-12">
                          <div className="d-flex align-items-start">
                            <div className="mt-1 me-3" style={{ color: '#10b981', width: '20px', textAlign: 'center' }}><i className="fa fa-phone"></i></div>
                            <div>
                              <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Contact</small>
                              <a href={`tel:${business.mobile}`} className="fw-bold text-decoration-none" style={{ color: '#10b981', fontSize: '1.05rem' }}>{business.mobile}</a>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Action Footer */}
                    <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-2 text-center d-flex gap-2">
                      <Link to={`/view_advocate_details/${business._id}`} className="portal-btn btn-primary d-inline-block text-decoration-none shadow-sm" style={{ width: '50%', padding: '0.6rem 0', borderRadius: '10px' }}>
                        <i className="fa fa-user me-2"></i> View Profile
                      </Link>
                      <a className="portal-btn btn-outline-primary d-inline-block text-decoration-none" target="_blank" rel="noopener noreferrer" href={`https://maps.google.com/?q=${business.lat},${business.long}`} style={{ width: '50%', padding: '0.6rem 0', borderRadius: '10px' }}>
                        <i className="fa fa-map-o me-2"></i> Show Map
                      </a>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}><i className="fa fa-users"></i></div>
              <h5 className="text-secondary">No advocates found.</h5>
              <p className="text-muted">No verified advocates match your current search.</p>
            </div>
          )}

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

    </div >
  )
}

export default ViewAdvocate;
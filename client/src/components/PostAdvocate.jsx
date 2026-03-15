import React, { useState, useEffect } from 'react';
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

const PostAdvocate = () => {

  const [formData, setFormData] = useState({
    advocateemail: '',
    name: '',
    service: '',
    available: '',
    locality: '',
    address: '',
    city: '',
    mobile: '',
    experience: '',
    barCouncilNumber: '',
    totalCasesHandled: '',
    completedCases: '',
    successRate: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  const postBusinessData = async () => {
    const token = localStorage.getItem('token');
    const vendorEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)advocateemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));

    try {
      const response = await fetch('http://localhost:4000/api/v1/business/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          ...formData,
          advocateemail: vendorEmail,
        }),
      });

      if (response.ok) {
        console.log('Business data posted successfully!');
        alert('Created Successfully');
        window.location.href = "view_my_advocate";
      } else {
        console.error('Error posting business data:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting business data:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset validation error for the current field when it's being modified
    setValidationErrors({
      ...validationErrors,
      [name]: '',
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be exactly 10 digits';
      isValid = false;
    }
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    postBusinessData();
  };

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
              <h6 className="user-name mb-1" style={{ color: '#1e293b' }}>Complaint Management System</h6>
            </div>
          </div>
          <ul className="sidenav-nav ps-0" style={{ listStyle: 'none', padding: '1rem' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Link to="/advocate_home" style={{ color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
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

          <div className="section-heading d-flex align-items-center justify-content-center mb-4">
            <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: 0, textAlign: 'center' }}>
              Add Advocate <span>Service</span>
            </h2>
          </div>

          <div className="card shadow-sm border-0" style={{ borderRadius: '20px', backgroundColor: '#ffffff' }}>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold mb-2">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                      <i className="fa fa-user text-primary" style={{ width: '16px', textAlign: 'center' }}></i>
                    </span>
                    <input className="form-control bg-light border-0" name="name" id="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Enter advocate's full name" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold mb-2">Services Provided</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                      <i className="fa fa-briefcase text-success" style={{ width: '16px', textAlign: 'center' }}></i>
                    </span>
                    <input className="form-control bg-light border-0" name="service" id="service" value={formData.service} onChange={handleInputChange} type="text" placeholder="e.g., Civil Law, Criminal Defense" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold mb-2">Availability</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                      <i className="fa fa-clock-o text-warning" style={{ width: '16px', textAlign: 'center' }}></i>
                    </span>
                    <input className="form-control bg-light border-0" name="available" id="available" value={formData.available} onChange={handleInputChange} type="text" placeholder="e.g., Mon-Fri, 9AM - 5PM" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                  </div>
                </div>

                {/* Locality */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold mb-2">Locality / Area</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                        <i className="fa fa-map-marker text-danger" style={{ width: '16px', textAlign: 'center' }}></i>
                      </span>
                      <input className="form-control bg-light border-0" name="locality" id="locality" value={formData.locality} onChange={handleInputChange} type="text" placeholder="Sector 5, Downtown" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                    </div>
                  </div>

                  {/* City */}
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold mb-2">City</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                        <i className="fa fa-building text-secondary" style={{ width: '16px', textAlign: 'center' }}></i>
                      </span>
                      <input className="form-control bg-light border-0" name="city" id="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="City name" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold mb-2">Full Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                      <i className="fa fa-home text-info" style={{ width: '16px', textAlign: 'center' }}></i>
                    </span>
                    <input className="form-control bg-light border-0" name="address" id="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Complete office or home address" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                  </div>
                </div>

                {/* Mobile */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold mb-2">Contact Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                      <i className="fa fa-phone text-dark" style={{ width: '16px', textAlign: 'center' }}></i>
                    </span>
                    <input className="form-control bg-light border-0" name="mobile" id="mobile" value={formData.mobile} onChange={handleInputChange} type="text" placeholder="10-digit mobile number" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                  </div>
                  {validationErrors.mobile && <div className="text-danger small mt-2 d-flex align-items-center"><i className="fa fa-exclamation-circle me-1"></i>{validationErrors.mobile}</div>}
                </div>

                <hr className="my-5" style={{ borderColor: '#e2e8f0' }} />
                
                <h5 className="mb-4 text-primary" style={{ fontWeight: 600 }}><i className="fa fa-id-card-o me-2"></i>Professional Details</h5>

                {/* Experience & Bar Council */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold mb-2">Years of Experience</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                        <i className="fa fa-star text-warning" style={{ width: '16px', textAlign: 'center' }}></i>
                      </span>
                      <input className="form-control bg-light border-0" name="experience" id="experience" value={formData.experience} onChange={handleInputChange} type="number" placeholder="Years of practice" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold mb-2">Bar Council Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                        <i className="fa fa-certificate text-success" style={{ width: '16px', textAlign: 'center' }}></i>
                      </span>
                      <input className="form-control bg-light border-0" name="barCouncilNumber" id="barCouncilNumber" value={formData.barCouncilNumber} onChange={handleInputChange} type="text" placeholder="e.g. MH/1234/2015" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                    </div>
                  </div>
                </div>

                {/* Case Statistics */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold mb-2">Total Cases</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                        <i className="fa fa-folder-open text-primary" style={{ width: '16px', textAlign: 'center' }}></i>
                      </span>
                      <input className="form-control bg-light border-0" name="totalCasesHandled" id="totalCasesHandled" value={formData.totalCasesHandled} onChange={handleInputChange} type="number" placeholder="Total" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold mb-2">Completed</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                        <i className="fa fa-check-square-o text-success" style={{ width: '16px', textAlign: 'center' }}></i>
                      </span>
                      <input className="form-control bg-light border-0" name="completedCases" id="completedCases" value={formData.completedCases} onChange={handleInputChange} type="number" placeholder="Completed" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-muted small fw-bold mb-2">Success Rate</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0" style={{ borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                        <i className="fa fa-line-chart text-info" style={{ width: '16px', textAlign: 'center' }}></i>
                      </span>
                      <input className="form-control bg-light border-0" name="successRate" id="successRate" value={formData.successRate} onChange={handleInputChange} type="text" placeholder="e.g. 95%" style={{ borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '0.75rem 1rem' }} required />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button className="btn btn-primary w-100 py-3 fw-bold shadow-sm" style={{ border: 'none', borderRadius: '10px', transition: 'all 0.3s ease', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }} type="submit"
                    onMouseOver={(e) => Object.assign(e.target.style, { transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)' })}
                    onMouseOut={(e) => Object.assign(e.target.style, { transform: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' })}>
                    <i className="fa fa-check-circle me-2"></i> Submit Advocate Details
                  </button>
                </div>

              </form>
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
                <Link to="/advocate_home" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px' }}>
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

export default PostAdvocate;
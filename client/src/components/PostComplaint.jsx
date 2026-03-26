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
import "./css/Landing.css";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const PostComplaint = () => {
  const [formData, setFormData] = useState({
    useremail: '',
    name: '',
    mobile: '',
    address: '',
    district: '',
    location: '',
    department: '',
    writecomplaint: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [advocates, setAdvocates] = useState([]);

  // Add light background for the entire page to match portal
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = ''; // Reset on unmount
    }
  }, []);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/business');
        if (response.ok) {
          const data = await response.json();
          const approvedAdvocates = data.filter(adv => adv.status && adv.status.toLowerCase() === 'approved');
          setAdvocates(approvedAdvocates);
        }
      } catch (error) {
        console.error('Error fetching advocates data:', error.message);
      }
    };
    fetchAdvocates();
  }, []);

  const postComplaintData = async () => {
    console.log(formData);
    const token = localStorage.getItem('token');
    const userEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, '$1'));
    try {
      const response = await fetch('http://localhost:4000/api/v1/complaint/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          ...formData,
          useremail: userEmail,
        }),
      });

      if (response.ok) {
        console.log('Complaint data posted successfully!');
        alert('Complaint Registered Successfully!');
        
        // Form resets after submission
        setFormData({
          useremail: '',
          name: '',
          mobile: '',
          address: '',
          district: '',
          location: '',
          department: '',
          writecomplaint: '',
          advocateId: ''
        });
        
        window.location.href = "/user_home";
      } else {
        const errorText = await response.text();
        console.error('Error posting Complaint data:', response.statusText);
        alert('Failed to submit complaint: ' + errorText);
      }
    } catch (error) {
      console.error('Error posting Complaint data:', error.message);
      alert('Error submitting complaint: ' + error.message);
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({
      ...validationErrors,
      [name]: '',
    });
  };

  // Validation 
  const validateForm = () => {
    let isValid = true;
    const errors = {};

    // Validate phone number
    if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Phone must be a 10-digit number';
      isValid = false;
    }
    setValidationErrors(errors);
    return isValid;
  };

  // OnForm Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit clicked");
    if (!validateForm()) {
      return;
    }
    postComplaintData();
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
        <div className="container" style={{ maxWidth: '800px' }}>

          <div className="section-heading d-flex align-items-center justify-content-center mb-4">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              Post <span>Complaint</span>
            </h2>
          </div>

          {/* New Clean Card Form Layout */}
          <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>

                {/* --- Personal Details Section --- */}
                <h5 className="mb-4" style={{ color: '#3b82f6', fontWeight: '600', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                  <i className="fa fa-user me-2"></i>Personal Details
                </h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>Name</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none' }}><i className="fa fa-user text-muted"></i></span>
                      <input className="form-control" name="name" id="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Enter your full name" style={{ borderLeft: 'none' }} required />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>Mobile Number</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none' }}><i className="fa fa-phone text-muted"></i></span>
                      <input className="form-control" name="mobile" id="mobile" value={formData.mobile} onChange={handleInputChange} type="text" placeholder="10-digit mobile number" style={{ borderLeft: 'none' }} required />
                    </div>
                    {validationErrors.mobile && <div className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>{validationErrors.mobile}</div>}
                  </div>
                </div>

                {/* --- Location Details Section --- */}
                <h5 className="mb-4 mt-5" style={{ color: '#8b5cf6', fontWeight: '600', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                  <i className="fa fa-map-marker me-2"></i>Location Details
                </h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-12">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>Address</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none' }}><i className="fa fa-home text-muted"></i></span>
                      <input className="form-control" name="address" id="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Current residential address" style={{ borderLeft: 'none' }} required />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>District</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none' }}><i className="fa fa-building text-muted"></i></span>
                      <select className="form-select" name="district" id="district" value={formData.district} onChange={handleInputChange} style={{ borderLeft: 'none' }} required>
                        <option value="">Select District...</option>
                        <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                        <option value="Kollam">Kollam</option>
                        <option value="Pathanamthitta">Pathanamthitta</option>
                        <option value="Alappuzha">Alappuzha</option>
                        <option value="Kottayam">Kottayam</option>
                        <option value="Idukki">Idukki</option>
                        <option value="Ernakulam">Ernakulam</option>
                        <option value="Thrissur">Thrissur</option>
                        <option value="Palakkad">Palakkad</option>
                        <option value="Malappuram">Malappuram</option>
                        <option value="Kozhikode">Kozhikode</option>
                        <option value="Wayanad">Wayanad</option>
                        <option value="Kannur">Kannur</option>
                        <option value="Kasaragod">Kasaragod</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>Location</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none' }}><i className="fa fa-map text-muted"></i></span>
                      <input className="form-control" name="location" id="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="Enter location manually" style={{ borderLeft: 'none' }} required />
                    </div>
                  </div>
                </div>

                {/* --- Complaint Details Section --- */}
                <h5 className="mb-4 mt-5" style={{ color: '#f59e0b', fontWeight: '600', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                  <i className="fa fa-file-text me-2"></i>Complaint Details
                </h5>

                <div className="row g-3 mb-4">
                  <div className="col-md-12">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>Complaint Type</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none' }}><i className="fa fa-tags text-muted"></i></span>
                      <select className="form-select" name="department" id="department" value={formData.department} onChange={handleInputChange} style={{ borderLeft: 'none' }} required>
                        <option value="">Select Category...</option>
                        <option value="Sexual Harassment of a Child">Sexual Harassment of a Child</option>
                        <option value="Sexual Assault">Sexual Assault</option>
                        <option value="Attempted Sexual Assault">Attempted Sexual Assault</option>
                        <option value="Online Sexual Exploitation">Online Sexual Exploitation</option>
                        <option value="Child Pornography">Child Pornography</option>
                        <option value="Physical Abuse of Child">Physical Abuse of Child</option>
                        <option value="School Abuse by Staff">School Abuse by Staff</option>
                        <option value="Child Trafficking">Child Trafficking</option>
                        <option value="Kidnapping / Missing Child">Kidnapping / Missing Child</option>
                        <option value="Forced Child Labour">Forced Child Labour</option>
                        <option value="Child Neglect">Child Neglect</option>
                        <option value="Cyber Bullying">Cyber Bullying</option>
                        <option value="Online Grooming">Online Grooming</option>
                        <option value="Emotional Abuse">Emotional Abuse</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>Complaint Description</label>
                    <textarea
                      className="form-control"
                      name="writecomplaint"
                      id="writecomplaint"
                      value={formData.writecomplaint}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="Please provide detailed information about the incident..."
                      style={{ borderRadius: '8px', padding: '12px' }}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="col-md-12">
                    <label className="form-label" style={{ fontWeight: '500', color: '#475569' }}>Select Advocate (optional)</label>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                      If you select an advocate, a legal assistance request will be sent to them along with this complaint.
                    </p>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none' }}><i className="fa fa-balance-scale text-muted"></i></span>
                      <select className="form-select" name="advocateId" id="advocateId" value={formData.advocateId || ''} onChange={handleInputChange} style={{ borderLeft: 'none' }}>
                        <option value="">No Advocate Selected</option>
                        {advocates.map(advocate => (
                          <option key={advocate._id} value={advocate._id}>{advocate.name} ({advocate.service})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-5">
                  <button className="portal-btn btn-primary-glass" type="submit" style={{ padding: '12px', fontSize: '1rem' }}>
                    <i className="fa fa-paper-plane me-2"></i> Submit Complaint
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

export default PostComplaint;
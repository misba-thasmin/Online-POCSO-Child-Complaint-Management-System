import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import "./css/Landing.css";  // Import the light theme styles

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const EditUserProfile = () => {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [editedBin, setEditedBin] = useState({
    name: '',
    email: '',
    city: '',
    phone: '',
    password: '',
    profilePic: '',
    aadhaarNumber: ''
  });

  // Apply Light Theme Background
  useEffect(() => {
    document.body.style.backgroundColor = '#f8fafc';
    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  useEffect(() => {
    const fetchBinDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/user/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEditedBin({
            name: data.name || '',
            email: data.email || '',
            password: data.password || '',
            city: data.city || '',
            phone: data.phone || '',
            profilePic: data.profilePic || '',
            aadhaarNumber: data.aadhaarNumber || ''
          });

          if (data.profilePic) {
            setProfilePicPreview(`http://localhost:4000/${data.profilePic}`);
          }
        } else {
          console.error('Error fetching User data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching User data:', error.message);
      }
    };

    fetchBinDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Aadhaar numeric constraint
    if (name === 'aadhaarNumber') {
      const numericValue = value.replace(/\D/g, ''); // Strip non-digits
      if (numericValue.length <= 12) {
        setEditedBin({
          ...editedBin,
          [name]: numericValue,
        });
      }
      return;
    }

    setEditedBin({
      ...editedBin,
      [name]: value,
    });
  };

  const handleUpdateBin = async (e) => {
    e.preventDefault();
    try {
      // Mobile number validation
      if (!/^\d{10}$/.test(editedBin.phone)) {
        alert('Mobile number must be a 10-digit number');
        return;
      }

      // Aadhaar number 12-digit validation
      if (editedBin.aadhaarNumber && editedBin.aadhaarNumber.length !== 12) {
        alert('Aadhaar number must be exactly 12 digits');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/v1/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedBin),
      });

      if (response.ok) {

        // Handle profile image upload if a file was selected
        if (selectedFile) {
          const formData = new FormData();
          formData.append('image', selectedFile);

          const uploadResponse = await fetch(`http://localhost:4000/api/v1/user/upload_profile_pic/${id}`, {
            method: 'PUT',
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.error("Failed to upload image");
            alert('Details updated, but failed to upload profile picture.');
            return window.location.href = "/user_profile";
          }
        }

        alert('User details updated successfully!');
        window.location.href = "/user_profile";
      } else {
        console.error('Not updating User details:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating User details:', error.message);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setSelectedFile(file);
        setProfilePicPreview(URL.createObjectURL(file));
      } else {
        alert('Please upload a valid JPEG or PNG image.');
      }
    }
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

      <div className="page-content-wrapper" style={{ minHeight: 'calc(100vh - 140px)', padding: '3rem 0 6rem 0' }}>
        <div className="container" style={{ maxWidth: '700px' }}>

          <div className="section-heading d-flex align-items-center justify-content-center mb-0">
            <h2 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: 0, textAlign: 'center' }}>
              Edit <span>Profile</span>
            </h2>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden' }}>

                {/* Profile Header Banner */}
                <div style={{ padding: '3rem 2rem 5rem 2rem', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', position: 'relative', textAlign: 'center' }}>
                  <h5 style={{ color: '#1e293b', fontWeight: '600', marginBottom: 0 }}>Update Information</h5>
                  <p style={{ color: '#475569', fontSize: '0.9rem' }}>Keep your account details up to date</p>

                  {/* Floating Avatar with Upload Overlay */}
                  <div style={{ position: 'absolute', bottom: '-45px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ffffff', padding: '5px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div
                      style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                      onClick={handleImageClick}
                      title="Click to update profile image"
                    >
                      {profilePicPreview ? (
                        <img src={profilePicPreview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <i className="fa fa-user" style={{ fontSize: '40px', color: '#64748b' }}></i>
                      )}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30px', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa fa-camera" style={{ color: 'white', fontSize: '12px' }}></i>
                      </div>
                    </div>

                    <input
                      type="file"
                      accept="image/jpeg, image/png"
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="card-body p-4 p-md-5 pt-5 mt-4">
                  <form onSubmit={handleUpdateBin}>

                    {/* Name Input */}
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none', color: '#94a3b8' }}><i className="fa fa-user"></i></span>
                        <input className="form-control" name="name" id="name" value={editedBin.name} onChange={handleInputChange} type="text" placeholder="Enter full name" style={{ borderLeft: 'none', backgroundColor: '#fbfcfd' }} required />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address <span className="text-muted fw-normal text-lowercase ms-1" style={{ fontSize: '0.75rem' }}>(Cannot be changed)</span></label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#f1f5f9', borderRight: 'none', color: '#94a3b8' }}><i className="fa fa-envelope"></i></span>
                        <input className="form-control" name="email" id="email" value={editedBin.email} onChange={handleInputChange} type="text" style={{ borderLeft: 'none', backgroundColor: '#f1f5f9', color: '#64748b' }} disabled />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none', color: '#94a3b8' }}><i className="fa fa-phone"></i></span>
                        <input className="form-control" name="phone" id="phone" value={editedBin.phone} onChange={handleInputChange} type="text" placeholder="10-digit mobile number" style={{ borderLeft: 'none', backgroundColor: '#fbfcfd' }} required />
                      </div>
                    </div>

                    {/* City Input */}
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none', color: '#94a3b8' }}><i className="fa fa-building"></i></span>
                        <input className="form-control" name="city" id="city" value={editedBin.city} onChange={handleInputChange} type="text" placeholder="Enter current city" style={{ borderLeft: 'none', backgroundColor: '#fbfcfd' }} required />
                      </div>
                    </div>

                    {/* Aadhaar Input */}
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aadhaar Number</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none', color: '#94a3b8' }}><i className="fa fa-id-card"></i></span>
                        <input className="form-control" name="aadhaarNumber" id="aadhaarNumber" value={editedBin.aadhaarNumber} onChange={handleInputChange} type="text" placeholder="12-digit Aadhaar Number" style={{ borderLeft: 'none', backgroundColor: '#fbfcfd' }} />
                      </div>
                    </div>

                    <hr style={{ borderColor: '#f1f5f9', margin: '2rem 0' }} />

                    {/* Password Input */}
                    <div className="mb-5">
                      <label className="form-label fw-bold" style={{ color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
                      <div className="input-group">
                        <span className="input-group-text" style={{ backgroundColor: '#f8fafc', borderRight: 'none', color: '#94a3b8' }}><i className="fa fa-lock"></i></span>
                        <input className="form-control" name="password" id="password" value={editedBin.password} onChange={handleInputChange} type="text" placeholder="Leave blank if no changes" style={{ borderLeft: 'none', backgroundColor: '#fbfcfd' }} />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button className="portal-btn btn-primary-glass w-100" type="submit" style={{ padding: '14px', fontSize: '1.05rem', borderRadius: '12px' }}>
                      <i className="fa fa-check-circle me-2"></i> Save Changes
                    </button>

                  </form>
                </div>
              </div>
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

export default EditUserProfile;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";

import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const AdminProfile = () => {
  const navigate = useNavigate();

  const LoadEdit = (id) => {
    navigate("/update_admin_profile/" + id);
  }

  const [filteredData, setBinData] = useState([]);

  useEffect(() => {
    const fetchBinData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/v1/admin/');
        const data = await response.json();
        const adminemail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)adminemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
        const filteredBin = data.filter((admin) => admin.email === adminemail);
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
    <div>
        <div className="header-area glass-nav" id="headerArea" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem' }}>
            <div className="container h-100 d-flex align-items-center justify-content-between">
                <div className="logo-wrapper" style={{color:'#020310'}}>
                    <img src={imgSmall} alt=""/> <Title /> 
                </div>
                <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>  

        <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
            <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            <div className="offcanvas-body">
                <div className="sidenav-profile">
                    <div className="user-profile"><img src={imgBg} alt=""/></div>
                    <div className="user-info">
                        <h6 className="user-name mb-1">Online Complaint Registration Management System</h6>
                    </div>
                </div>
                <ul className="sidenav-nav ps-0">
                    <li><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
                    <li><Logout /></li>  
                </ul>
            </div>
        </div>

        <div className="page-content-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="container pt-5">
                
                <div className="row justify-content-center">
                    {filteredData.length > 0 ? filteredData.map((admin) => (
                        <div key={admin._id} className="col-12 col-md-8 col-lg-6">                                        
                            <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                
                                {/* Header / Cover Image Area */}
                                <div className="bg-primary pt-5 pb-4 px-4 text-center position-relative" style={{ minHeight: '120px' }}>
                                    <h4 className="text-white fw-bold mb-0">Admin Profile</h4>
                                </div>
                                
                                <div className="card-body px-4 pt-0 pb-5 text-center position-relative">
                                    {/* Avatar floating between header and body */}
                                    <div className="d-inline-flex justify-content-center align-items-center bg-white text-primary rounded-circle shadow border border-3 border-white position-relative" style={{ width: '100px', height: '100px', marginTop: '-50px', zIndex: 10 }}>
                                        <i className="fa fa-user-circle fa-4x"></i>
                                    </div>
                                    
                                    <h4 className="fw-bold mt-3 mb-1 text-dark">System Administrator</h4>
                                    <p className="text-muted small mb-4">Super Admin Access</p>
                                    
                                    <hr className="text-muted opacity-25 mx-4 mb-4" />

                                    {/* Details Box */}
                                    <div className="bg-light p-4 rounded-4 shadow-sm text-start mb-4 mx-2">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-white p-2 rounded shadow-sm text-primary me-3 flex-shrink-0" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa fa-envelope fs-5"></i>
                                            </div>
                                            <div>
                                                <h6 className="text-muted small fw-bold text-uppercase mb-0">Email Address</h6>
                                                <span className="text-dark fw-semibold fs-6">{admin.email}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="bg-white p-2 rounded shadow-sm text-success me-3 flex-shrink-0" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa fa-shield fs-5"></i>
                                            </div>
                                            <div>
                                                <h6 className="text-muted small fw-bold text-uppercase mb-0">Role Level</h6>
                                                <span className="text-dark fw-semibold fs-6">Administrator</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-2">
                                        <button className="btn btn-primary rounded-pill py-2 w-100 fw-bold shadow-sm" onClick={() => LoadEdit(admin._id)}>
                                            <i className="fa fa-pencil me-2"></i> Edit Admin Profile
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <div className="spinner-border text-primary shadow-sm mb-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p>Loading profile data...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
            
        <div className="footer-nav-area" id="footerNav" style={{ zIndex: 900 }}>
            <div className="container h-100 px-0">
                <div className="suha-footer-nav h-100">
                    <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                        <li className="active"> <Link to="/admin_home"><i className="lni lni-home"></i>Home </Link> </li>
                        <li><Logout /></li> 
                    </ul>
                </div>
            </div>
        </div>

    </div>
  )
}

export default AdminProfile

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const ViewUserAdmin = () => {
  const navigate = useNavigate();
  const [binData, setBinData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBinData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/`);
        if (response.status === 200) {
          setBinData(response.data);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchBinData();
  }, []);

  // Filter data based on the search term
  const filteredData = binData.filter((user) => { 
    return Object.values(user).some((field) =>
      field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });  

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
                        <h6 style={{color:"#00008B"}}>Online Complaint Management</h6>
                    </div>
                </div>
                <ul className="sidenav-nav ps-0">
                    <li><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
                    <li><Logout /></li>  
                </ul>
            </div>
        </div>

        <div className="page-content-wrapper" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="container pt-4">
                
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h4 className="mb-0 text-dark fw-bold" style={{ borderLeft: '4px solid #00c6eb', paddingLeft: '10px' }}>User Details</h4>
                </div>
                
                {/* Search Bar */}
                <div className="card shadow-sm border-0 mb-4 rounded" style={{ backgroundColor: '#ffffff' }}>
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><i className="fa fa-search text-muted"></i></span>
                            <input 
                                className="form-control border-start-0 ps-0 text-dark" 
                                type="text" 
                                placeholder="Search users by name, email, city..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                {/* User Cards Grid */}
                <div className="row g-4" style={{marginTop: 5}}>
                    {filteredData.length > 0 ? filteredData.map((user) => (
                        <div key={user._id} className="col-12 col-md-6 col-xl-4">                                        
                            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ transition: 'all 0.3s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.classList.add('shadow')} onMouseOut={e => e.currentTarget.classList.remove('shadow')}>
                                <div className="card-body p-4 text-center">
                                    {/* Avatar */}
                                    <div className="mb-3">
                                        <div className="d-inline-flex justify-content-center align-items-center bg-light text-primary rounded-circle shadow-sm" style={{ width: '80px', height: '80px' }}>
                                            <i className="fa fa-user fa-2x"></i>
                                        </div>
                                    </div>
                                    
                                    {/* Name */}
                                    <h5 className="fw-bold text-dark mb-1">{user.name}</h5>
                                    <p className="text-muted small mb-3">Citizen</p>

                                    <hr className="text-muted opacity-25" />

                                    {/* Details */}
                                    <ul className="list-unstyled text-start mb-4 small">
                                        <li className="mb-2 d-flex align-items-center">
                                            <i className="fa fa-envelope text-primary me-3 flex-shrink-0" style={{ width: '16px', textAlign: 'center' }}></i>
                                            <span className="text-dark text-truncate" title={user.email}>{user.email}</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-center">
                                            <i className="fa fa-phone text-success me-3 flex-shrink-0" style={{ width: '16px', textAlign: 'center' }}></i>
                                            <span className="text-dark">{user.phone || 'N/A'}</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-center">
                                            <i className="fa fa-map-marker text-danger me-3 flex-shrink-0" style={{ width: '16px', textAlign: 'center' }}></i>
                                            <span className="text-dark">{user.city || 'N/A'}</span>
                                        </li>
                                        {user.aadhaar && (
                                            <li className="d-flex align-items-center">
                                                <i className="fa fa-id-card-o text-secondary me-3 flex-shrink-0" style={{ width: '16px', textAlign: 'center' }}></i>
                                                <span className="text-dark">Aadhaar: <span className="fw-semibold">{user.aadhaar}</span></span>
                                            </li>
                                        )}
                                    </ul>

                                    <div className="d-grid mt-auto">
                                        {/* Example button that could link somewhere, e.g., viewing user specific complaints */}
                                        <button className="btn btn-outline-primary rounded-pill btn-sm" disabled>
                                            <i className="fa fa-folder-open-o me-2"></i> View Complaints
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="fa fa-users fs-1 mb-3 d-block"></i>
                            <p>No users found matching your search.</p>
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

export default ViewUserAdmin
